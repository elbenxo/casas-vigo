---
name: whatsapp
description: >
  This skill should be used when the user wants to send or receive WhatsApp messages,
  check WhatsApp chats, search for contacts, or read message history. It provides
  shell scripts that wrap a local WhatsApp API gateway on localhost:50000.
  Triggers on requests like "send a WhatsApp message", "check my WhatsApp",
  "message [name] on WhatsApp", "read messages from [person]".
---

# WhatsApp Messaging

Send and receive WhatsApp messages through a local API gateway at `http://localhost:50000`.

## Prerequisites

The WhatsApp API server must be running:

```bash
cd E:\Claude\CasasVigo\services\whatsapp-api && node server.js
```

To verify, run the status script first. If the server is not running, inform the user.

## Scripts

All scripts are in `E:\Claude\CasasVigo\.claude\skills\whatsapp\scripts\`. Execute them with `bash`.

| Script | Usage | Purpose |
|--------|-------|---------|
| `wa-status.sh` | `wa-status.sh` | Check connection status |
| `wa-send.sh` | `wa-send.sh <phone> <message>` | Send a message (phone = country code + number, no `+`) |
| `wa-messages.sh` | `wa-messages.sh [phone] [since]` | Read buffered messages (non-destructive) |
| `wa-chats.sh` | `wa-chats.sh [limit]` | List recent chats with preview |
| `wa-search-chat.sh` | `wa-search-chat.sh <name>` | Find a chat by contact/group name |
| `wa-history.sh` | `wa-history.sh <chat_id> [limit]` | Read recent messages from a chat |

## Workflows

### Send a message to a contact by name

1. Run `wa-search-chat.sh <name>` to find the chat ID
2. Extract the phone number from the chat ID (the part before `@c.us`)
3. Run `wa-send.sh <phone> <message>`

### Read recent conversation with someone

1. Run `wa-search-chat.sh <name>` to find the chat ID
2. Run `wa-history.sh <chat_id> [limit]` with the full chat ID

### Check for new incoming messages

1. Run `wa-messages.sh` to get all buffered messages
2. Or `wa-messages.sh <phone>` to filter by a specific contact

### Delete a message

To delete/revoke a message for everyone, you need the `messageId` (returned by `/send`):

```javascript
node -e "const http=require('http');const data=JSON.stringify({messageId:'MESSAGE_ID_HERE'});const req=http.request({hostname:'localhost',port:50000,path:'/delete',method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}},res=>{let b='';res.on('data',c=>b+=c);res.on('end',()=>console.log(b))});req.write(data);req.end()"
```

Only works on recent messages still in the server buffer.

## Important Notes

- Phone numbers use format: country code + number, no `+` prefix (e.g., `34612345678` for Spain)
- Chat IDs for individuals end in `@c.us`, groups end in `@g.us`
- The `/messages` endpoint is non-destructive — messages are kept in the buffer
- Tracked conversations auto-persist to `history.md` in `services/whatsapp-api/conversations/`
- The owner's phone number is set via `OWNER_PHONE` env var
- For automated responses, see the `elbenxo-bot` skill
