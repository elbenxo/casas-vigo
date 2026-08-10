const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');

const router = Router();

router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const totalFlats = db.prepare('SELECT COUNT(*) AS count FROM flats').get().count;
  const totalRooms = db.prepare('SELECT COUNT(*) AS count FROM rooms').get().count;
  const availableRooms = db.prepare('SELECT COUNT(*) AS count FROM rooms WHERE available = 1').get().count;

  const contactsByRole = db.prepare(
    'SELECT role, COUNT(*) AS count FROM contacts GROUP BY role'
  ).all();
  const contacts = contactsByRole.reduce((acc, r) => { acc[r.role] = r.count; return acc; }, {});

  // contacts.role='tenant' is only populated by the contract-signing flow and can
  // lag behind reality; contracts.status='signed' is the authoritative tenant count.
  const signedTenants = db.prepare(
    "SELECT COUNT(*) AS count FROM contracts WHERE status = 'signed'"
  ).get().count;
  if (signedTenants > 0) contacts.tenant = signedTenants;

  const incomeThisMonth = db.prepare(
    'SELECT COALESCE(SUM(amount), 0) AS total FROM income WHERE month = ? AND year = ?'
  ).get(month, year).total;

  const costsThisMonth = db.prepare(
    'SELECT COALESCE(SUM(amount), 0) AS total FROM costs WHERE month = ? AND year = ?'
  ).get(month, year).total;

  res.json({
    data: {
      flats: totalFlats,
      rooms: { total: totalRooms, available: availableRooms, occupied: totalRooms - availableRooms },
      contacts,
      income_this_month: incomeThisMonth,
      costs_this_month: costsThisMonth,
      period: { month, year }
    }
  });
}));

module.exports = router;
