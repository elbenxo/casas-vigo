#!/bin/bash
# ElBenxo_BOT Scheduler
# Checks tracked conversations and triggers Claude Code to respond
# Usage: scheduler.sh [--once] [--conversation <phone>]

SKILL_DIR="E:/Claude/CasasVigo/.claude/skills/elbenxo-bot"
CONVERSATIONS_DIR="E:/Claude/CasasVigo/services/whatsapp-api/conversations"
PROMPT_TEMPLATE="$SKILL_DIR/assets/prompt-template.md"
PERSONALITY_FILE="$SKILL_DIR/references/personality.md"
CONTACTS_DIR="$SKILL_DIR/references/contacts"
API_HOST="http://localhost:50000"
LOOP=true
SPECIFIC_CONV=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --once) LOOP=false; shift ;;
    --conversation) SPECIFIC_CONV="$2"; shift 2 ;;
    *) shift ;;
  esac
done

is_nighttime() {
  local hour=$(date +%H)
  [ "$hour" -ge 23 ] || [ "$hour" -lt 8 ]
}

random_delay() {
  local delay=$((RANDOM % 51 + 10))
  echo "[$(date '+%H:%M:%S')] Waiting ${delay}s before responding..."
  sleep $delay
}

find_contact_file() {
  local phone="$1"
  # Search contact files for matching phone number
  for f in "$CONTACTS_DIR"/*.md; do
    [ -f "$f" ] || continue
    if grep -q "Phone: $phone" "$f" 2>/dev/null; then
      echo "$f"
      return
    fi
  done
}

process_conversation() {
  local phone="$1"
  local conv_dir="$CONVERSATIONS_DIR/$phone"
  local config_file="$conv_dir/config.json"
  local history_file="$conv_dir/history.md"

  if [ ! -f "$config_file" ]; then
    return
  fi

  local enabled=$(node -e "const c=require('$config_file'); console.log(c.enabled)")
  local name=$(node -e "const c=require('$config_file'); console.log(c.name)")
  local last_checked=$(node -e "const c=require('$config_file'); console.log(c.lastChecked || 0)")

  if [ "$enabled" != "true" ]; then
    echo "[$(date '+%H:%M:%S')] Skipping $name (disabled)"
    return
  fi

  if [ ! -f "$history_file" ] || [ ! -s "$history_file" ]; then
    echo "[$(date '+%H:%M:%S')] No history for $name, skipping"
    node -e "
      const fs = require('fs');
      const c = JSON.parse(fs.readFileSync('$config_file', 'utf-8'));
      c.lastChecked = Math.floor(Date.now() / 1000);
      fs.writeFileSync('$config_file', JSON.stringify(c, null, 2));
    "
    return
  fi

  # Split messages by lastChecked timestamp
  local split_result=$(node -e "
    const fs = require('fs');
    const lines = fs.readFileSync('$history_file', 'utf-8').split('\n').filter(l => l.trim());
    const lastChecked = $last_checked;
    function parseTimestamp(line) {
      const match = line.match(/\[(\d{2})\/(\d{2})\/(\d{4}),?\s*(\d{2}):(\d{2}):(\d{2})\]/);
      if (!match) return 0;
      const [, day, month, year, hour, min, sec] = match;
      return Math.floor(new Date(year, month - 1, day, hour, min, sec).getTime() / 1000);
    }
    const oldLines = [];
    const newLines = [];
    for (const line of lines) {
      if (parseTimestamp(line) > lastChecked) {
        newLines.push(line);
      } else {
        oldLines.push(line);
      }
    }
    console.log(JSON.stringify({ old: oldLines.join('\n'), new: newLines.join('\n'), hasNew: newLines.length > 0 }));
  ")

  local has_new=$(echo "$split_result" | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).hasNew))")

  if [ "$has_new" != "true" ]; then
    echo "[$(date '+%H:%M:%S')] No new messages for $name"
    return
  fi

  local old_messages=$(echo "$split_result" | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).old))")
  local new_messages=$(echo "$split_result" | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).new))")

  echo "[$(date '+%H:%M:%S')] New messages from $name:"
  echo "$new_messages"

  # Load personality
  local personality=$(cat "$PERSONALITY_FILE")

  # Load contact profile (if exists)
  local contact_file=$(find_contact_file "$phone")
  local contact_profile="No specific contact profile available for $name."
  if [ -n "$contact_file" ]; then
    contact_profile=$(cat "$contact_file")
  fi

  # Build prompt from template
  local prompt=$(cat "$PROMPT_TEMPLATE")
  prompt="${prompt//\{\{PERSONALITY\}\}/$personality}"
  prompt="${prompt//\{\{CONTACT_PROFILE\}\}/$contact_profile}"
  prompt="${prompt//\{\{HISTORY\}\}/$old_messages}"
  prompt="${prompt//\{\{NEW_MESSAGES\}\}/$new_messages}"

  # Call Claude with zero tool access
  echo "[$(date '+%H:%M:%S')] Asking Claude to evaluate response for $name..."
  local response=$(echo "$prompt" | claude -p --model sonnet --allowedTools "" 2>/dev/null)

  response=$(echo "$response" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

  if [ -z "$response" ] || [ "$response" = "NO_RESPONSE" ]; then
    echo "[$(date '+%H:%M:%S')] Claude decided not to respond to $name"
  else
    echo "[$(date '+%H:%M:%S')] Claude wants to send to $name: $response"
    random_delay

    local send_result=$(curl -s -X POST "$API_HOST/send" \
      -H "Content-Type: application/json" \
      -d "{\"to\": \"$phone\", \"message\": \"$response\"}")

    local success=$(echo "$send_result" | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).success||false))")

    if [ "$success" = "true" ]; then
      echo "[$(date '+%H:%M:%S')] Message sent to $name"
    else
      echo "[$(date '+%H:%M:%S')] Failed to send to $name: $send_result"
    fi
  fi

  # Update lastChecked
  node -e "
    const fs = require('fs');
    const c = JSON.parse(fs.readFileSync('$config_file', 'utf-8'));
    c.lastChecked = Math.floor(Date.now() / 1000);
    fs.writeFileSync('$config_file', JSON.stringify(c, null, 2));
  "
}

run_cycle() {
  echo ""
  echo "=== Scheduler cycle at $(date '+%Y-%m-%d %H:%M:%S') ==="

  if is_nighttime; then
    echo "Nighttime (23:00-08:00). Skipping."
    return
  fi

  local status=$(curl -s "$API_HOST/status" 2>/dev/null)
  if [ -z "$status" ]; then
    echo "WhatsApp server not running at $API_HOST"
    return
  fi

  if [ -n "$SPECIFIC_CONV" ]; then
    process_conversation "$SPECIFIC_CONV"
  else
    for conv_dir in "$CONVERSATIONS_DIR"/*/; do
      [ -d "$conv_dir" ] || continue
      local phone=$(basename "$conv_dir")
      process_conversation "$phone"
    done
  fi
}

echo "ElBenxo_BOT Scheduler"
echo "Contacts: $CONTACTS_DIR"
echo "Conversations: $CONVERSATIONS_DIR"
echo "API: $API_HOST"
echo "Mode: $([ "$LOOP" = true ] && echo 'continuous (every 2 min)' || echo 'single run')"

if [ "$LOOP" = true ]; then
  while true; do
    run_cycle
    echo "[$(date '+%H:%M:%S')] Next check in 120s..."
    sleep 120
  done
else
  run_cycle
fi
