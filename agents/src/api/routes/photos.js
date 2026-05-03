'use strict';

const { Router } = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');
const { IMAGES_DIR, PHOTO_EXTENSIONS, PHOTO_MAX_BYTES } = require('../constants');

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────

function safeFilename(name) {
  // Basename para evitar path traversal, espacios → guiones, lower-case
  const base = path.basename(name).toLowerCase();
  const ext = path.extname(base);
  const stem = base.slice(0, -ext.length || undefined)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return (stem || 'foto') + ext;
}

// Atomically write `buffer` under `dirAbs` choosing a non-colliding filename
// based on `desired`. Avoids the existsSync→write TOCTOU window by relying on
// the O_EXCL flag and bumping a numeric suffix on EEXIST.
function writeUnique(dirAbs, desired, buffer) {
  const ext = path.extname(desired);
  const stem = desired.slice(0, -ext.length);
  let candidate = desired;
  for (let n = 1; ; n++) {
    try {
      fs.writeFileSync(path.join(dirAbs, candidate), buffer, { flag: 'wx' });
      return candidate;
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
      candidate = `${stem}-${n}${ext}`;
    }
  }
}

function getFlat(flatId) {
  return getDb().prepare('SELECT id, slug FROM flats WHERE id = ?').get(flatId);
}

function getRoom(roomId) {
  return getDb().prepare('SELECT id, flat_id FROM rooms WHERE id = ?').get(roomId);
}

// ─── Multer (memoria + validación) ───────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: PHOTO_MAX_BYTES, files: 20 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!PHOTO_EXTENSIONS.has(ext)) return cb(new Error(`Extensión no permitida: ${ext}`));
    if (!file.mimetype.startsWith('image/')) return cb(new Error(`MIME no permitido: ${file.mimetype}`));
    cb(null, true);
  },
});

// Wrapper que convierte errores de multer en 400 JSON
function uploadFiles(req, res, next) {
  upload.array('files', 20)(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}

// ─── GET /api/photos ─────────────────────────────────────────

router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const { flat_id, room_id, active } = req.query;

  let sql = `SELECT p.*, f.slug AS flat_slug, f.name AS flat_name, r.slug AS room_slug, r.name AS room_name
             FROM photos p
             JOIN flats f ON f.id = p.flat_id
             LEFT JOIN rooms r ON r.id = p.room_id
             WHERE 1=1`;
  const params = [];

  if (flat_id) { sql += ' AND p.flat_id = ?'; params.push(flat_id); }
  if (room_id === 'null') { sql += ' AND p.room_id IS NULL'; }
  else if (room_id) { sql += ' AND p.room_id = ?'; params.push(room_id); }
  if (active !== undefined) { sql += ' AND p.active = ?'; params.push(active === '1' || active === 'true' ? 1 : 0); }

  sql += ' ORDER BY p.flat_id, p.is_cover DESC, p.sort_order, p.id LIMIT 2000';

  const photos = db.prepare(sql).all(...params);
  res.json({ data: photos });
}));

// ─── GET /api/photos/:id ─────────────────────────────────────

router.get('/:id', asyncRoute((req, res) => {
  const photo = getDb().prepare('SELECT * FROM photos WHERE id = ?').get(req.params.id);
  if (!photo) return res.status(404).json({ error: 'Photo not found' });
  res.json({ data: photo });
}));

// ─── POST /api/photos (multipart upload) ────────────────────

router.post('/', uploadFiles, asyncRoute((req, res) => {
  const db = getDb();
  const flatId = Number(req.body.flat_id);
  const roomId = req.body.room_id ? Number(req.body.room_id) : null;
  const description = req.body.description || null;

  if (!flatId) return res.status(400).json({ error: 'flat_id required' });
  const flat = getFlat(flatId);
  if (!flat) return res.status(400).json({ error: 'flat_id invalid' });

  if (roomId) {
    const room = getRoom(roomId);
    if (!room) return res.status(400).json({ error: 'room_id invalid' });
    if (room.flat_id !== flatId) return res.status(400).json({ error: 'room does not belong to flat' });
  }

  const files = req.files || [];
  if (!files.length) return res.status(400).json({ error: 'no files uploaded' });

  const flatDir = path.join(IMAGES_DIR, flat.slug);
  fs.mkdirSync(flatDir, { recursive: true });

  // Sort_order arranque
  const maxRow = db.prepare('SELECT COALESCE(MAX(sort_order), 0) AS m FROM photos WHERE flat_id = ?').get(flatId);
  let nextOrder = (maxRow?.m || 0) + 10;

  const insert = db.prepare(
    `INSERT INTO photos (flat_id, room_id, filename, description, sort_order)
     VALUES (?, ?, ?, ?, ?)`
  );

  const inserted = [];
  const tx = db.transaction(() => {
    for (const file of files) {
      const finalName = writeUnique(flatDir, safeFilename(file.originalname), file.buffer);
      const relPath = `${flat.slug}/${finalName}`;
      const result = insert.run(flatId, roomId, relPath, description, nextOrder);
      nextOrder += 10;

      inserted.push(db.prepare('SELECT * FROM photos WHERE id = ?').get(result.lastInsertRowid));
    }
  });
  tx();

  res.status(201).json({ data: inserted });
}));

// ─── PUT /api/photos/:id ─────────────────────────────────────

router.put('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(req.params.id);
  if (!photo) return res.status(404).json({ error: 'Photo not found' });

  // Validación cruzada: si se cambia room_id debe pertenecer al flat
  if (req.body.room_id !== undefined && req.body.room_id !== null) {
    const room = getRoom(req.body.room_id);
    if (!room) return res.status(400).json({ error: 'room_id invalid' });
    if (room.flat_id !== photo.flat_id) return res.status(400).json({ error: 'room does not belong to flat' });
  }

  const fields = ['room_id', 'description', 'active', 'is_cover', 'sort_order'];
  const updates = [];
  const params = [];

  for (const field of fields) {
    if (req.body[field] === undefined) continue;
    updates.push(`${field} = ?`);
    if (field === 'active' || field === 'is_cover') {
      params.push(req.body[field] ? 1 : 0);
    } else {
      params.push(req.body[field]);
    }
  }

  if (!updates.length) return res.json({ data: photo });
  params.push(req.params.id);

  // Si se marca como cover, desmarcar el resto del mismo scope (flat o room)
  const willCover = req.body.is_cover === true || req.body.is_cover === 1;

  const tx = db.transaction(() => {
    if (willCover) {
      if (photo.room_id) {
        db.prepare('UPDATE photos SET is_cover = 0 WHERE room_id = ? AND id != ?').run(photo.room_id, photo.id);
      } else {
        db.prepare('UPDATE photos SET is_cover = 0 WHERE flat_id = ? AND room_id IS NULL AND id != ?').run(photo.flat_id, photo.id);
      }
    }
    db.prepare(`UPDATE photos SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  });
  tx();

  const updated = db.prepare('SELECT * FROM photos WHERE id = ?').get(req.params.id);
  res.json({ data: updated });
}));

// ─── POST /api/photos/reorder ────────────────────────────────

router.post('/reorder', asyncRoute((req, res) => {
  const db = getDb();
  const { ids } = req.body;
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'ids array required' });

  const update = db.prepare('UPDATE photos SET sort_order = ? WHERE id = ?');
  const tx = db.transaction(() => {
    ids.forEach((id, idx) => update.run((idx + 1) * 10, id));
  });
  tx();

  res.json({ data: { reordered: ids.length } });
}));

// ─── DELETE /api/photos/:id ──────────────────────────────────

router.delete('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(req.params.id);
  if (!photo) return res.status(404).json({ error: 'Photo not found' });

  const absPath = path.join(IMAGES_DIR, photo.filename);
  // Solo borramos si está dentro de IMAGES_DIR (defensa contra symlinks/path)
  if (!absPath.startsWith(IMAGES_DIR + path.sep)) {
    return res.status(400).json({ error: 'invalid photo path' });
  }

  db.prepare('DELETE FROM photos WHERE id = ?').run(req.params.id);
  try { fs.unlinkSync(absPath); } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  res.json({ data: { deleted: true } });
}));

module.exports = router;
