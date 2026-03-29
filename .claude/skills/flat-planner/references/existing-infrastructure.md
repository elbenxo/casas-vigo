# Existing Infrastructure

Reference document for what already exists in each repo. Read this when planning architecture or starting implementation.

## CasasVigo (`/casasvigo`)

**What it is**: WhatsApp bot (ElBenxo_BOT) - personal AI assistant running locally on Windows.

**Stack**:
- Node.js + Express.js (port 50000)
- whatsapp-web.js v1.26.1-alpha.3 with LocalAuth
- Puppeteer (headless browser for WhatsApp Web)
- Claude CLI for AI responses (sonnet model, zero tool access)
- File-based storage (JSON configs + Markdown history)

**Key components**:
- `services/whatsapp-api/server.js` - Express API server
- `services/whatsapp-api/watchdog.js` - Auto-restart on failures
- `.claude/skills/elbenxo-bot/scripts/scheduler.js` - Message check loop (every 2min)
- `services/whatsapp-api/conversations/` - Per-contact config + history

**API endpoints**:
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/status` | GET | Connection state |
| `/health` | GET | Deep health check |
| `/qr` | GET | QR code for auth |
| `/send` | POST | Send message |
| `/messages` | GET | Message buffer |
| `/chats` | GET | List all chats |
| `/conversations` | GET | Tracked conversations |
| `/escalations` | GET/POST | Issue escalation |

**Key design decisions**:
- Runs locally (Windows 10), not cloud-deployed
- Claude gets zero tools (security-first, text-only)
- Per-contact personality profiles
- Escalation system for things the bot can't handle
- Night mode: silent 23:00-08:00

**What can be reused for the flat project**:
- WhatsApp API infrastructure (server, send/receive)
- Watchdog pattern
- Conversation persistence model
- Escalation system (for booking approvals)

**What needs to change**:
- Bot personality/prompt needs room rental context
- New conversation handlers for rental inquiries
- Integration with room availability data
- Contract generation capability
- Multi-language support beyond current ES/EN

---

## Vigo_Room_Manager (`/Vigo_room_manager`)

**Status**: Empty repository. Only LICENSE + .gitignore.
**Purpose**: Will hold the local desktop management application.
**Has GitHub repo**: Yes.

---

## Claw/NanoClaw (`/claw`)

**What it is**: Experimental Claude agent framework. NOT directly applicable but has patterns worth knowing about.

**Relevant patterns**:
- Container-based agent isolation
- Multi-channel messaging (WhatsApp via Baileys, Telegram, Slack, Discord, Gmail)
- SQLite for message/task persistence
- Per-group memory and customization
- IPC for agent-to-host communication
- Scheduled tasks with cron

**Tech worth noting**:
- @whiskeysockets/baileys (alternative WhatsApp library to whatsapp-web.js)
- better-sqlite3 for local DB
- TypeScript throughout
- Docker containers for isolation

**The user explicitly said**: This is a draft/experiment. Don't apply it directly, but it has useful architectural ideas.

---

## User's Phone: 34717705058 (Benxamin Porto)
## Platform: Windows 10 Pro
## Location: Spain (manages properties in Vigo, Galicia)
