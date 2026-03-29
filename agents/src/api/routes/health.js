const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

router.get('/health', asyncRoute((req, res) => {
  const db = getDb();
  db.prepare('SELECT 1').get();
  res.json({ status: 'ok', timestamp: new Date().toISOString(), db: 'connected' });
}));

module.exports = router;
