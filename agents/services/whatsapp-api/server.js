const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 50000;
const MAX_BUFFER = 1000;
const CONVERSATIONS_DIR = path.join(__dirname, 'conversations');

// Ensure conversations directory exists
if (!fs.existsSync(CONVERSATIONS_DIR)) {
  fs.mkdirSync(CONVERSATIONS_DIR, { recursive: true });
}

// --- WhatsApp Client ---

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

let currentQR = null;
let clientReady = false;
let clientInfo = null;

client.on('qr', (qr) => {
  currentQR = qr;
  console.log('\nScan this QR code with WhatsApp:\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  clientReady = true;
  currentQR = null;
  clientInfo = client.info;
  console.log(`\nWhatsApp client ready! Logged in as ${clientInfo.pushname} (${clientInfo.wid.user})`);
});

client.on('authenticated', () => {
  console.log('Session authenticated.');
});

client.on('auth_failure', (msg) => {
  console.error('Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
  clientReady = false;
  clientInfo = null;
  console.log('Client disconnected:', reason);
  console.log('Attempting to reconnect in 10 seconds...');
  setTimeout(() => {
    console.log('Reinitializing WhatsApp client...');
    client.initialize().catch((err) => {
      console.error('Reconnection failed:', err.message);
    });
  }, 10000);
});

// Handle uncaught errors from Puppeteer/browser crashes
client.on('change_state', (state) => {
  console.log('Client state changed:', state);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
  // Don't crash — let the watchdog handle full restarts if needed
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message || err);
});

// --- Message Persistence ---

function getConversationDir(phone) {
  // Extract phone number from chat ID (strip @c.us / @g.us)
  const clean = phone.replace(/@.*$/, '');
  return path.join(CONVERSATIONS_DIR, clean);
}

function isTrackedConversation(phone) {
  const dir = getConversationDir(phone);
  return fs.existsSync(path.join(dir, 'config.json'));
}

function appendToHistory(phone, line) {
  const dir = getConversationDir(phone);
  const historyFile = path.join(dir, 'history.md');
  fs.appendFileSync(historyFile, line + '\n');
}

function formatTimestamp(ts) {
  return new Date(ts * 1000).toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function persistMessage(entry) {
  // Determine which phone/chat to track
  const chatPhone = entry.fromMe ? entry.to : entry.from;
  if (!isTrackedConversation(chatPhone)) return;

  const dir = getConversationDir(chatPhone);
  const configPath = path.join(dir, 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const contactName = config.name || chatPhone;

  const time = formatTimestamp(entry.timestamp);
  let line;
  if (entry.fromMe) {
    // Check if this was sent by the API (bot) or by Benxamin from his phone
    const isApiSent = entry.id && entry.id.endsWith('_out');
    const sender = isApiSent ? 'ElBenxo_BOT' : 'Benxamin';
    line = `>>> [${time}] ${sender}: ${entry.body}`;
  } else {
    line = `<<< [${time}] ${contactName}: ${entry.body}`;
  }
  appendToHistory(chatPhone, line);
}

// --- Message Buffer ---

const messageBuffer = [];

function bufferMessage(entry) {
  messageBuffer.push(entry);
  if (messageBuffer.length > MAX_BUFFER) {
    messageBuffer.shift();
  }
  persistMessage(entry);
}

// message_create fires for ALL messages including self-sent from phone
client.on('message_create', (msg) => {
  // Skip messages sent via the API (already buffered in /send)
  if (msg.fromMe && msg.id.id.endsWith('_out')) return;

  const entry = {
    id: msg.id._serialized,
    from: msg.from,
    to: msg.to,
    body: msg.body,
    timestamp: msg.timestamp,
    type: msg.type,
    fromMe: msg.fromMe,
    isGroupMsg: (msg.from || '').endsWith('@g.us'),
  };
  bufferMessage(entry);
  const dir = entry.fromMe ? 'OUT' : 'IN';
  console.log(`[${dir}] ${entry.from}: ${entry.body.substring(0, 80)}`);
});

// --- Helper ---

function formatChatId(phone) {
  if (phone.includes('@')) {
    return phone;
  }
  phone = phone.replace(/[^0-9-]/g, '');
  if (phone.includes('-')) {
    return phone + '@g.us';
  }
  return phone + '@c.us';
}

// --- Routes ---

app.get('/status', (req, res) => {
  res.json({
    connected: clientReady,
    info: clientInfo
      ? {
          pushname: clientInfo.pushname,
          phone: clientInfo.wid.user,
          platform: clientInfo.platform,
        }
      : null,
  });
});

app.get('/qr', (req, res) => {
  if (clientReady) {
    return res.json({ qr: null, message: 'Already connected' });
  }
  if (!currentQR) {
    return res.json({ qr: null, message: 'No QR code available. Client may be initializing.' });
  }
  res.json({ qr: currentQR });
});

app.post('/send', async (req, res) => {
  if (!clientReady) {
    return res.status(503).json({ error: 'WhatsApp client not connected' });
  }
  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: 'Missing "to" or "message" in request body' });
  }
  try {
    const chatId = formatChatId(to);
    const result = await client.sendMessage(chatId, message);
    bufferMessage({
      id: result.id._serialized,
      from: clientInfo.wid._serialized,
      to: chatId,
      body: message,
      timestamp: Math.floor(Date.now() / 1000),
      type: 'chat',
      fromMe: true,
      isGroupMsg: chatId.endsWith('@g.us'),
    });
    res.json({
      success: true,
      messageId: result.id._serialized,
      to: chatId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/typing', async (req, res) => {
  if (!clientReady) {
    return res.status(503).json({ error: 'WhatsApp client not connected' });
  }
  const { chatId } = req.body;
  if (!chatId) {
    return res.status(400).json({ error: 'Missing "chatId" in request body' });
  }
  try {
    const chat = await client.getChatById(chatId);
    await chat.sendStateTyping();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/delete', async (req, res) => {
  if (!clientReady) {
    return res.status(503).json({ error: 'WhatsApp client not connected' });
  }
  const { messageId, chatId } = req.body;
  if (!messageId) {
    return res.status(400).json({ error: 'Missing "messageId" in request body' });
  }
  try {
    // Resolve chatId from buffer or from request body
    const entry = messageBuffer.find(m => m.id === messageId);
    const resolvedChatId = chatId || (entry && (entry.fromMe ? entry.to : entry.from));
    if (!resolvedChatId) {
      return res.status(400).json({ error: 'Message not in buffer. Provide "chatId" in request body.' });
    }
    const chat = await client.getChatById(resolvedChatId);
    const messages = await chat.fetchMessages({ limit: 50 });
    const msg = messages.find(m => m.id._serialized === messageId);
    if (!msg) {
      return res.status(404).json({ error: 'Message not found in chat' });
    }
    await msg.delete(true);
    res.json({ success: true, deleted: messageId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/messages', (req, res) => {
  const chatFilter = req.query.chat;
  const since = req.query.since ? parseInt(req.query.since) : 0;
  let messages = messageBuffer;
  if (chatFilter) {
    const chatId = formatChatId(chatFilter);
    messages = messages.filter((m) => m.from === chatId || m.to === chatId);
  }
  if (since) {
    messages = messages.filter((m) => m.timestamp > since);
  }
  res.json({ count: messages.length, messages });
});

app.get('/chats', async (req, res) => {
  if (!clientReady) {
    return res.status(503).json({ error: 'WhatsApp client not connected' });
  }
  try {
    const chats = await client.getChats();
    const result = chats.map((c) => ({
      id: c.id._serialized,
      name: c.name,
      isGroup: c.isGroup,
      unreadCount: c.unreadCount,
      lastMessage: c.lastMessage
        ? {
            body: c.lastMessage.body,
            timestamp: c.lastMessage.timestamp,
          }
        : null,
    }));
    res.json({ count: result.length, chats: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/chats/:chatId/messages', async (req, res) => {
  if (!clientReady) {
    return res.status(503).json({ error: 'WhatsApp client not connected' });
  }
  try {
    const limit = parseInt(req.query.limit) || 20;
    const chatId = req.params.chatId;
    const chat = await client.getChatById(chatId);
    const messages = await chat.fetchMessages({ limit });
    const result = messages.map((m) => ({
      id: m.id._serialized,
      from: m.from,
      to: m.to,
      body: m.body,
      timestamp: m.timestamp,
      type: m.type,
      fromMe: m.fromMe,
    }));
    res.json({ count: result.length, messages: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Health Check ---

app.get('/health', async (req, res) => {
  try {
    if (!clientReady) {
      return res.status(503).json({ healthy: false, reason: 'Client not ready' });
    }
    // Actually test the client by getting state
    const state = await client.getState();
    res.json({ healthy: true, state });
  } catch (err) {
    res.status(503).json({ healthy: false, reason: err.message });
  }
});

// --- Escalations ---

const ESCALATIONS_FILE = path.join(CONVERSATIONS_DIR, 'escalations.json');

function loadEscalations() {
  if (!fs.existsSync(ESCALATIONS_FILE)) return [];
  return JSON.parse(fs.readFileSync(ESCALATIONS_FILE, 'utf-8'));
}

function saveEscalations(data) {
  fs.writeFileSync(ESCALATIONS_FILE, JSON.stringify(data, null, 2));
}

app.get('/escalations', (req, res) => {
  res.json({ escalations: loadEscalations() });
});

app.post('/escalations', (req, res) => {
  const { fromPhone, fromName, question } = req.body;
  if (!fromPhone || !question) {
    return res.status(400).json({ error: 'Missing fromPhone or question' });
  }
  const escalations = loadEscalations();
  const entry = {
    id: Date.now().toString(),
    fromPhone,
    fromName: fromName || fromPhone,
    question,
    timestamp: Math.floor(Date.now() / 1000),
    resolved: false,
  };
  escalations.push(entry);
  saveEscalations(escalations);
  res.json({ success: true, escalation: entry });
});

app.post('/escalations/:id/resolve', (req, res) => {
  const escalations = loadEscalations();
  const esc = escalations.find(e => e.id === req.params.id);
  if (!esc) return res.status(404).json({ error: 'Escalation not found' });
  esc.resolved = true;
  esc.resolvedAt = Math.floor(Date.now() / 1000);
  saveEscalations(escalations);
  res.json({ success: true, escalation: esc });
});

// --- Conversations Management ---

app.get('/conversations', (req, res) => {
  if (!fs.existsSync(CONVERSATIONS_DIR)) {
    return res.json({ count: 0, conversations: [] });
  }
  const dirs = fs.readdirSync(CONVERSATIONS_DIR);
  const conversations = [];
  for (const dir of dirs) {
    const configPath = path.join(CONVERSATIONS_DIR, dir, 'config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      conversations.push(config);
    }
  }
  res.json({ count: conversations.length, conversations });
});

// --- Start ---

app.listen(PORT, () => {
  console.log(`WhatsApp API server listening on http://localhost:${PORT}`);
  console.log(`Conversations directory: ${CONVERSATIONS_DIR}`);
  console.log('Initializing WhatsApp client...');
});

client.initialize();
