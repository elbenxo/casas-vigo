'use strict';

const { Router } = require('express');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');
const { PROSPECT_STATUSES } = require('../constants');

const router = Router();

const VALID_STATUSES = PROSPECT_STATUSES;

/**
 * GET /api/prospects
 * List prospects with optional filters: ?status= ?channel= ?flat_interest= ?language=
 */
router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const { status, channel, flat_interest, language } = req.query;

  let sql = 'SELECT * FROM prospects WHERE 1=1';
  const params = [];

  if (status)        { sql += ' AND status = ?';        params.push(status); }
  if (channel)       { sql += ' AND channel = ?';       params.push(channel); }
  if (flat_interest) { sql += ' AND flat_interest = ?'; params.push(flat_interest); }
  if (language)      { sql += ' AND language = ?';      params.push(language); }

  sql += ' ORDER BY created_at DESC LIMIT 1000';

  const prospects = db.prepare(sql).all(...params);
  res.json({ data: prospects });
}));

/**
 * GET /api/prospects/analytics/summary
 * Aggregated CRM stats. Must be registered BEFORE /:id to avoid route conflict.
 */
router.get('/analytics/summary', asyncRoute((req, res) => {
  const db = getDb();

  // Counts per status
  const byStatus = db.prepare(
    `SELECT status, COUNT(*) AS count FROM prospects GROUP BY status`
  ).all();

  // Counts per channel
  const byChannel = db.prepare(
    `SELECT channel, COUNT(*) AS count FROM prospects GROUP BY channel`
  ).all();

  // Conversion funnel: how many prospects reached each status at any point
  // We use current status as a proxy (simpler, avoids interaction log overhead)
  const statusOrder = VALID_STATUSES;
  const statusCounts = Object.fromEntries(byStatus.map(r => [r.status, r.count]));
  const conversionFunnel = statusOrder.map(s => ({
    status: s,
    count: statusCounts[s] ?? 0,
  }));

  // Average days per stage (from created_at to updated_at, grouped by current status)
  const avgDaysPerStage = db.prepare(
    `SELECT status,
            ROUND(AVG(
              (julianday(updated_at) - julianday(created_at))
            ), 1) AS avg_days
     FROM prospects
     GROUP BY status`
  ).all();

  // Monthly leads count for last 6 months
  const monthlyLeads = db.prepare(
    `SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS count
     FROM prospects
     WHERE created_at >= datetime('now', '-6 months')
     GROUP BY month
     ORDER BY month ASC`
  ).all();

  res.json({
    data: {
      by_status: byStatus,
      by_channel: byChannel,
      conversion_funnel: conversionFunnel,
      avg_days_per_stage: avgDaysPerStage,
      monthly_leads: monthlyLeads,
    },
  });
}));

/**
 * GET /api/prospects/:id
 * Get a single prospect by ID.
 */
router.get('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const prospect = db.prepare('SELECT * FROM prospects WHERE id = ?').get(req.params.id);
  if (!prospect) return res.status(404).json({ error: 'Prospect not found' });
  res.json({ data: prospect });
}));

/**
 * GET /api/prospects/:id/interactions
 * Get all interactions for a prospect, newest first.
 */
router.get('/:id/interactions', asyncRoute((req, res) => {
  const db = getDb();
  const prospect = db.prepare('SELECT id FROM prospects WHERE id = ?').get(req.params.id);
  if (!prospect) return res.status(404).json({ error: 'Prospect not found' });

  const interactions = db.prepare(
    `SELECT * FROM prospect_interactions
     WHERE prospect_id = ?
     ORDER BY created_at DESC`
  ).all(req.params.id);

  res.json({ data: interactions });
}));

/**
 * POST /api/prospects
 * Create a new prospect. `name` is required.
 */
router.post('/', asyncRoute((req, res) => {
  const db = getDb();
  const { name, phone, email, dob, dni, language, channel, status, flat_interest, room_interest, loss_reason, notes } = req.body;

  if (!name) return res.status(400).json({ error: 'name required' });
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const result = db.prepare(
    `INSERT INTO prospects (name, phone, email, dob, dni, language, channel, status, flat_interest, room_interest, loss_reason, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    name,
    phone ?? null,
    email ?? null,
    dob ?? null,
    dni ?? null,
    language ?? 'es',
    channel ?? 'whatsapp',
    status ?? 'new',
    flat_interest ?? null,
    room_interest ?? null,
    loss_reason ?? null,
    notes ?? null,
  );

  const prospect = db.prepare('SELECT * FROM prospects WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: prospect });
}));

/**
 * PUT /api/prospects/:id
 * Update any fields of a prospect.
 */
router.put('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const prospect = db.prepare('SELECT * FROM prospects WHERE id = ?').get(req.params.id);
  if (!prospect) return res.status(404).json({ error: 'Prospect not found' });

  if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const fields = ['name', 'phone', 'email', 'dob', 'dni', 'language', 'channel', 'status', 'flat_interest', 'room_interest', 'loss_reason', 'notes'];
  const updates = [];
  const params = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  }

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

  updates.push("updated_at = datetime('now')");
  params.push(req.params.id);

  db.prepare(`UPDATE prospects SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  const updated = db.prepare('SELECT * FROM prospects WHERE id = ?').get(req.params.id);
  res.json({ data: updated });
}));

/**
 * PUT /api/prospects/:id/status
 * Update only the status field, with validation.
 */
router.put('/:id/status', asyncRoute((req, res) => {
  const db = getDb();
  const { status, loss_reason } = req.body;

  if (!status) return res.status(400).json({ error: 'status required' });
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const prospect = db.prepare('SELECT * FROM prospects WHERE id = ?').get(req.params.id);
  if (!prospect) return res.status(404).json({ error: 'Prospect not found' });

  // Validate transition: signed prospects cannot go back to earlier statuses
  if (prospect.status === 'signed' && status !== 'signed') {
    return res.status(409).json({ error: 'Cannot change status of a signed prospect' });
  }

  const updates = ["status = ?", "updated_at = datetime('now')"];
  const params = [status];

  if (status === 'lost' && loss_reason) {
    updates.push('loss_reason = ?');
    params.push(loss_reason);
  }

  params.push(req.params.id);
  db.prepare(`UPDATE prospects SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  const updated = db.prepare('SELECT * FROM prospects WHERE id = ?').get(req.params.id);
  res.json({ data: updated });
}));

/**
 * POST /api/prospects/:id/interactions
 * Add an interaction record to a prospect.
 */
router.post('/:id/interactions', asyncRoute((req, res) => {
  const db = getDb();
  const { type, direction, summary, channel } = req.body;

  if (!type || !summary) {
    return res.status(400).json({ error: 'type and summary required' });
  }

  const prospect = db.prepare('SELECT id FROM prospects WHERE id = ?').get(req.params.id);
  if (!prospect) return res.status(404).json({ error: 'Prospect not found' });

  const result = db.prepare(
    `INSERT INTO prospect_interactions (prospect_id, type, direction, summary, channel)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    req.params.id,
    type,
    direction ?? 'in',
    summary,
    channel ?? null,
  );

  // Touch prospect updated_at
  db.prepare("UPDATE prospects SET updated_at = datetime('now') WHERE id = ?").run(req.params.id);

  const interaction = db.prepare('SELECT * FROM prospect_interactions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: interaction });
}));

module.exports = router;
