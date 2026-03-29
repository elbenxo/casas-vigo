#!/usr/bin/env node
// Introduce BenxaBOT to a contact or group
// Usage: node introduce.js <phone_or_chatId>
// Example: node introduce.js 34646104683

const http = require('http');
const fs = require('fs');
const path = require('path');

const phone = process.argv[2];
if (!phone) {
  console.log('Usage: node introduce.js <phone_or_chatId>');
  process.exit(1);
}

const chatId = phone.includes('@') ? phone : phone + '@c.us';

function httpRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 50000,
      path: urlPath,
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  const msg = '✨ BenxaBOT dixit:\nEy! Soy BenxaBOT, la versión digital de Benxamin (pero con mejor sentido del humor). Si necesitas algo, aquí estoy 😄';

  // Simulate typing
  console.log('Typing...');
  await httpRequest('POST', '/typing', { chatId });
  await new Promise(r => setTimeout(r, 4000));

  // Send
  const result = await httpRequest('POST', '/send', { to: phone, message: msg });
  if (result.success) {
    console.log(`BenxaBOT introduced to ${phone}`);
  } else {
    console.log('Failed:', JSON.stringify(result));
  }
})();
