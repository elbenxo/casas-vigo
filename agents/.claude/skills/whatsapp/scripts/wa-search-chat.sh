#!/bin/bash
# Search chats by name (case-insensitive)
# Usage: wa-search-chat.sh <search_term>
# Returns matching chat names and IDs

HOST="${WA_API_HOST:-http://localhost:50000}"
SEARCH="$1"

if [ -z "$SEARCH" ]; then
  echo "Usage: wa-search-chat.sh <search_term>"
  exit 1
fi

curl -s "$HOST/chats" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  const data = JSON.parse(Buffer.concat(chunks).toString());
  if (data.error) { console.log('Error:', data.error); process.exit(1); }
  const term = '$SEARCH'.toLowerCase();
  const matches = data.chats.filter(c => c.name && c.name.toLowerCase().includes(term));
  if (matches.length === 0) { console.log('No chats matching: $SEARCH'); process.exit(0); }
  matches.forEach(c => {
    const type = c.isGroup ? 'GRP' : 'DM ';
    console.log(type + ' | ' + c.name.padEnd(30) + ' | ' + c.id);
  });
});
"
