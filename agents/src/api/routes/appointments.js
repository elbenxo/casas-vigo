const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const { flat_id, status, from, to } = req.query;
  let sql = 'SELECT * FROM appointments WHERE 1=1';
  const params = [];
  if (flat_id) { sql += ' AND flat_id = ?'; params.push(flat_id); }
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (from) { sql += ' AND datetime >= ?'; params.push(from); }
  if (to) { sql += ' AND datetime <= ?'; params.push(to); }
  sql += ' ORDER BY datetime ASC LIMIT 500';
  const appointments = db.prepare(sql).all(...params);
  res.json({ data: appointments });
}));

router.post('/', asyncRoute((req, res) => {
  const db = getDb();
  const { contact_id, flat_id, datetime, duration_min, status, notes } = req.body;
  if (!flat_id || !datetime) {
    return res.status(400).json({ error: 'flat_id, datetime required' });
  }
  const result = db.prepare(
    `INSERT INTO appointments (contact_id, flat_id, datetime, duration_min, status, notes)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(contact_id ?? null, flat_id, datetime, duration_min ?? 15, status ?? 'scheduled', notes ?? null);
  const record = db.prepare('SELECT * FROM appointments WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: record });
}));

router.put('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

  const fields = ['contact_id', 'flat_id', 'datetime', 'duration_min', 'status', 'notes'];
  const updates = [];
  const params = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  }

  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  params.push(req.params.id);

  db.prepare(`UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  res.json({ data: updated });
}));

module.exports = router;
