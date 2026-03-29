# Tenant Agent (Post-venta)

Agent for managing communications with current tenants.

## Role
- Generate and send monthly rent invoices/receipts
- Read incoming cost invoices from owner's email (water, electricity, IBI, internet, insurance)
- Forward relevant cost splits to tenants
- Send general communications to tenants

## Channels
- WhatsApp (primary)
- Email (for invoice delivery)

## Data Sources
- Owner's email — incoming utility invoices
- `data/` — tenant records, cost records
- Invoice/receipt templates (to be created in assets/)

## Status
Not implemented yet. See `.claude/skills/planning/references/agents-implementation.md` for tasks.
