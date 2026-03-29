#!/bin/bash
# Check WhatsApp connection status
# Usage: wa-status.sh

HOST="${WA_API_HOST:-http://localhost:50000}"
curl -s "$HOST/status"
