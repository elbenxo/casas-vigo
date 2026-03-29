#!/bin/bash
# Send a WhatsApp message (delegates to Node.js for proper UTF-8)
# Usage: wa-send.sh <phone_number> <message>
# Phone number should include country code, no + prefix
# Example: wa-send.sh 34612345678 "Hello!"

TO="$1"
shift
MSG="$*"

if [ -z "$TO" ] || [ -z "$MSG" ]; then
  echo "Usage: wa-send.sh <phone> <message>"
  exit 1
fi

node -e "
const http = require('http');
const data = JSON.stringify({to: process.argv[1], message: process.argv[2]});
const req = http.request({hostname:'localhost',port:50000,path:'/send',method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}}, res => {
  let b=''; res.on('data',c=>b+=c); res.on('end',()=>console.log(b));
});
req.write(data); req.end();
" "$TO" "$MSG"
