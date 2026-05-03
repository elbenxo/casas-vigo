const { Router } = require('express');
const { execFile } = require('child_process');
const path = require('path');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

/**
 * Trigger availability.json sync after room changes
 * Runs asynchronously (fire-and-forget) to not block API responses
 */
function triggerAvailabilitySync() {
  const scriptPath = path.resolve(__dirname, '../../../../scripts/sync-availability.js');
  execFile(process.execPath, [scriptPath], {
    timeout: 30000,
    windowsHide: true,
  }, (err, stdout, stderr) => {
    if (err) {
      console.error('[auto-sync] availability sync failed:', err.message);
    } else {
      console.log('[auto-sync] availability.json updated');
    }
  });
}

router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const { flat_id, available } = req.query;
  let sql = 'SELECT * FROM rooms WHERE 1=1';
  const params = [];
  if (flat_id) { sql += ' AND flat_id = ?'; params.push(flat_id); }
  if (available !== undefined) { sql += ' AND available = ?'; params.push(available === '1' || available === 'true' ? 1 : 0); }
  sql += ' ORDER BY flat_id, id LIMIT 500';
  const rooms = db.prepare(sql).all(...params);
  res.json({ data: rooms });
}));

router.get('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const room = db.prepare(
    'SELECT r.*, f.name AS flat_name, f.address AS flat_address FROM rooms r JOIN flats f ON f.id = r.flat_id WHERE r.id = ?'
  ).get(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({ data: room });
}));

router.post('/', asyncRoute((req, res) => {
  const db = getDb();
  const {
    flat_id, slug, name, price_monthly, price_nightly, size_m2, bed_type,
    features, available, available_from, note, web_id, name_i18n,
  } = req.body;
  if (!flat_id || !slug || !name || price_monthly === undefined) {
    return res.status(400).json({ error: 'flat_id, slug, name, price_monthly required' });
  }
  const result = db.prepare(
    `INSERT INTO rooms (flat_id, slug, name, price_monthly, price_nightly, size_m2, bed_type,
                        features, available, available_from, note, web_id, name_i18n)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    flat_id, slug, name, price_monthly,
    price_nightly ?? null, size_m2 ?? null, bed_type ?? null,
    features ? JSON.stringify(features) : null,
    available !== undefined ? (available ? 1 : 0) : 1,
    available_from ?? null, note ?? null,
    web_id ?? null,
    name_i18n ? JSON.stringify(name_i18n) : null,
  );
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: room });
  // Trigger availability sync in background
  triggerAvailabilitySync();
}));

router.put('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const fields = [
    'flat_id', 'slug', 'name', 'price_monthly', 'price_nightly', 'size_m2', 'bed_type',
    'features', 'available', 'available_from', 'note', 'web_id', 'name_i18n',
  ];
  const updates = [];
  const params = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      if (field === 'features' || field === 'name_i18n') {
        params.push(req.body[field] === null ? null : JSON.stringify(req.body[field]));
      } else if (field === 'available') {
        params.push(req.body[field] ? 1 : 0);
      } else {
        params.push(req.body[field]);
      }
    }
  }

  updates.push("updated_at = datetime('now')");
  params.push(req.params.id);

  db.prepare(`UPDATE rooms SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  const updated = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
  res.json({ data: updated });
  // Trigger availability sync in background
  triggerAvailabilitySync();
}));

// DELETE /api/rooms/:id — only if no contracts reference it
router.delete('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const refs = db.prepare(
    'SELECT (SELECT COUNT(*) FROM contracts WHERE room_id = ?) AS contracts, ' +
    '(SELECT COUNT(*) FROM income WHERE room_id = ?) AS income, ' +
    '(SELECT COUNT(*) FROM contacts WHERE room_id = ?) AS contacts'
  ).get(req.params.id, req.params.id, req.params.id);

  if (refs.contracts || refs.income || refs.contacts) {
    return res.status(409).json({
      error: 'Cannot delete: room is referenced',
      contracts: refs.contracts, income: refs.income, contacts: refs.contacts,
    });
  }

  // Cascade delete photos for this room
  db.prepare('DELETE FROM photos WHERE room_id = ?').run(req.params.id);
  db.prepare('DELETE FROM rooms WHERE id = ?').run(req.params.id);
  res.json({ data: { deleted: true } });
  triggerAvailabilitySync();
}));

module.exports = router;
