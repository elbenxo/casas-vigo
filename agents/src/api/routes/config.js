const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM config ORDER BY key').all();
  res.json({ data: rows });
}));

router.get('/:key', asyncRoute((req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM config WHERE key = ?').get(req.params.key);
  if (!row) return res.status(404).json({ error: 'Config key not found' });
  res.json({ data: row });
}));

router.put('/:key', asyncRoute((req, res) => {
  const db = getDb();
  const { value } = req.body;
  if (value === undefined) return res.status(400).json({ error: 'value required' });
  db.prepare(
    `INSERT INTO config (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).run(req.params.key, value);
  const row = db.prepare('SELECT * FROM config WHERE key = ?').get(req.params.key);
  res.json({ data: row });
}));

module.exports = router;
