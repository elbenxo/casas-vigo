---
name: elbenxo-bot
description: >
  This skill should be used when managing ElBenxo_BOT, Benxamin Porto's automated
  WhatsApp assistant. It handles contact profiles, personality configuration, and
  the auto-response scheduler. Triggers on requests like "start the bot",
  "add a contact", "edit Iren's profile", "change the bot personality",
  "run the scheduler", "set up auto-responses".
---

# ElBenxo_BOT Manager

Manage Benxamin Porto's automated WhatsApp assistant — contact profiles, personality, and the auto-response scheduler.

## Prerequisites

The WhatsApp API server must be running on port 50000 (managed by the `whatsapp` skill).

## Architecture

- **Personality** — `references/personality.md` defines how the bot behaves globally
- **Contacts** — `references/contacts/<name>.md` stores per-contact profiles (relationship, tone, instructions)
- **Conversations** — `E:\Claude\CasasVigo\services\whatsapp-api\conversations\<phone>\` holds `config.json` and `history.md` (auto-written by the server)
- **Scheduler** — `scripts/scheduler.js` loops through conversations, feeds history + personality + contact profile to Claude, and sends responses via the API

## Scripts

All scripts are in `E:\Claude\CasasVigo\.claude\skills\elbenxo-bot\scripts\`. Execute with `node`.

| Script | Usage | Purpose |
|--------|-------|---------|
| `scheduler.js` | `node scheduler.js [--once] [--conversation <phone>]` | Run the auto-response loop |
| `run-once.js` | `node run-once.js <phone>` | Check and respond to one conversation |
| `introduce.js` | `node introduce.js <phone_or_chatId>` | Introduce BenxaBOT to a contact/group (typing + send) |
| `setup-contact.sh` | `bash setup-contact.sh <phone> <name>` | Create a new contact + conversation folder |

## Workflows

### Add a new contact

1. Run `setup-contact.sh <phone> <name>` to create the scaffolding
2. Edit the generated file at `references/contacts/<name>.md` with relationship, preferences, and bot instructions
3. Restart the WhatsApp server so it starts tracking messages for this contact

### Edit a contact profile

1. Read the contact file from `references/contacts/` (files are named by contact in lowercase)
2. Edit the relevant sections (relationship, communication preferences, bot instructions)

### Edit the bot personality

1. Read `references/personality.md`
2. Modify the traits, rules, or boundaries as needed

### Start the auto-responder

```bash
# Continuous mode — checks every 2 min, skips 23:00-08:00
node E:\Claude\CasasVigo\.claude\skills\elbenxo-bot\scripts\scheduler.js

# Single check on all conversations
node E:\Claude\CasasVigo\.claude\skills\elbenxo-bot\scripts\scheduler.js --once

# Single check on one conversation
node E:\Claude\CasasVigo\.claude\skills\elbenxo-bot\scripts\run-once.js XXXXXXX

# Introduce BenxaBOT + start continuous loop for one conversation
node E:\Claude\CasasVigo\.claude\skills\elbenxo-bot\scripts\scheduler.js --start --conversation XXXXXXXX
```

### View active contacts

List contact profile files in `references/contacts/` to see all configured contacts.

## Security Model

The scheduler launches Claude with `--allowedTools ""` (zero tool access). Claude receives only:
- The personality text
- The contact profile text
- The conversation history with a NEW MESSAGES marker

Claude outputs only the response text or `NO_RESPONSE`. The scheduler handles all API calls. Claude never has direct access to the WhatsApp API, file system, or any tools.

## Key Paths

| What | Path |
|------|------|
| Personality | `E:\Claude\CasasVigo\.claude\skills\elbenxo-bot\references\personality.md` |
| Contacts | `E:\Claude\CasasVigo\.claude\skills\elbenxo-bot\references\contacts\` |
| Prompt template | `E:\Claude\CasasVigo\.claude\skills\elbenxo-bot\assets\prompt-template.md` |
| Conversation data | `E:\Claude\CasasVigo\services\whatsapp-api\conversations\` |
| Contact template | `E:\Claude\CasasVigo\.claude\skills\elbenxo-bot\assets\contact-template.md` |
