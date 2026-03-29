#!/bin/bash
# Poll WhatsApp messages (non-destructive, messages are kept)
# Usage: wa-messages.sh [phone_number] [since_timestamp]
# With no args: returns all buffered messages
# With phone: filters by that chat
# With since: only messages after that unix timestamp

HOST="${WA_API_HOST:-http://localhost:50000}"
QUERY=""

if [ -n "$1" ]; then
  QUERY="?chat=$1"
fi
if [ -n "$2" ]; then
  SEP="?"
  [ -n "$QUERY" ] && SEP="&"
  QUERY="${QUERY}${SEP}since=$2"
fi

curl -s "$HOST/messages$QUERY" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  const data = JSON.parse(Buffer.concat(chunks).toString());
  if (data.error) { console.log('Error:', data.error); process.exit(1); }
  if (data.count === 0) { console.log('No messages.'); process.exit(0); }
  data.messages.forEach(m => {
    const dir = m.fromMe ? '>>>' : '<<<';
    const time = new Date(m.timestamp * 1000).toLocaleString();
    const who = m.fromMe ? 'Me' : m.from.replace('@c.us','').replace('@g.us',' (group)');
    console.log(dir + ' [' + time + '] ' + who + ': ' + m.body.substring(0, 200));
  });
  console.log('--- ' + data.count + ' message(s) ---');
});
"
