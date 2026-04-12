# Task Group: Dashboard Builder

Build the local read-only dashboard (dashboard/) for the property owner.

## Completed
- [x] Choose tech stack: static HTML + Vanilla JS + Tailwind CDN, served by Express — 2026-04-12
- [x] Define data model for income and costs (SQLite schema) — 2026-04-12
- [x] Define JSON format for income records (REST API: GET/POST /api/income) — 2026-04-12
- [x] Define JSON format for cost records (REST API: GET/POST /api/costs) — 2026-04-12
- [x] Dashboard reads from API (same source of truth: SQLite via REST) — 2026-04-12
- [x] Show income per room per month (breakdown by room within flat) — 2026-04-12
- [x] Show income per flat per month (breakdown bar chart by flat) — 2026-04-12
- [x] Show annual income totals ("Todo el año" filter + monthly average) — 2026-04-12
- [x] Track costs by category (IBI, internet, seguros, agua, luz, reparaciones) — 2026-04-12
- [x] Show costs per flat per month (breakdown bar chart by flat) — 2026-04-12
- [x] Show annual cost totals ("Todo el año" filter + monthly average) — 2026-04-12
- [x] Occupancy page: rooms grouped by flat, status badges, available_from dates — 2026-04-12
- [x] Summary: current occupancy rate (global + per flat with progress bars) — 2026-04-12

## In Progress
_(none)_

## Completed (Apr 12 batch 2)
- [x] Rendimiento por m² (EUR/m²/mes) — ranking global + por piso + por tarjeta de habitación — 2026-04-12
- [x] Mostrar "ocupada hasta" en tarjetas de habitación (contract_end desde contacts) — 2026-04-12
- [x] Alertas de contratos por vencer (próximos 60 días, con urgencia visual) — 2026-04-12
- [x] Calendario Gantt de alquileres (calendar.html) — timeline horizontal, barras por contrato, navegación por año — 2026-04-12
- [x] Añadidas 2 nuevas páginas a navegación: Ocupación, Calendario — 2026-04-12

## Pending

### Income View
- [ ] Show occupancy rate per room/flat alongside income — medium

### Data (done)
- [x] API endpoints for income/costs/receipts — 2026-04-12
- [x] Dashboard reads from API — 2026-04-12

### Constraints
- Runs on localhost only (NOT internet-facing)
- Read-only (owner modifies data via WhatsApp to agents)
- Simplest tech possible
