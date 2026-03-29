# Sales Agent (Pre-venta)

WhatsApp/Telegram agent for handling rental inquiries.

## Role
- Answer questions about rooms (info, prices, amenities)
- Check and communicate availability by dates
- Send web links for room photos
- Schedule visit appointments (Google Calendar)
- Send contract templates (multilingual)
- Adapt language to prospect (ES/EN/GL minimum)
- Escalate complex questions to owner

## Schedule
- Active: 9:00-13:00, 7 days/week
- Outside hours: auto-reply with hours info

## Channels
- WhatsApp (primary)
- Telegram (extensible)

## Data Sources
- `data/availability.json` — room availability by dates
- `.claude/skills/property-data/references/flats.md` — room details
- `web/` — links to send to prospects

## Owner Control
Owner sends WhatsApp messages to update:
- "Habitacion X cerrada hasta fecha Y"
- "Sube precio de X a Y"
- Resolve escalated questions

## Status
Not implemented yet. See `.claude/skills/planning/references/agents-implementation.md` for tasks.
