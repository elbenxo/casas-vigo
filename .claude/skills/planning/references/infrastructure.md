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
- [x] Reconfigure GitHub Pages to deploy from web/ subfolder — 2026-04-12 (deploy.yml ya configurado, Node 22)
- [x] Test web deployment from monorepo — 2026-04-12 (push triggered GitHub Actions, deployed OK)

### MCP Server
- [ ] Create casasvigo-mcp server (stdio, wrappea API REST) — medium
- [ ] Register in .mcp.json — medium

### Windows Service & Lifecycle
- [ ] Script install-service.js (NSSM setup) — medium
- [ ] Implement sleep/wake handler (sleeptime package) — medium
- [ ] Implement watchdog (health check cada 30s) — medium

### Data (replaced by SQLite)
- [x] ~~Define JSON schema for income/costs~~ — replaced by SQLite schema in architecture
- [x] Script sync-availability.js (API → web/src/data/availability.json) — 2026-04-12 (v1: solo disponibilidad+precios, será reemplazado por sync-web.js cuando se implemente el CMS completo)
- [x] Script preview-web.js (sync + astro build) — 2026-04-12
- [x] Script deploy-web.js (git commit + push) — 2026-04-12
- [x] Shared scripts/lib/run.js (helper compartido para scripts) — 2026-04-12
- [x] API: POST /api/deploy-web/{preview,publish,cancel,status} — 2026-04-12
- [x] Web preview local: Express sirve web/dist en /casas-vigo/ — 2026-04-12
- [x] Dashboard: flujo Vista previa → Publicar/Cancelar con estado persistente — 2026-04-12
- [x] Web: flats.ts aplica overlay de disponibilidad desde availability.json — 2026-04-12
- [ ] Script backup-db.js (DB → Google Drive) — low
