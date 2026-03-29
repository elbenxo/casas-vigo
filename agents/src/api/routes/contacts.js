const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const { role } = req.query;
  let sql = 'SELECT * FROM contacts WHERE 1=1';
  const params = [];
  if (role) { sql += ' AND role = ?'; params.push(role); }
  sql += ' ORDER BY id LIMIT 500';
  const contacts = db.prepare(sql).all(...params);
  res.json({ data: contacts });
}));

router.get('/by-phone/:phone', asyncRoute((req, res) => {
  const db = getDb();
  const contact = db.prepare('SELECT * FROM contacts WHERE phone = ?').get(req.params.phone);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  res.json({ data: contact });
}));

router.get('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  res.json({ data: contact });
}));

router.post('/', asyncRoute((req, res) => {
  const db = getDb();
  const { phone, name, role, flat_id, room_id, contract_start, contract_end, language } = req.body;
  if (!phone) return res.status(400).json({ error: 'phone required' });
  try {
    const result = db.prepare(
      `INSERT INTO contacts (phone, name, role, flat_id, room_id, contract_start, contract_end, language)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(phone, name ?? null, role ?? 'prospect', flat_id ?? null, room_id ?? null, contract_start ?? null, contract_end ?? null, language ?? 'es');
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ data: contact });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Phone already registered' });
    }
    throw err;
  }
}));

router.put('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
  if (!contact) return res.status(404).json({ error: 'Contact not found' });

  const fields = ['phone', 'name', 'role', 'flat_id', 'room_id', 'contract_start', 'contract_end', 'language'];
  const updates = [];
  const params = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  }

  updates.push("updated_at = datetime('now')");
  params.push(req.params.id);

  db.prepare(`UPDATE contacts SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  const updated = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
  res.json({ data: updated });
}));

module.exports = router;
