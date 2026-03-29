# WhatsApp System Architecture

## Services

### whatsapp-api (transport layer)
- **Location**: `services/whatsapp-api/`
- **Port**: 50000
- **Stack**: Express + whatsapp-web.js + LocalAuth
- **Owner**: Benxamin Porto, phone `34717705058`
- **Entry point**: `node server.js` (or `node watchdog.js` for auto-recovery)
- **Key files**: `server.js`, `watchdog.js`, `package.json`, `.gitignore`

#### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status` | Connection state + phone info |
| GET | `/health` | Deep health check (tests client state) |
| GET | `/qr` | QR code for re-scanning |
| POST | `/send` | Send message `{to, message}` |
| GET | `/messages` | Non-destructive message buffer (supports `?chat=` and `?since=`) |
| GET | `/chats` | List all chats |
| GET | `/chats/:chatId/messages` | Fetch history from WhatsApp servers |
| GET | `/conversations` | List tracked conversations |

#### Message Persistence
- Tracked conversations live in `conversations/<phone>/`
- Each has `config.json` (name, phone, chatId, enabled, lastChecked) and `history.md`
- Server auto-appends to `history.md` for any conversation with a `config.json`
- Format: `<<< [timestamp] Name: message` (incoming) / `>>> [timestamp] ElBenxo_BOT: message` (outgoing)

#### Resilience
- **Auto-reconnect**: On `disconnected` event, waits 10s then reinitializes client
- **Watchdog** (`watchdog.js`): Pings `/health` every 30s, restarts after 3 consecutive failures
- **Crash recovery**: Watchdog auto-restarts on unexpected process exit
- Catches `uncaughtException` and `unhandledRejection` to prevent crashes

### elbenxo-bot (brain layer)
- **Skill location**: `.claude/skills/elbenxo-bot/`
- **Purpose**: Contact profiles, personality, auto-response scheduler

#### Structure
```
.claude/skills/elbenxo-bot/
  SKILL.md                          # Skill definition
  references/
    personality.md                  # ElBenxo_BOT personality (professional assistant)
    contacts/
      iren.md                       # Contact profile: Iren (34646104683) - partner
      benxamin.md                   # Contact profile: Benxamin (34717705058) - self/testing
  scripts/
    scheduler.js                    # Auto-response loop (Node.js, not bash!)
    run-once.js                     # Single conversation check
    setup-contact.sh                # Create new contact + conversation folder
  assets/
    prompt-template.md              # Template fed to Claude with placeholders
    contact-template.md             # Blank template for new contacts
```

#### Scheduler (`scheduler.js`)
- Node.js script (NOT bash — bash spawns visible windows on Windows)
- Checks every 2 min, skips nighttime 23:00-08:00
- For each tracked conversation:
  1. Reads `history.md`, splits into old/new by `lastChecked` timestamp
  2. Builds prompt from personality + contact profile + conversation + NEW MESSAGES marker
  3. Calls `claude -p --model sonnet --allowedTools ""` with prompt piped via stdin
  4. Claude outputs response text or `NO_RESPONSE`
  5. Waits random 10-60s delay, then sends via API
  6. Updates `lastChecked` in config.json
- Debug logs written to `services/whatsapp-api/logs/`

#### Security Model
- Claude gets ZERO tool access (`--allowedTools ""`)
- Claude only receives text (personality + contact + conversation) via stdin
- Claude only outputs text (response or NO_RESPONSE)
- The scheduler handles all API calls — Claude never sees the API

## Skills

### whatsapp skill
- **Location**: `.claude/skills/whatsapp/`
- **Purpose**: Raw messaging scripts (send, receive, search, history)
- **Scripts** (bash, in `scripts/`): `wa-status.sh`, `wa-send.sh`, `wa-messages.sh`, `wa-chats.sh`, `wa-history.sh`, `wa-search-chat.sh`
- All scripts use port 50000

### elbenxo-bot skill
- **Location**: `.claude/skills/elbenxo-bot/`
- **Purpose**: Bot management (contacts, personality, scheduler)
- **Triggers**: "start the bot", "add a contact", "edit profile", "change personality"

## Design Decisions
- **Two skills, not one**: whatsapp (transport) vs elbenxo-bot (brain) — separation of concerns
- **Port 50000**: High port to avoid conflicts
- **Non-destructive message buffer**: `/messages` keeps messages, supports `?since=` for incremental reads
- **File-based history**: Server writes to `history.md` so Claude reads files, not API calls
- **Node.js for all scripts**: Bash spawns visible windows on Windows, Node doesn't with `windowsHide: true`
- **No database**: Everything in-memory + flat files. Local dev tool, not production
- **Personality**: Professional assistant, bilingual (ES/EN), never pretends to be Benxamin
- **Contact profiles**: Full profiles with relationship, communication preferences, and per-contact bot instructions

## Tracked Conversations
| Name | Phone | Chat ID | Status |
|------|-------|---------|--------|
| Iren | 34646104683 | 34646104683@c.us | Enabled |
| Benxamin | 34717705058 | 34717705058@c.us | Enabled (testing) |
