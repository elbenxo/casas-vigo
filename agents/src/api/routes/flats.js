const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const flats = db.prepare('SELECT * FROM flats ORDER BY id LIMIT 500').all();
  res.json({ data: flats });
}));

router.get('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const flat = db.prepare('SELECT * FROM flats WHERE id = ?').get(req.params.id);
  if (!flat) return res.status(404).json({ error: 'Flat not found' });
  res.json({ data: flat });
}));

router.get('/:id/rooms', asyncRoute((req, res) => {
  const db = getDb();
  const rooms = db.prepare('SELECT * FROM rooms WHERE flat_id = ? ORDER BY id').all(req.params.id);
  res.json({ data: rooms });
}));

router.post('/', asyncRoute((req, res) => {
  const db = getDb();
  const { slug, name, address, neighborhood, amenities, has_tourist_license } = req.body;
  if (!slug || !name || !address) return res.status(400).json({ error: 'slug, name, address required' });
  const result = db.prepare(
    'INSERT INTO flats (slug, name, address, neighborhood, amenities, has_tourist_license) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(slug, name, address, neighborhood || null, amenities ? JSON.stringify(amenities) : null, has_tourist_license ? 1 : 0);
  const flat = db.prepare('SELECT * FROM flats WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: flat });
}));

router.put('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const flat = db.prepare('SELECT * FROM flats WHERE id = ?').get(req.params.id);
  if (!flat) return res.status(404).json({ error: 'Flat not found' });

  const fields = ['slug', 'name', 'address', 'neighborhood', 'has_tourist_license'];
  const updates = [];
  const params = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      if (field === 'has_tourist_license') {
        params.push(req.body[field] ? 1 : 0);
      } else {
        params.push(req.body[field]);
      }
    }
  }

  if (req.body.amenities !== undefined) {
    updates.push('amenities = ?');
    params.push(JSON.stringify(req.body.amenities));
  }

  if (!updates.length) return res.json({ data: flat });
  params.push(req.params.id);

  db.prepare(`UPDATE flats SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  const updated = db.prepare('SELECT * FROM flats WHERE id = ?').get(req.params.id);
  res.json({ data: updated });
}));

module.exports = router;
