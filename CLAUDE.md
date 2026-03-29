# Casas Vigo - Flat Management System

Monorepo para gestion de alquiler de habitaciones en Vigo, Spain.
Repo: github.com/elbenxo/casas-vigo

## Quick Links

### Skills
- **Producto**: `.claude/skills/product/SKILL.md` — Que es el sistema, decisiones confirmadas
  - Decisiones: `.claude/skills/product/references/product-decisions.md`
- **Planning**: `.claude/skills/planning/SKILL.md` — Tareas pendientes, progreso, roadmap
  - Web SEO/GEO: `.claude/skills/planning/references/web-seo-geo.md`
  - Dashboard: `.claude/skills/planning/references/dashboard.md`
  - Agentes: `.claude/skills/planning/references/agents-implementation.md`
  - Infraestructura: `.claude/skills/planning/references/infrastructure.md`
- **Property Data**: `.claude/skills/property-data/SKILL.md` — Pisos, habitaciones, precios
  - Inventario: `.claude/skills/property-data/references/flats.md`
  - Normas y FAQ: `.claude/skills/property-data/references/house-rules.md`

### Estructura del monorepo
```
web/              Astro + Tailwind, GitHub Pages (5 pisos, 27 habs, 67 fotos, 3 idiomas)
agents/           WhatsApp bot infra (Express + whatsapp-web.js)
  sales-agent/    Agente pre-venta (definido, no implementado)
  tenant-agent/   Agente post-venta (definido, no implementado)
dashboard/        App local del propietario (por construir)
data/             Datos compartidos (availability.json)
docs/             Decisiones de producto, arquitectura
```

### Datos compartidos
- `data/availability.json` — Disponibilidad de habitaciones por fechas (fuente de verdad)

### Resumen del producto
- 5 pisos (4 en Alfonso XIII 9, 1 en Irmandinos 23), 27 habitaciones, 300-400 EUR/mes
- Web: escaparate estatico con disponibilidad, SEO + GEO
- Sales agent: info, citas, contratos. Canales: WhatsApp, Telegram (extensible)
- Tenant agent: recibos, facturas suministros, comunicaciones
- Dashboard: lectura + escritura (correccion errores, config, imprimir contratos)
- Propietario controla via WhatsApp y dashboard
- Idiomas: ES, EN, GL, FR, DE, KO, PT, PL
- Horario agentes: 8:00-23:00
- Presupuesto: gratis o minimo

## Entorno
- Platform: Windows 10 Pro
- User: Benxamin Porto (elbenxo)
- Idioma: Espanol (terminos tecnicos en ingles OK)
