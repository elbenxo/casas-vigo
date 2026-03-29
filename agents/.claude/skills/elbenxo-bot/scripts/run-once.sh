#!/bin/bash
# Run a single ElBenxo_BOT check on one conversation
# Usage: run-once.sh <phone>
# Example: run-once.sh 34646104683

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCHEDULER="$SCRIPT_DIR/scheduler.sh"

if [ -z "$1" ]; then
  echo "Usage: run-once.sh <phone>"
  exit 1
fi

bash "$SCHEDULER" --once --conversation "$1"
