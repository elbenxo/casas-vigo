#!/bin/bash
# Fetch recent message history from a specific chat
# Usage: wa-history.sh <chat_id> [limit]
# chat_id must be full format: 34612345678@c.us or 120363...@g.us
# Example: wa-history.sh 34612345678@c.us 10

HOST="${WA_API_HOST:-http://localhost:50000}"
CHAT_ID="$1"
LIMIT="${2:-20}"

if [ -z "$CHAT_ID" ]; then
  echo "Usage: wa-history.sh <chat_id> [limit]"
  exit 1
fi

curl -s "$HOST/chats/$CHAT_ID/messages?limit=$LIMIT" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  const data = JSON.parse(Buffer.concat(chunks).toString());
  if (data.error) { console.log('Error:', data.error); process.exit(1); }
  data.messages.forEach(m => {
    const dir = m.fromMe ? '>>>' : '<<<';
    const time = new Date(m.timestamp * 1000).toLocaleString();
    console.log(dir + ' [' + time + '] ' + m.body.substring(0, 200));
  });
});
"
