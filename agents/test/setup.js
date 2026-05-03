'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');

// Must set DB_PATH and IMAGES_DIR before requiring any app modules
const TEST_RUN_ID = Date.now();
process.env.DB_PATH = path.join(os.tmpdir(), 'casasvigo-test-' + TEST_RUN_ID + '.db');
process.env.IMAGES_DIR = path.join(os.tmpdir(), 'casasvigo-test-images-' + TEST_RUN_ID);
process.env.CONTRACTS_DIR = path.join(os.tmpdir(), 'casasvigo-test-contracts-' + TEST_RUN_ID);
fs.mkdirSync(process.env.IMAGES_DIR, { recursive: true });
fs.mkdirSync(process.env.CONTRACTS_DIR, { recursive: true });

const { initDb, closeDb } = require('../src/api/db/connection');
const { createApp } = require('../src/api/server');

async function startServer() {
  initDb();
  const app = createApp();

  const server = await new Promise((resolve, reject) => {
    const s = app.listen(0, '127.0.0.1', (err) => {
      if (err) reject(err);
      else resolve(s);
    });
  });

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  async function close() {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    closeDb();
    try { fs.unlinkSync(process.env.DB_PATH); } catch (_) {}
    try { fs.rmSync(process.env.IMAGES_DIR, { recursive: true, force: true }); } catch (_) {}
    try { fs.rmSync(process.env.CONTRACTS_DIR, { recursive: true, force: true }); } catch (_) {}
  }

  return { server, baseUrl, close };
}

async function request(baseUrl, urlPath, options = {}) {
  const url = baseUrl + urlPath;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  let body;
  try { body = await res.json(); } catch (_) { body = null; }
  return { status: res.status, body };
}

async function multipart(baseUrl, urlPath, fields = {}, files = []) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, String(v));
  for (const f of files) {
    fd.append(f.field || 'files', new Blob([f.buffer], { type: f.type || 'image/png' }), f.name);
  }
  const res = await fetch(baseUrl + urlPath, { method: 'POST', body: fd });
  let body;
  try { body = await res.json(); } catch (_) { body = null; }
  return { status: res.status, body };
}

// 1×1 transparent PNG (smallest valid PNG)
const TINY_PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4' +
  '89000000017352474200aece1ce90000000d4944415478da63fcffff3f000005' +
  'fe02fef62b9c0a0000000049454e44ae426082',
  'hex'
);

module.exports = { startServer, request, multipart, TINY_PNG };
