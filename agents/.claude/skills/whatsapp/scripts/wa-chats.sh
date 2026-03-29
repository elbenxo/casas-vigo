#!/bin/bash
# List WhatsApp chats (name, id, last message preview)
# Usage: wa-chats.sh [limit]
# Default shows top 20 chats

HOST="${WA_API_HOST:-http://localhost:50000}"
LIMIT="${1:-20}"

curl -s "$HOST/chats" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  const data = JSON.parse(Buffer.concat(chunks).toString());
  if (data.error) { console.log('Error:', data.error); process.exit(1); }
  data.chats.slice(0, $LIMIT).forEach(c => {
    const preview = c.lastMessage ? c.lastMessage.body.substring(0, 50) : '';
    const type = c.isGroup ? 'GRP' : 'DM ';
    console.log(type + ' | ' + c.name.padEnd(30) + ' | ' + c.id + ' | ' + preview);
  });
});
"
