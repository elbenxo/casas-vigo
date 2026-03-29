# Task Group: Dashboard Builder

Build the local read-only dashboard (dashboard/) for the property owner.

## Completed
- [x] Choose tech stack: static HTML + Vanilla JS + Tailwind CDN, served by Express — 2026-04-12
- [x] Define data model for income and costs (SQLite schema) — 2026-04-12
- [x] Define JSON format for income records (REST API: GET/POST /api/income) — 2026-04-12
- [x] Define JSON format for cost records (REST API: GET/POST /api/costs) — 2026-04-12
- [x] Dashboard reads from API (same source of truth: SQLite via REST) — 2026-04-12

## In Progress
_(none yet)_

## Pending

### Setup (done)
- [x] Choose tech stack — 2026-04-12
- [x] Define data model — 2026-04-12

### Income View
- [ ] Show income per room per month — high
- [ ] Show income per flat per month — high
- [ ] Show annual totals — medium
- [ ] Show occupancy rate per room/flat — medium

### Costs View
- [ ] Track costs by category (IBI, internet, seguros, agua, luz, reparaciones) — high
- [ ] Show costs per flat per month — high
- [ ] Show annual cost totals — medium

### Occupancy View
- [ ] Read from data/availability.json — high
- [ ] Visual calendar showing occupied/free dates per room — medium
- [ ] Summary: current occupancy rate — medium

### Data (done)
- [x] API endpoints for income/costs/receipts — 2026-04-12
- [x] Dashboard reads from API — 2026-04-12

### Constraints
- Runs on localhost only (NOT internet-facing)
- Read-only (owner modifies data via WhatsApp to agents)
- Simplest tech possible
