'use strict';

const { Router } = require('express');
const path = require('path');
const { getDb } = require('../db/connection');
const asyncRoute = require('../middleware/asyncRoute');
const { generateContract } = require('../services/contractGenerator');
const { PRE_CONTRACT_STATUSES } = require('../constants');

const router = Router();

// Absolute path to the contracts output directory
const CONTRACTS_OUTPUT_DIR = path.resolve(__dirname, '../../../../data/contracts');

/**
 * GET /api/contracts
 * List contracts with optional filters: ?status= ?prospect_id= ?room_id=
 */
router.get('/', asyncRoute((req, res) => {
  const db = getDb();
  const { status, prospect_id, room_id } = req.query;

  let sql = `
    SELECT c.*, p.name AS prospect_name, r.name AS room_name, r.slug AS room_slug
    FROM contracts c
    JOIN prospects p ON p.id = c.prospect_id
    JOIN rooms r ON r.id = c.room_id
    WHERE 1=1`;
  const params = [];

  if (status)      { sql += ' AND c.status = ?';      params.push(status); }
  if (prospect_id) { sql += ' AND c.prospect_id = ?'; params.push(prospect_id); }
  if (room_id)     { sql += ' AND c.room_id = ?';     params.push(room_id); }

  sql += ' ORDER BY c.created_at DESC LIMIT 500';

  const contracts = db.prepare(sql).all(...params);
  res.json({ data: contracts });
}));

/**
 * GET /api/contracts/:id
 * Get a single contract by ID.
 */
router.get('/:id', asyncRoute((req, res) => {
  const db = getDb();
  const contract = db.prepare(
    `SELECT c.*, p.name AS prospect_name, r.name AS room_name, r.slug AS room_slug
     FROM contracts c
     JOIN prospects p ON p.id = c.prospect_id
     JOIN rooms r ON r.id = c.room_id
     WHERE c.id = ?`
  ).get(req.params.id);
  if (!contract) return res.status(404).json({ error: 'Contract not found' });
  res.json({ data: contract });
}));

/**
 * POST /api/contracts/generate
 * Generate a contract from a template.
 * Body: { prospect_id, room_id, lang, start_date, end_date, monthly_rent, deposit, owner_name, utilities_provision, sign_date }
 */
router.post('/generate', asyncRoute((req, res) => {
  const db = getDb();
  const { prospect_id, room_id, lang, start_date, end_date, monthly_rent, deposit, owner_name, utilities_provision, sign_date } = req.body;

  if (!prospect_id || !room_id) {
    return res.status(400).json({ error: 'prospect_id and room_id required' });
  }

  const prospect = db.prepare('SELECT * FROM prospects WHERE id = ?').get(prospect_id);
  if (!prospect) return res.status(404).json({ error: 'Prospect not found' });

  const room = db.prepare(
    'SELECT r.*, f.id AS flat_id, f.name AS flat_name, f.address AS flat_address, f.neighborhood AS flat_neighborhood FROM rooms r JOIN flats f ON f.id = r.flat_id WHERE r.id = ?'
  ).get(room_id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const flat = {
    id: room.flat_id,
    name: room.flat_name,
    address: room.flat_address,
    neighborhood: room.flat_neighborhood,
  };

  const effectiveLang = lang || prospect.language || 'es';
  const effectiveRent = monthly_rent ?? room.price_monthly;

  const { filePath } = generateContract({
    prospect,
    room,
    flat,
    lang: effectiveLang,
    start_date: start_date ?? null,
    end_date: end_date ?? null,
    monthly_rent: effectiveRent,
    deposit: deposit ?? null,
    owner_name: owner_name ?? null,
    utilities_provision: utilities_provision ?? '25',
    sign_date: sign_date ?? null,
    outputDir: CONTRACTS_OUTPUT_DIR,
  });

  // Use forward slashes for cross-platform consistency in stored path
  const storedPath = filePath.replace(/\\/g, '/');

  const result = db.prepare(
    `INSERT INTO contracts (prospect_id, room_id, template_lang, file_path, status, monthly_rent, deposit, start_date, end_date)
     VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?)`
  ).run(
    prospect_id, room_id, effectiveLang, storedPath,
    effectiveRent ?? null,
    deposit ?? null,
    start_date ?? null,
    end_date ?? null,
  );

  // Advance prospect status to contract_sent if still earlier in funnel
  if (PRE_CONTRACT_STATUSES.includes(prospect.status)) {
    db.prepare("UPDATE prospects SET status = 'contract_sent', updated_at = datetime('now') WHERE id = ?").run(prospect_id);
  }

  const contract = db.prepare('SELECT * FROM contracts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ data: contract });
}));

/**
 * GET /api/contracts/:id/download
 * Serve the generated HTML contract file.
 */
router.get('/:id/download', asyncRoute((req, res) => {
  const db = getDb();
  const contract = db.prepare('SELECT * FROM contracts WHERE id = ?').get(req.params.id);
  if (!contract) return res.status(404).json({ error: 'Contract not found' });
  if (!contract.file_path) return res.status(404).json({ error: 'No file generated for this contract' });

  // Normalize path separators for the local OS
  const filePath = contract.file_path.replace(/\//g, path.sep);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
  res.sendFile(path.resolve(filePath));
}));

/**
 * PUT /api/contracts/:id/sign
 * THE KEY ENDPOINT: Signs a contract and converts prospect to tenant.
 *
 * Steps (all in a single transaction):
 *   1. Validate contract is 'draft'
 *   2. Update contract → signed, set signed_at
 *   3. Create contact with role='tenant' from prospect data
 *   4. Update room → available=0, available_from=null
 *   5. Update prospect status → 'signed'
 */
router.put('/:id/sign', asyncRoute((req, res) => {
  const db = getDb();

  const contract = db.prepare('SELECT * FROM contracts WHERE id = ?').get(req.params.id);
  if (!contract) return res.status(404).json({ error: 'Contract not found' });
  if (contract.status !== 'draft') {
    return res.status(409).json({ error: `Contract is already "${contract.status}", can only sign a draft` });
  }

  const prospect = db.prepare('SELECT * FROM prospects WHERE id = ?').get(contract.prospect_id);
  if (!prospect) return res.status(404).json({ error: 'Prospect not found' });

  const room = db.prepare(
    'SELECT r.*, f.id AS flat_id FROM rooms r JOIN flats f ON f.id = r.flat_id WHERE r.id = ?'
  ).get(contract.room_id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  // Run everything inside a single transaction
  const signTransaction = db.transaction(() => {
    // 1. Sign the contract
    db.prepare(
      `UPDATE contracts SET status = 'signed', signed_at = datetime('now') WHERE id = ?`
    ).run(contract.id);

    // 2. Create tenant contact from prospect data (phone is UNIQUE in contacts)
    let contactId;
    const existing = prospect.phone
      ? db.prepare('SELECT id FROM contacts WHERE phone = ?').get(prospect.phone)
      : null;

    if (existing) {
      db.prepare(
        `UPDATE contacts SET role = 'tenant', room_id = ?, flat_id = ?,
          contract_start = ?, contract_end = ?, language = ?,
          updated_at = datetime('now')
         WHERE id = ?`
      ).run(
        contract.room_id, room.flat_id,
        contract.start_date, contract.end_date,
        prospect.language ?? 'es',
        existing.id,
      );
      contactId = existing.id;
    } else {
      const contactResult = db.prepare(
        `INSERT INTO contacts (phone, name, role, flat_id, room_id, contract_start, contract_end, language)
         VALUES (?, ?, 'tenant', ?, ?, ?, ?, ?)`
      ).run(
        prospect.phone ?? null, prospect.name,
        room.flat_id, contract.room_id,
        contract.start_date, contract.end_date,
        prospect.language ?? 'es',
      );
      contactId = contactResult.lastInsertRowid;
    }

    // 3. Mark room as unavailable
    db.prepare(
      `UPDATE rooms SET available = 0, available_from = null, updated_at = datetime('now') WHERE id = ?`
    ).run(contract.room_id);

    // 4. Update prospect status to signed
    db.prepare(
      `UPDATE prospects SET status = 'signed', updated_at = datetime('now') WHERE id = ?`
    ).run(contract.prospect_id);

    return contactId;
  });

  const newContactId = signTransaction();

  const signedContract = db.prepare('SELECT * FROM contracts WHERE id = ?').get(contract.id);
  const newContact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(newContactId);

  res.json({ data: { contract: signedContract, contact: newContact } });
}));

/**
 * PUT /api/contracts/:id/status
 * Update contract status (e.g. draft → terminated).
 * Cannot use this route to sign — use PUT /:id/sign instead.
 */
router.put('/:id/status', asyncRoute((req, res) => {
  const db = getDb();
  const { status } = req.body;
  const VALID_CONTRACT_STATUSES = ['draft', 'terminated'];

  if (!status) return res.status(400).json({ error: 'status required' });
  if (!VALID_CONTRACT_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Use PUT /:id/sign to sign. Other allowed statuses: ${VALID_CONTRACT_STATUSES.join(', ')}` });
  }

  const contract = db.prepare('SELECT * FROM contracts WHERE id = ?').get(req.params.id);
  if (!contract) return res.status(404).json({ error: 'Contract not found' });
  if (contract.status === 'signed') {
    return res.status(409).json({ error: 'Cannot change status of a signed contract' });
  }

  db.prepare('UPDATE contracts SET status = ? WHERE id = ?').run(status, contract.id);
  const updated = db.prepare('SELECT * FROM contracts WHERE id = ?').get(contract.id);
  res.json({ data: updated });
}));

module.exports = router;
