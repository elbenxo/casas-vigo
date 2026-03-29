'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');

// Must set DB_PATH before requiring any app modules
process.env.DB_PATH = path.join(os.tmpdir(), 'casasvigo-test-' + Date.now() + '.db');

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

module.exports = { startServer, request };
