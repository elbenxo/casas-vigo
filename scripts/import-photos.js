'use strict';

/**
 * import-photos.js
 *
 * Escanea web/public/images/ y rellena la tabla `photos` de la DB.
 * Mapea cada subdirectorio a un piso e infiere la habitación de los
 * archivos que empiezan por `hab-<slug>`. El resto se asocia al piso
 * (room_id NULL = zona común).
 *
 * Idempotente: respeta el UNIQUE(filename) y solo inserta lo que falta.
 *
 * Uso:
 *   node scripts/import-photos.js
 *   node scripts/import-photos.js --reset    (borra tabla photos antes)
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
// Resuelve better-sqlite3 desde agents/node_modules (este script no tiene su propio package.json)
const Database = require(path.join(REPO_ROOT, 'agents', 'node_modules', 'better-sqlite3'));
const DB_PATH = process.env.DB_PATH || path.join(REPO_ROOT, 'data', 'casasvigo.db');
const IMAGES_DIR = path.join(REPO_ROOT, 'web', 'public', 'images');
const SCHEMA_PATH = path.join(REPO_ROOT, 'agents', 'src', 'api', 'db', 'schema.sql');

// Subdir en disco → flat.slug en DB. Las rutas legacy del web no coinciden
// con los slugs cortos del DB; este mapa las reconcilia. Los uploads
// nuevos del dashboard guardan ya bajo flat.slug.
const DIR_TO_FLAT_SLUG = {
  '1-derecha': '1d',
  '3-izquierda': '3i',
  '4-derecha-atico': '4d',
  '4-izquierda-atico': '4i',
  irmandinhos: 'irmandinos',
};

const PHOTO_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

// Filenames legacy con guiones que no coinciden con el room.slug del DB
const ROOM_SLUG_FROM_FILE = {
  'blanco-negro': 'blancoynegro',
  'nueva-york': 'nuevayork',
};

function ensureSchema(db) {
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);
}

function loadFlats(db) {
  const flats = db.prepare('SELECT id, slug FROM flats').all();
  const bySlug = {};
  flats.forEach(f => { bySlug[f.slug] = f; });
  return bySlug;
}

function loadRoomsByFlat(db, flatId) {
  return db.prepare('SELECT id, slug FROM rooms WHERE flat_id = ?').all(flatId);
}

function inferRoomId(filename, rooms) {
  const base = path.basename(filename, path.extname(filename)).toLowerCase();
  if (!base.startsWith('hab-')) return null;
  let stem = base.slice(4).replace(/-\d+$/, ''); // hab-<slug>(-N)?

  while (stem) {
    const aliased = ROOM_SLUG_FROM_FILE[stem];
    const target = aliased || stem;
    const room = rooms.find(r => r.slug.toLowerCase() === target);
    if (room) return room.id;
    const idx = stem.lastIndexOf('-');
    if (idx === -1) break;
    stem = stem.slice(0, idx);
  }
  return null;
}

function* scanDir(dirAbs) {
  if (!fs.existsSync(dirAbs)) return;
  for (const name of fs.readdirSync(dirAbs).sort()) {
    const ext = path.extname(name).toLowerCase();
    if (!PHOTO_EXTS.has(ext)) continue;
    yield name;
  }
}

function importDir(db, dirName, flat, dryStats) {
  const dirAbs = path.join(IMAGES_DIR, dirName);
  if (!fs.statSync(dirAbs).isDirectory()) return;

  const rooms = loadRoomsByFlat(db, flat.id);

  const insert = db.prepare(
    `INSERT INTO photos (flat_id, room_id, filename, description, sort_order)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(filename) DO NOTHING`
  );

  // Scope-aware sort_order: por room (o por flat si no tiene room)
  const orderByScope = new Map(); // key = `flat-${id}` o `room-${id}`

  function nextOrder(roomId) {
    const key = roomId ? `room-${roomId}` : `flat-${flat.id}`;
    const cur = orderByScope.get(key);
    if (cur !== undefined) {
      const next = cur + 10;
      orderByScope.set(key, next);
      return next;
    }
    // Bootstrap desde DB: max existente del scope
    const row = roomId
      ? db.prepare('SELECT COALESCE(MAX(sort_order), 0) AS m FROM photos WHERE room_id = ?').get(roomId)
      : db.prepare('SELECT COALESCE(MAX(sort_order), 0) AS m FROM photos WHERE flat_id = ? AND room_id IS NULL').get(flat.id);
    const next = (row?.m || 0) + 10;
    orderByScope.set(key, next);
    return next;
  }

  const tx = db.transaction(() => {
    for (const name of scanDir(dirAbs)) {
      const filename = `${dirName}/${name}`;
      const roomId = inferRoomId(name, rooms);
      const result = insert.run(flat.id, roomId, filename, null, nextOrder(roomId));
      if (result.changes > 0) {
        dryStats.inserted++;
      } else {
        dryStats.skipped++;
      }
    }
  });
  tx();

  // Cover por scope (si no hay ninguna marcada)
  ensureCovers(db, flat.id, rooms);
}

function ensureCovers(db, flatId, rooms) {
  // Cover del piso (zona común): primera foto sin room_id
  const flatHasCover = db.prepare(
    'SELECT 1 FROM photos WHERE flat_id = ? AND room_id IS NULL AND is_cover = 1 LIMIT 1'
  ).get(flatId);
  if (!flatHasCover) {
    const first = db.prepare(
      'SELECT id FROM photos WHERE flat_id = ? AND room_id IS NULL AND active = 1 ORDER BY sort_order, id LIMIT 1'
    ).get(flatId);
    if (first) db.prepare('UPDATE photos SET is_cover = 1 WHERE id = ?').run(first.id);
  }

  // Cover por habitación: primera foto del room
  for (const room of rooms) {
    const has = db.prepare(
      'SELECT 1 FROM photos WHERE room_id = ? AND is_cover = 1 LIMIT 1'
    ).get(room.id);
    if (has) continue;
    const first = db.prepare(
      'SELECT id FROM photos WHERE room_id = ? AND active = 1 ORDER BY sort_order, id LIMIT 1'
    ).get(room.id);
    if (first) db.prepare('UPDATE photos SET is_cover = 1 WHERE id = ?').run(first.id);
  }
}

function main() {
  const args = process.argv.slice(2);
  const reset = args.includes('--reset');

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`No existe ${IMAGES_DIR}`);
    process.exit(1);
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  ensureSchema(db);

  if (reset) {
    db.prepare('DELETE FROM photos').run();
    console.log('Tabla photos reseteada');
  }

  const flatsBySlug = loadFlats(db);
  const stats = { inserted: 0, skipped: 0, missing: [] };

  for (const dirName of fs.readdirSync(IMAGES_DIR).sort()) {
    const dirAbs = path.join(IMAGES_DIR, dirName);
    if (!fs.statSync(dirAbs).isDirectory()) continue;

    const flatSlug = DIR_TO_FLAT_SLUG[dirName] || dirName; // fallback: el dirname ES el slug
    const flat = flatsBySlug[flatSlug];
    if (!flat) {
      stats.missing.push({ dir: dirName, expected_slug: flatSlug });
      continue;
    }

    importDir(db, dirName, flat, stats);
  }

  console.log(`Importadas: ${stats.inserted} fotos | Ya existentes: ${stats.skipped}`);
  if (stats.missing.length) {
    console.warn('Directorios sin flat asociado (saltados):');
    stats.missing.forEach(m => console.warn(`  - ${m.dir} (esperaba slug "${m.expected_slug}")`));
  }

  db.close();
}

main();
