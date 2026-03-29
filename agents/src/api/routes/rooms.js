const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

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
  const { flat_id, slug, name, price_monthly, price_nightly, size_m2, bed_type, features, available, available_from, note } = req.body;
  if (!flat_id || !slug || !name || price_monthly === undefined) {
    return res.status(400).json({ error: 'flat_id, slug, name, price_monthly required' });
  }
  const result = db.prepare(
    `INSERT INTO rooms (flat_id, slug, name, price_monthly, price_nightly, size_m2, bed_type, features, available, available_from, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    flat_id, slug, name, price_monthly,
    price_nightly ?? null, size_m2 ?? null, bed_type ?? null,
    features ? JSON.stringify(features) : null,
    available !== undefined ? (available ? 1 : 0) : 1,
    available_from ?? null, note ?? null
  );
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: room });
}));

router.put('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const fields = ['flat_id', 'slug', 'name', 'price_monthly', 'price_nightly', 'size_m2', 'bed_type', 'features', 'available', 'available_from', 'note'];
  const updates = [];
  const params = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      if (field === 'features') {
        params.push(JSON.stringify(req.body[field]));
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
}));

module.exports = router;
