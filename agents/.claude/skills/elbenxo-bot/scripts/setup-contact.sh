#!/bin/bash
# Set up a new contact for ElBenxo_BOT
# Creates both the contact reference file and the conversation tracking folder
# Usage: setup-contact.sh <phone> <name>
# Example: setup-contact.sh 34646104683 Iren

SKILL_DIR="E:/Claude/CasasVigo/.claude/skills/elbenxo-bot"
CONVERSATIONS_DIR="E:/Claude/CasasVigo/services/whatsapp-api/conversations"
CONTACTS_DIR="$SKILL_DIR/references/contacts"
TEMPLATE="$SKILL_DIR/assets/contact-template.md"

PHONE="$1"
NAME="$2"
FILENAME=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

if [ -z "$PHONE" ] || [ -z "$NAME" ]; then
  echo "Usage: setup-contact.sh <phone> <contact_name>"
  exit 1
fi

# Create contact reference file from template
CONTACT_FILE="$CONTACTS_DIR/$FILENAME.md"
if [ -f "$CONTACT_FILE" ]; then
  echo "Contact file already exists: $CONTACT_FILE"
else
  sed "s/\[Contact Name\]/$NAME/g; s/\[phone number with country code, no +\]/$PHONE/g; s/\[phone\]/$PHONE/g" "$TEMPLATE" > "$CONTACT_FILE"
  echo "Created contact reference: $CONTACT_FILE"
  echo "  -> Edit this file to add relationship, preferences, and bot instructions"
fi

# Create conversation tracking folder
CONV_DIR="$CONVERSATIONS_DIR/$PHONE"
mkdir -p "$CONV_DIR"

CONFIG_FILE="$CONV_DIR/config.json"
if [ -f "$CONFIG_FILE" ]; then
  echo "Conversation config already exists: $CONFIG_FILE"
else
  cat > "$CONFIG_FILE" << EOF
{
  "name": "$NAME",
  "phone": "$PHONE",
  "chatId": "${PHONE}@c.us",
  "enabled": true,
  "intervalMinutes": 2,
  "lastChecked": 0
}
EOF
  echo "Created conversation config: $CONFIG_FILE"
fi

touch "$CONV_DIR/history.md"
echo ""
echo "Contact $NAME ($PHONE) is ready."
echo "Next steps:"
echo "  1. Edit $CONTACT_FILE with relationship and preferences"
echo "  2. Restart the WhatsApp server to track messages"
