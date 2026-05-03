'use strict';

const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

// Fields that are stored as JSON strings in the DB (objects/arrays in transit)
const JSON_FIELDS = ['amenities', 'name_i18n', 'neighborhood_i18n', 'description_i18n', 'coordinates'];

// Plain scalar fields editable via PUT
const SCALAR_FIELDS = ['slug', 'name', 'address', 'neighborhood', 'web_slug', 'web_id_prefix', 'whole_flat_price'];

const BOOL_FIELDS = ['has_tourist_license'];

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
  const {
    slug, name, address, neighborhood, amenities, has_tourist_license,
    web_slug, web_id_prefix, name_i18n, neighborhood_i18n, description_i18n,
    coordinates, whole_flat_price,
  } = req.body;
  if (!slug || !name || !address) return res.status(400).json({ error: 'slug, name, address required' });
  const result = db.prepare(
    `INSERT INTO flats (
       slug, name, address, neighborhood, amenities, has_tourist_license,
       web_slug, web_id_prefix, name_i18n, neighborhood_i18n, description_i18n,
       coordinates, whole_flat_price
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    slug, name, address, neighborhood || null,
    amenities ? JSON.stringify(amenities) : null,
    has_tourist_license ? 1 : 0,
    web_slug || null,
    web_id_prefix || null,
    name_i18n ? JSON.stringify(name_i18n) : null,
    neighborhood_i18n ? JSON.stringify(neighborhood_i18n) : null,
    description_i18n ? JSON.stringify(description_i18n) : null,
    coordinates ? JSON.stringify(coordinates) : null,
    whole_flat_price ?? null,
  );
  const flat = db.prepare('SELECT * FROM flats WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: flat });
}));

router.put('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const flat = db.prepare('SELECT * FROM flats WHERE id = ?').get(req.params.id);
  if (!flat) return res.status(404).json({ error: 'Flat not found' });

  const updates = [];
  const params = [];

  for (const field of SCALAR_FIELDS) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  }
  for (const field of BOOL_FIELDS) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field] ? 1 : 0);
    }
  }
  for (const field of JSON_FIELDS) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field] === null ? null : JSON.stringify(req.body[field]));
    }
  }

  if (!updates.length) return res.json({ data: flat });
  params.push(req.params.id);

  db.prepare(`UPDATE flats SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  const updated = db.prepare('SELECT * FROM flats WHERE id = ?').get(req.params.id);
  res.json({ data: updated });
}));

module.exports = router;
