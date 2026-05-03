'use strict';

const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

// Languages required for i18n payloads (matches translations.ts)
const LANGS = ['es', 'en', 'gl', 'fr', 'de', 'ko', 'pt', 'pl'];

function validateI18n(text) {
  if (!text || typeof text !== 'object') return 'text required (object with language keys)';
  const missing = LANGS.filter(l => typeof text[l] !== 'string' || !text[l].trim());
  if (missing.length === LANGS.length) return 'text must include at least one language';
  return null;
}

// ─── GET /api/reviews ─────────────────────────────────────

router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const { flat_id } = req.query;

  let sql = 'SELECT * FROM reviews WHERE 1=1';
  const params = [];
  if (flat_id) { sql += ' AND flat_id = ?'; params.push(flat_id); }
  sql += ' ORDER BY flat_id, sort_order, id LIMIT 500';

  const reviews = db.prepare(sql).all(...params);
  res.json({ data: reviews });
}));

// ─── GET /api/reviews/:id ─────────────────────────────────

router.get('/:id', asyncRoute((req, res) => {
  const review = getDb().prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  res.json({ data: review });
}));

// ─── POST /api/reviews ────────────────────────────────────

router.post('/', asyncRoute((req, res) => {
  const db = getDb();
  const { flat_id, reviewer_name, text_i18n, sort_order } = req.body;

  if (!flat_id) return res.status(400).json({ error: 'flat_id required' });
  if (!reviewer_name) return res.status(400).json({ error: 'reviewer_name required' });
  const err = validateI18n(text_i18n);
  if (err) return res.status(400).json({ error: err });

  const flat = db.prepare('SELECT id FROM flats WHERE id = ?').get(flat_id);
  if (!flat) return res.status(400).json({ error: 'flat_id invalid' });

  const order = sort_order ?? (db.prepare(
    'SELECT COALESCE(MAX(sort_order), 0) + 10 AS n FROM reviews WHERE flat_id = ?'
  ).get(flat_id).n);

  const result = db.prepare(
    'INSERT INTO reviews (flat_id, reviewer_name, text_i18n, sort_order) VALUES (?, ?, ?, ?)'
  ).run(flat_id, reviewer_name, JSON.stringify(text_i18n), order);

  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: review });
}));

// ─── PUT /api/reviews/:id ─────────────────────────────────

router.put('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });

  const updates = [];
  const params = [];
  if (req.body.reviewer_name !== undefined) {
    updates.push('reviewer_name = ?'); params.push(req.body.reviewer_name);
  }
  if (req.body.text_i18n !== undefined) {
    const err = validateI18n(req.body.text_i18n);
    if (err) return res.status(400).json({ error: err });
    updates.push('text_i18n = ?'); params.push(JSON.stringify(req.body.text_i18n));
  }
  if (req.body.sort_order !== undefined) {
    updates.push('sort_order = ?'); params.push(req.body.sort_order);
  }
  if (!updates.length) return res.json({ data: review });

  params.push(req.params.id);
  db.prepare(`UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  res.json({ data: updated });
}));

// ─── DELETE /api/reviews/:id ──────────────────────────────

router.delete('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
  res.json({ data: { deleted: true } });
}));

module.exports = router;
