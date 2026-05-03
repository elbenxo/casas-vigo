# Casas Vigo - Flat Management System

Monorepo para gestion de alquiler de habitaciones en Vigo, Spain.
Repo: github.com/elbenxo/casas-vigo

## Quick Links

### Skills
- **Producto**: `.claude/skills/product/SKILL.md` — Que es el sistema, decisiones confirmadas
  - Decisiones: `.claude/skills/product/references/product-decisions.md`
  - Arquitectura: `.claude/skills/product/references/architecture.md`
- **Planning**: `.claude/skills/planning/SKILL.md` — Tareas pendientes, progreso, roadmap
  - Web SEO/GEO: `.claude/skills/planning/references/web-seo-geo.md`
  - Dashboard: `.claude/skills/planning/references/dashboard.md`
  - Agentes: `.claude/skills/planning/references/agents-implementation.md`
  - Infraestructura: `.claude/skills/planning/references/infrastructure.md`
- **Property Data**: `.claude/skills/property-data/SKILL.md` — Toda la info de pisos, habitaciones, precios, condiciones de alquiler, licencias turisticas, normas. Fuente de verdad para agentes.
  - Inventario: `.claude/skills/property-data/references/flats.md`
  - Normas, FAQ y condiciones: `.claude/skills/property-data/references/house-rules.md`

### Estructura del monorepo
```
web/              Astro + Tailwind, GitHub Pages (5 pisos, 23 habs, 67 fotos, 8 idiomas)
                  src/data/flats.ts es AUTO-GENERADO desde la DB (no editar a mano)
agents/
  src/api/        Core API (Express :3000, SQLite) — unico acceso a DB
                  routes/: flats, rooms, photos, reviews, contacts, income, costs,
                           receipts, messages, appointments, config, prospects,
                           contracts, deploy-web, stats, health
                  db/: schema.sql + migrations.js (idempotente) + content.js (i18n)
  src/agents/     Sales agent + Tenant agent + Owner handler (claude -p) — TODO
  src/transport/  WhatsApp client (whatsapp-web.js)
  src/mcp/        MCP server (casasvigo-mcp, stdio)
  src/lifecycle/  Windows service, watchdog, sleep handler
  templates/      Contratos y recibos multiidioma
dashboard/
  public/         HTML + Vanilla JS + Tailwind CDN (servido por Express)
                  Pages: home, flats, rooms, photos, occupancy, calendar, income,
                         costs, contacts, prospects, contracts, config
data/
  casasvigo.db    SQLite (fuente de verdad: pisos, habs, fotos, reviews i18n,
                  prospects, contratos, ingresos, costes...)
  contracts/      HTML de contratos generados
  availability.json  Overlay de disponibilidad/precios (sync-availability.js)
scripts/
  sync-availability.js  Overlay rápido /api/rooms → availability.json
  sync-web.js           DB → web/src/data/flats.ts completo (i18n + fotos + reviews)
  sync-llms.js          DB → llms.txt + llms-full.txt (GEO)
  import-photos.js      web/public/images/ → tabla photos (legacy import)
  preview-web.js        sync-availability + sync-web + sync-llms + astro build
  deploy-web.js         git commit + push (TRACKED: flats.ts, availability.json, llms*)
  backup-db.js          DB → Google Drive (TODO)
  install-service.js    NSSM setup (TODO)
```

### Arquitectura
- **1 proceso Node.js** (Windows Service via NSSM): API + Dashboard + Agentes
- **SQLite** como fuente de verdad, acceso solo via API REST (:3000)
- **3 canales de control**: WhatsApp, Dashboard (localhost), Claude Code (MCP)
- **Web 100% gestionada desde la DB**: editas en el dashboard → sync-web → 72 páginas
- **LLM**: Claude CLI (`claude -p --model sonnet`)
- Ver detalles completos: `.claude/skills/product/references/architecture.md`

### Resumen del producto
- 5 pisos (4 en Alfonso XIII 9, 1 en Irmandinos 23), 23 habitaciones, 300-400 EUR/mes
- Web: escaparate estatico con disponibilidad, SEO + GEO; contenido multilingüe
  generado desde la DB (descripciones, nombres, reviews, fotos en 8 idiomas)
- Sales agent: info, citas, contratos. Canal: WhatsApp (extensible a Telegram)
- Tenant agent: recibos, facturas suministros, comunicaciones
- Dashboard: CMS completo (CRUD pisos, habitaciones, fotos, reviews, ingresos,
  costes, prospects, contratos, configuración) + Vista previa + Publicar web
- MCP server: gestion por lenguaje natural desde Claude Code
- Propietario controla via WhatsApp, dashboard, o Claude Code
- Idiomas: ES, EN, GL, FR, DE, KO, PT, PL (72 páginas estáticas)
- Horario agentes: 8:00-23:00
- Presupuesto: gratis o minimo

### Comandos clave
```
# DB y datos
node agents/src/api/db/seed.js       # Inicializa DB (idempotente: refresca contenido i18n)
node scripts/import-photos.js        # Re-importa fotos desde web/public/images/

# Web preview/publish
# (vía dashboard: botón "Vista previa" → "Publicar"/"Cancelar")
node scripts/preview-web.js          # sync + build (sin git push)
node scripts/deploy-web.js           # commit + push de los 4 ficheros tracked

# Tests
cd agents && npm test                # 77 tests (Health, CRUD, i18n, Photos, Reviews, Contracts)
```

## Entorno
- Platform: Windows 10 Pro
- User: Benxamin Porto (elbenxo)
- Idioma: Espanol (terminos tecnicos en ingles OK)
