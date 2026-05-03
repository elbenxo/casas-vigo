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

## Completed (Prospects + Contracts API — 2026-04-12)
- [x] DB: tablas prospects, prospect_interactions, contracts — 2026-04-12
- [x] API: /api/prospects (8 endpoints: CRUD, status, interactions, analytics) — 2026-04-12
- [x] API: /api/contracts (6 endpoints: CRUD, generate, download, sign) — 2026-04-12
- [x] Service: contractGenerator.js (template load + cache, placeholders, file generation) — 2026-04-12
- [x] Shared constants.js (PROSPECT_STATUSES, PRE_CONTRACT_STATUSES) — 2026-04-12
- [x] Contract templates: 8 idiomas en agents/templates/contracts/ — 2026-04-12

## Completed (CI/CD & Deploy)
- [x] Reconfigure GitHub Pages to deploy from web/ subfolder — 2026-04-12
- [x] Test web deployment from monorepo — 2026-04-12
- [x] Script sync-availability.js (API → availability.json) — 2026-04-12 (v1: disponibilidad+precios)
- [x] Script preview-web.js (sync + astro build) — 2026-04-12
- [x] Script deploy-web.js (git commit + push) — 2026-04-12
- [x] Shared scripts/lib/run.js (helper compartido) — 2026-04-12
- [x] API: POST /api/deploy-web/{preview,publish,cancel,status} — 2026-04-12
- [x] Web preview local: Express sirve web/dist en /casas-vigo/ — 2026-04-12
- [x] Dashboard: flujo Vista previa → Publicar/Cancelar — 2026-04-12
- [x] Web: flats.ts aplica overlay de disponibilidad desde availability.json — 2026-04-12
- [x] Auto-sync availability.json tras PUT/POST rooms (fire-and-forget) — 2026-04-12

## Completed (Web i18n + SEO — 2026-04-12)
- [x] Web expandida de 3 a 8 idiomas (es/en/gl/fr/de/ko/pt/pl) — 72 páginas estáticas
- [x] SEO completo: robots.txt, llms.txt, llms-full.txt, BreadcrumbList, FAQPage, OG, hreflang
- [x] I18nText type compartido, utils/json-ld.ts para JSON-LD reutilizable
- [x] PricingTable.astro: tabla de precios semántica en todas las páginas de detalle
- [x] Build: 72 páginas en 5.5s, 0 JS en cliente

## Pending

### MCP Server
- [ ] Create casasvigo-mcp server (stdio, wrappea API REST) — medium
- [ ] Register in .mcp.json — medium

### Windows Service & Lifecycle
- [ ] Script install-service.js (NSSM setup) — medium
- [ ] Implement sleep/wake handler (sleeptime package) — medium
- [ ] Implement watchdog (health check cada 30s) — medium

### Data & Sync
- [ ] Script backup-db.js (DB → Google Drive) — low
- [x] sync-web.js: genera flats.ts completo desde API (DB es la única fuente de verdad). sync-availability.js sigue existiendo solo para overlay disponibilidad rápida — 2026-05-03

### Dominio & DNS
- [ ] Buscar proveedor DNS gratis o muy barato para dominio propio apuntando a GitHub Pages — high
  - Opciones a evaluar: Cloudflare (DNS gratis), Freenom, Porkbun, Namecheap, deSEC
  - Requisito: CNAME record hacia elbenxo.github.io + HTTPS automático via GitHub Pages
  - Actualizar astro.config.mjs site URL y base path cuando se tenga dominio
  - Configurar custom domain en GitHub Pages settings

### Web multi-idioma: mantenimiento
- [ ] Cuando se añada un nuevo idioma: crear 5 pages + traducciones + datos. Todo lo demás (Layout, Nav, hreflang) es automático — low (documentar proceso)
