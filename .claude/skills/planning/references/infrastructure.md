# Task Group: Infrastructure

Repo setup, CI/CD, shared data, deployment.

## Completed
- [x] Create monorepo (casas-vigo) with web/, agents/, dashboard/, data/, docs/ — 2026-03-29
- [x] Migrate web_casas content to web/ — 2026-03-29
- [x] Migrate casasvigo content to agents/ — 2026-03-29
- [x] Create shared data/availability.json — 2026-03-29
- [x] Archive old repos (web_casas, Vigo_room_manager) — 2026-03-29
- [x] Push to github.com/elbenxo/casas-vigo — 2026-03-29
- [x] Create skills: product, planning, property-data — 2026-03-29

## In Progress
_(none)_

## Completed (architecture)
- [x] Define system architecture — 2026-03-29
- [x] Create architecture.md reference document — 2026-03-29
- [x] Research agent frameworks (Claude Agent SDK, OpenClaw, LangChain, CrewAI) — 2026-03-29
- [x] Research Windows service options (NSSM, Shawl) — 2026-03-29
- [x] Research hibernate/sleep handling — 2026-03-29

## Completed (Core API — puerto 3000)
- [x] Create Express server with SQLite (better-sqlite3, WAL mode) — 2026-04-12
- [x] Implement REST endpoints: flats, rooms, contacts — 2026-04-12
- [x] Implement REST endpoints: income, costs, receipts — 2026-04-12
- [x] Implement REST endpoints: messages, appointments, config — 2026-04-12
- [x] Implement /health endpoint — 2026-04-12
- [x] Seed database with 5 flats, 23 rooms from property-data — 2026-04-12
- [x] Integration tests: 46 tests covering all endpoints (node:test) — 2026-04-12
- [x] Code review + simplify: asyncRoute middleware, input validation, LIMIT defaults, 409 on duplicate phone — 2026-04-12

## Pending

### CI/CD
- [ ] Reconfigure GitHub Pages to deploy from web/ subfolder — high
- [ ] Test web deployment from monorepo — high

### MCP Server
- [ ] Create casasvigo-mcp server (stdio, wrappea API REST) — medium
- [ ] Register in .mcp.json — medium

### Windows Service & Lifecycle
- [ ] Script install-service.js (NSSM setup) — medium
- [ ] Implement sleep/wake handler (sleeptime package) — medium
- [ ] Implement watchdog (health check cada 30s) — medium

### Data (replaced by SQLite)
- [x] ~~Define JSON schema for income/costs~~ — replaced by SQLite schema in architecture
- [ ] Script sync-availability.js (API → availability.json) — medium
- [ ] Script deploy-web.js (sync + git push) — medium
- [ ] Script backup-db.js (DB → Google Drive) — low
