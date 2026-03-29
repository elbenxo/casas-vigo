# Task Group: Agents Implementation

Implement the sales (pre-venta) and tenant (post-venta) agents in agents/.

## Completed
_(none yet)_

## In Progress
_(none yet)_

## Pending

### Sales Agent (pre-venta)
- [ ] Define agent personality/prompt with property context — high
- [ ] Agent loads property-data (flats, rooms, prices) from data/ — high
- [ ] Agent reads availability from data/availability.json — high
- [ ] Agent answers questions about rooms (info, prices, amenities) — high
- [ ] Agent sends web link (not photos) when asked about a room — high
- [ ] Agent checks and communicates availability by dates — high
- [ ] Agent integrates with Google Calendar for visit appointments — medium
- [ ] Agent adapts language to the prospect (ES/EN/GL minimum) — high
- [ ] Agent can send contract templates (multilingual) — medium
- [ ] Agent escalates complex questions to owner via WhatsApp — high
- [ ] Agent responds only 9:00-13:00, 7 days/week. Outside hours: auto-reply — high
- [ ] Owner can update availability via WhatsApp ("room X closed until date Y") — high
- [ ] Agent updates data/availability.json when owner confirms booking — high
- [ ] WhatsApp as primary channel — high
- [ ] Extensible to Telegram — medium

### Tenant Agent (post-venta)
- [ ] Define agent personality/prompt for tenant communication — high
- [ ] Agent generates monthly rent invoices/receipts — high
- [ ] Agent reads incoming cost invoices from owner's email — medium
- [ ] Agent forwards relevant invoices to tenants (water, electricity split) — medium
- [ ] Agent sends general communications to tenants — medium
- [ ] Define invoice/receipt template — high

### Shared Infrastructure
- [ ] Refactor existing WhatsApp API (agents/services/whatsapp-api/) for multi-agent use — high
- [ ] Shared conversation routing: owner commands vs prospect inquiries vs tenant messages — high
- [ ] Contract templates in multiple languages (assets/) — medium
- [ ] Invoice/receipt templates (assets/) — medium

### Constraints
- Reuse existing Express + whatsapp-web.js infrastructure
- Agents run locally (Windows 10)
- Owner controls via WhatsApp (single person)
- Budget: free/minimum cost (no WhatsApp Business API unless free tier suffices)
