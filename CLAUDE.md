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
web/              Astro + Tailwind, GitHub Pages (5 pisos, 27 habs, 67 fotos, 3 idiomas)
agents/
  src/api/        Core API (Express :3000, SQLite) — unico acceso a DB
  src/agents/     Sales agent + Tenant agent + Owner handler (claude -p)
  src/transport/  WhatsApp client (whatsapp-web.js)
  src/mcp/        MCP server (casasvigo-mcp, stdio)
  src/lifecycle/  Windows service, watchdog, sleep handler
  templates/      Contratos y recibos multiidioma
dashboard/
  public/         HTML + Vanilla JS + Tailwind CDN (servido por Express)
data/
  casasvigo.db    SQLite (fuente de verdad)
  availability.json  Generado desde API para web
scripts/          sync-availability, deploy-web, backup-db, install-service
```

### Arquitectura
- **1 proceso Node.js** (Windows Service via NSSM): API + Dashboard + Agentes
- **SQLite** como fuente de verdad, acceso solo via API REST (:3000)
- **3 canales de control**: WhatsApp, Dashboard (localhost), Claude Code (MCP)
- **LLM**: Claude CLI (`claude -p --model sonnet`)
- Ver detalles completos: `.claude/skills/product/references/architecture.md`

### Resumen del producto
- 5 pisos (4 en Alfonso XIII 9, 1 en Irmandinos 23), 27 habitaciones, 300-400 EUR/mes
- Web: escaparate estatico con disponibilidad, SEO + GEO
- Sales agent: info, citas, contratos. Canal: WhatsApp (extensible a Telegram)
- Tenant agent: recibos, facturas suministros, comunicaciones
- Dashboard: lectura + escritura (correccion errores, config, imprimir contratos)
- MCP server: gestion por lenguaje natural desde Claude Code
- Propietario controla via WhatsApp, dashboard, o Claude Code
- Idiomas: ES, EN, GL, FR, DE, KO, PT, PL
- Horario agentes: 8:00-23:00
- Presupuesto: gratis o minimo

## Entorno
- Platform: Windows 10 Pro
- User: Benxamin Porto (elbenxo)
- Idioma: Espanol (terminos tecnicos en ingles OK)
