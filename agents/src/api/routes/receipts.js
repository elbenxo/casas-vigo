const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const { month, year, contact_id } = req.query;
  let sql = 'SELECT * FROM receipts WHERE 1=1';
  const params = [];
  if (month) { sql += ' AND month = ?'; params.push(month); }
  if (year) { sql += ' AND year = ?'; params.push(year); }
  if (contact_id) { sql += ' AND contact_id = ?'; params.push(contact_id); }
  sql += ' ORDER BY year DESC, month DESC, id DESC LIMIT 500';
  const receipts = db.prepare(sql).all(...params);
  res.json({ data: receipts });
}));

router.post('/', asyncRoute((req, res) => {
  const db = getDb();
  const { contact_id, month, year, rent_amount, utilities_amount, total, sent_at } = req.body;
  if (!contact_id || !month || !year || rent_amount === undefined || utilities_amount === undefined || total === undefined) {
    return res.status(400).json({ error: 'contact_id, month, year, rent_amount, utilities_amount, total required' });
  }
  if (month < 1 || month > 12) return res.status(400).json({ error: 'month must be 1-12' });
  if (year < 2000 || year > 2100) return res.status(400).json({ error: 'year must be 2000-2100' });
  const result = db.prepare(
    `INSERT INTO receipts (contact_id, month, year, rent_amount, utilities_amount, total, sent_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(contact_id, month, year, rent_amount, utilities_amount, total, sent_at ?? null);
  const record = db.prepare('SELECT * FROM receipts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: record });
}));

module.exports = router;
