const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const { month, year, flat_id, room_id } = req.query;
  let sql = 'SELECT i.* FROM income i';
  const params = [];
  const conditions = [];

  if (flat_id) {
    sql += ' JOIN rooms r ON r.id = i.room_id';
    conditions.push('r.flat_id = ?');
    params.push(flat_id);
  }

  if (month) { conditions.push('i.month = ?'); params.push(month); }
  if (year) { conditions.push('i.year = ?'); params.push(year); }
  if (room_id) { conditions.push('i.room_id = ?'); params.push(room_id); }

  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY i.year DESC, i.month DESC, i.id DESC LIMIT 500';

  const income = db.prepare(sql).all(...params);
  res.json({ data: income });
}));

router.post('/', asyncRoute((req, res) => {
  const db = getDb();
  const { contact_id, room_id, amount, month, year, payment_method, confirmed } = req.body;
  if (!room_id || amount === undefined || !month || !year) {
    return res.status(400).json({ error: 'room_id, amount, month, year required' });
  }
  if (month < 1 || month > 12) return res.status(400).json({ error: 'month must be 1-12' });
  if (year < 2000 || year > 2100) return res.status(400).json({ error: 'year must be 2000-2100' });
  const result = db.prepare(
    `INSERT INTO income (contact_id, room_id, amount, month, year, payment_method, confirmed)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(contact_id ?? null, room_id, amount, month, year, payment_method ?? 'efectivo', confirmed ? 1 : 0);
  const record = db.prepare('SELECT * FROM income WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: record });
}));

module.exports = router;
