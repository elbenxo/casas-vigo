const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

router.get('/:contactId', asyncRoute((req, res) => {
  const db = getDb();
  const messages = db.prepare(
    'SELECT * FROM messages WHERE contact_id = ? ORDER BY timestamp ASC LIMIT 200'
  ).all(req.params.contactId);
  res.json({ data: messages });
}));

router.post('/', asyncRoute((req, res) => {
  const db = getDb();
  const { contact_id, channel, direction, content } = req.body;
  if (!contact_id || !direction || !content) {
    return res.status(400).json({ error: 'contact_id, direction, content required' });
  }
  if (direction !== 'in' && direction !== 'out') {
    return res.status(400).json({ error: "direction must be 'in' or 'out'" });
  }
  const result = db.prepare(
    'INSERT INTO messages (contact_id, channel, direction, content) VALUES (?, ?, ?, ?)'
  ).run(contact_id, channel ?? 'whatsapp', direction, content);
  const record = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: record });
}));

module.exports = router;
