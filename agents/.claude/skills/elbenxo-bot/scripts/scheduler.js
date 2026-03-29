const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// --- Config ---
const SKILL_DIR = 'E:/Claude/CasasVigo/.claude/skills/elbenxo-bot';
const CONVERSATIONS_DIR = 'E:/Claude/CasasVigo/services/whatsapp-api/conversations';
const LOG_DIR = path.join(CONVERSATIONS_DIR, '..', 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
const PROMPT_TEMPLATE = path.join(SKILL_DIR, 'assets/prompt-template.md');
const PERSONALITY_FILE = path.join(SKILL_DIR, 'references/personality.md');
const CONTACTS_DIR = path.join(SKILL_DIR, 'references/contacts');
const API_HOST = 'http://localhost:50000';
const INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

// --- Args ---
const args = process.argv.slice(2);
const once = args.includes('--once');
const startIntro = args.includes('--start');
const convIdx = args.indexOf('--conversation');
const specificConv = convIdx !== -1 ? args[convIdx + 1] : null;

// --- Helpers ---
function log(msg) {
  const time = new Date().toLocaleTimeString('es-ES');
  const line = `[${time}] ${msg}`;
  console.log(line);
  const logFile = path.join(LOG_DIR, `scheduler-${new Date().toISOString().slice(0, 10)}.log`);
  fs.appendFileSync(logFile, line + '\n');
}

function debugLog(phone, label, content) {
  const debugFile = path.join(LOG_DIR, `debug-${phone}-${new Date().toISOString().slice(0, 10)}.log`);
  const time = new Date().toLocaleTimeString('es-ES');
  fs.appendFileSync(debugFile, `\n===== [${time}] ${label} =====\n${content}\n`);
}

function isNighttime() {
  if (args.includes('--force')) return false;
  const hour = new Date().getHours();
  return hour >= 23 || hour < 8;
}

function randomDelay() {
  const delay = Math.floor(Math.random() * 51 + 10);
  log(`Waiting ${delay}s before responding...`);
  return new Promise(resolve => setTimeout(resolve, delay * 1000));
}

async function simulateTyping(chatId, message) {
  // Calculate typing delay based on message length (~50ms per char, min 3s, max 15s)
  const typingDelay = Math.min(15, Math.max(3, Math.round(message.length * 0.05)));
  log(`Simulating typing for ${typingDelay}s on ${chatId}...`);
  try {
    await httpRequest('POST', '/typing', { chatId });
  } catch (err) {
    log(`Typing simulation failed (non-fatal): ${err.message}`);
  }
  return new Promise(resolve => setTimeout(resolve, typingDelay * 1000));
}

function httpRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, API_HOST);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
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

function parseTimestamp(line) {
  const match = line.match(/\[(\d{2})\/(\d{2})\/(\d{4}),?\s*(\d{2}):(\d{2}):(\d{2})\]/);
  if (!match) return 0;
  const [, day, month, year, hour, min, sec] = match;
  return Math.floor(new Date(year, month - 1, day, hour, min, sec).getTime() / 1000);
}

function findContactFile(phone, chatId) {
  if (!fs.existsSync(CONTACTS_DIR)) return null;
  const files = fs.readdirSync(CONTACTS_DIR).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const content = fs.readFileSync(path.join(CONTACTS_DIR, file), 'utf-8');
    if (content.includes(`Phone: ${phone}`) || (chatId && content.includes(`Chat ID: ${chatId}`))) {
      return path.join(CONTACTS_DIR, file);
    }
  }
  return null;
}

async function processConversation(phone) {
  const convDir = path.join(CONVERSATIONS_DIR, phone);
  const configFile = path.join(convDir, 'config.json');
  const historyFile = path.join(convDir, 'history.md');

  if (!fs.existsSync(configFile)) return;

  const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  if (!config.enabled) {
    log(`Skipping ${config.name} (disabled)`);
    return;
  }

  if (!fs.existsSync(historyFile) || fs.statSync(historyFile).size === 0) {
    log(`No history for ${config.name}, skipping`);
    config.lastChecked = Math.floor(Date.now() / 1000);
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    return;
  }

  const lastChecked = config.lastChecked || 0;
  const lines = fs.readFileSync(historyFile, 'utf-8').split('\n').filter(l => l.trim());

  const oldLines = [];
  const newLines = [];
  for (const line of lines) {
    if (parseTimestamp(line) > lastChecked) {
      newLines.push(line);
    } else {
      oldLines.push(line);
    }
  }

  if (newLines.length === 0) {
    log(`No new messages for ${config.name}`);
    return;
  }

  log(`New messages from ${config.name}:`);
  newLines.forEach(l => console.log('  ' + l));

  // Load personality and contact profile (skill)
  const personality = fs.readFileSync(PERSONALITY_FILE, 'utf-8');
  const chatId = config.chatId || phone + '@c.us';
  const isGroup = chatId.endsWith('@g.us');
  const contactFile = findContactFile(phone, chatId);
  const contactProfile = contactFile
    ? fs.readFileSync(contactFile, 'utf-8')
    : isGroup
      ? `No specialized skill loaded for this group. Use the general agent specification. Group name: ${config.name}. Remember: only respond when directly addressed or when you can add clear value.`
      : `No specialized skill loaded for this contact. Use the general agent specification to respond helpfully. Contact name: ${config.name}.`;

  // Build prompt
  let prompt = fs.readFileSync(PROMPT_TEMPLATE, 'utf-8');
  prompt = prompt.replace('{{PERSONALITY}}', personality);
  prompt = prompt.replace('{{CONTACT_PROFILE}}', contactProfile);
  prompt = prompt.replace('{{HISTORY}}', oldLines.join('\n'));
  prompt = prompt.replace('{{NEW_MESSAGES}}', newLines.join('\n'));

  // Log the full prompt for debugging
  debugLog(phone, 'PROMPT SENT TO CLAUDE', prompt);

  // Call Claude with zero tool access
  log(`Asking Claude to evaluate response for ${config.name}...`);
  let response;
  try {
    // Pipe prompt via stdin — works on both PowerShell and bash
    response = execFileSync('claude', ['-p', '--model', 'sonnet', '--allowedTools', ''], {
      input: prompt,
      encoding: 'utf-8',
      timeout: 60000,
      windowsHide: true,
    }).trim();
  } catch (err) {
    debugLog(phone, 'CLAUDE ERROR', err.message + '\n' + (err.stderr || '') + '\n' + (err.stdout || ''));
    log(`Claude error for ${config.name}: ${err.message}`);
    return;
  }

  debugLog(phone, 'CLAUDE RESPONSE', response);

  if (!response || response === 'NO_RESPONSE') {
    log(`Claude decided not to respond to ${config.name}`);
  } else if (response.startsWith('ESCALATE:')) {
    // Escalation — Claude needs Benxamin's help
    const question = response.replace('ESCALATE:', '').trim();
    log(`Claude is escalating for ${config.name}: ${question}`);

    try {
      // Create escalation record
      await httpRequest('POST', '/escalations', {
        fromPhone: phone,
        fromName: config.name,
        question,
      });

      // Notify Benxamin
      const OWNER_PHONE = process.env.OWNER_PHONE || '34000000000';
      const notifyMsg = `[ESCALATION de ${config.name}]\n${question}\n\nResponde aquí y se lo paso.`;
      await httpRequest('POST', '/send', { to: OWNER_PHONE, message: notifyMsg });

      // Tell the contact we're checking
      const holdMsg = '✨ BenxaBOT dixit:\nLe paso tu mensaje a Benxamin, te respondo en cuanto me diga algo.';
      await simulateTyping(chatId, holdMsg);
      await httpRequest('POST', '/send', { to: phone, message: holdMsg });

      log(`Escalation sent to Benxamin for ${config.name}`);
    } catch (err) {
      log(`Escalation error for ${config.name}: ${err.message}`);
    }
  } else {
    log(`Claude wants to send to ${config.name}: ${response}`);
    await simulateTyping(chatId, response);

    try {
      const result = await httpRequest('POST', '/send', { to: phone, message: response });
      if (result.success) {
        log(`Message sent to ${config.name}`);
      } else {
        log(`Failed to send to ${config.name}: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      log(`Send error for ${config.name}: ${err.message}`);
    }
  }

  // Update lastChecked
  config.lastChecked = Math.floor(Date.now() / 1000);
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

const OWNER_PHONE = process.env.OWNER_PHONE || '34000000000';

async function checkEscalationReplies() {
  // Check if Benxamin replied in his own chat to resolve pending escalations
  const ownerHistory = path.join(CONVERSATIONS_DIR, OWNER_PHONE, 'history.md');
  if (!fs.existsSync(ownerHistory)) return;

  let escalations;
  try {
    const result = await httpRequest('GET', '/escalations');
    escalations = result.escalations || [];
  } catch { return; }

  const pending = escalations.filter(e => !e.resolved);
  if (pending.length === 0) return;

  const lines = fs.readFileSync(ownerHistory, 'utf-8').split('\n').filter(l => l.trim());

  for (const esc of pending) {
    // Look for a reply from Benxamin (not bot) after the escalation timestamp
    const reply = lines.find(line => {
      if (!line.startsWith('>>> ')) return false;
      if (line.includes('ElBenxo_BOT:')) return false;
      if (line.includes('[ESCALATION')) return false;
      const ts = parseTimestamp(line);
      return ts > esc.timestamp;
    });

    if (reply) {
      // Extract the message body after the "Benxamin: " prefix
      const bodyMatch = reply.match(/Benxamin:\s*(.*)/);
      if (!bodyMatch) continue;
      const replyText = bodyMatch[1].trim();

      log(`Benxamin replied to escalation from ${esc.fromName}: ${replyText}`);

      // Forward to original contact
      try {
        await httpRequest('POST', '/send', { to: esc.fromPhone, message: replyText });
        await httpRequest('POST', `/escalations/${esc.id}/resolve`);
        log(`Forwarded Benxamin's reply to ${esc.fromName}`);
      } catch (err) {
        log(`Error forwarding escalation reply: ${err.message}`);
      }
    }
  }
}

async function runCycle() {
  console.log('');
  log(`=== Scheduler cycle ===`);

  if (isNighttime()) {
    log('Nighttime (23:00-08:00). Skipping.');
    return;
  }

  // Check server is running
  try {
    await httpRequest('GET', '/status');
  } catch {
    log(`WhatsApp server not running at ${API_HOST}`);
    return;
  }

  // Check for escalation replies from Benxamin first
  await checkEscalationReplies();

  if (specificConv) {
    await processConversation(specificConv);
  } else {
    const dirs = fs.readdirSync(CONVERSATIONS_DIR).filter(d => {
      return fs.statSync(path.join(CONVERSATIONS_DIR, d)).isDirectory();
    });
    for (const phone of dirs) {
      // Skip owner's chat — it's for escalation replies, not auto-responses
      if (phone === OWNER_PHONE) continue;
      await processConversation(phone);
    }
  }
}

// --- Introduce ---
async function introduceBot(phone) {
  const chatId = phone.includes('@') ? phone : phone + '@c.us';
  const msg = '✨ BenxaBOT dixit:\nEy! Soy BenxaBOT, la versión digital de Benxamin (pero con mejor sentido del humor). Si necesitas algo, aquí estoy 😄';
  log(`Introducing BenxaBOT to ${phone}...`);
  await simulateTyping(chatId, msg);
  const result = await httpRequest('POST', '/send', { to: phone, message: msg });
  if (result.success) {
    log(`BenxaBOT introduced to ${phone}`);
  } else {
    log(`Failed to introduce to ${phone}: ${JSON.stringify(result)}`);
  }
}

// --- Main ---
console.log('ElBenxo_BOT Scheduler');
console.log(`Contacts: ${CONTACTS_DIR}`);
console.log(`Conversations: ${CONVERSATIONS_DIR}`);
console.log(`API: ${API_HOST}`);
console.log(`Mode: ${once ? 'single run' : 'continuous (every 2 min)'}${startIntro ? ' (with intro)' : ''}`);

(async () => {
  if (startIntro && specificConv) {
    await introduceBot(specificConv);
  }
  await runCycle();
  if (!once) {
    setInterval(runCycle, INTERVAL_MS);
    log(`Next check in ${INTERVAL_MS / 1000}s...`);
  }
})();
