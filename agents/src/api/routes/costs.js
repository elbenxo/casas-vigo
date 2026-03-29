const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const { month, year, flat_id, type } = req.query;
  let sql = 'SELECT * FROM costs WHERE 1=1';
  const params = [];
  if (month) { sql += ' AND month = ?'; params.push(month); }
  if (year) { sql += ' AND year = ?'; params.push(year); }
  if (flat_id) { sql += ' AND flat_id = ?'; params.push(flat_id); }
  if (type) { sql += ' AND type = ?'; params.push(type); }
  sql += ' ORDER BY year DESC, month DESC, id DESC LIMIT 500';
  const costs = db.prepare(sql).all(...params);
  res.json({ data: costs });
}));

router.post('/', asyncRoute((req, res) => {
  const db = getDb();
  const { flat_id, type, description, amount, month, year, invoice_file } = req.body;
  if (!flat_id || !type || amount === undefined || !month || !year) {
    return res.status(400).json({ error: 'flat_id, type, amount, month, year required' });
  }
  if (month < 1 || month > 12) return res.status(400).json({ error: 'month must be 1-12' });
  if (year < 2000 || year > 2100) return res.status(400).json({ error: 'year must be 2000-2100' });
  const result = db.prepare(
    `INSERT INTO costs (flat_id, type, description, amount, month, year, invoice_file)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(flat_id, type, description ?? null, amount, month, year, invoice_file ?? null);
  const record = db.prepare('SELECT * FROM costs WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: record });
}));

module.exports = router;
