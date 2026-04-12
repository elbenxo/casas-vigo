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
- [x] Rendimiento por m² (EUR/m²/mes) — ranking global + por piso + por tarjeta de habitación — 2026-04-12
- [x] Mostrar "ocupada hasta" en tarjetas de habitación (contract_end desde contacts) — 2026-04-12
- [x] Alertas de contratos por vencer (próximos 60 días, con urgencia visual) — 2026-04-12
- [x] Calendario Gantt de alquileres (calendar.html) — timeline horizontal, barras por contrato, navegación por año — 2026-04-12
- [x] Añadidas 2 nuevas páginas a navegación: Ocupación, Calendario — 2026-04-12

## In Progress
_(none)_

## Pending

### Income View
- [ ] Show occupancy rate per room/flat alongside income — medium

### Dashboard como CMS (gestión completa de contenido web)
Objetivo: el dashboard es el único sitio desde donde se gestiona todo el contenido que aparece en la web pública. "Publicar" sincroniza todo y despliega. **Un solo click = las 72 páginas (8 idiomas × 9 tipos) se regeneran.**

#### Gestión de pisos
- [ ] CRUD pisos desde dashboard (nombre, dirección, barrio, descripción multiidioma, amenities, coordenadas) — high
- [ ] Formulario crear/editar piso con todos los campos — high

#### Gestión de habitaciones
- [ ] CRUD habitaciones desde dashboard (nombre, precio, tamaño, tipo cama, features, estado) — high
- [ ] Asignar habitación a piso — high

#### Gestión de fotos
- [ ] API: endpoint upload fotos `POST /api/photos` (guardar en `web/public/images/`) — high
- [ ] API: endpoint listar/editar/borrar fotos por piso/habitación — high
- [ ] DB: tabla `photos` (id, flat_id, room_id nullable, filename, description, active, sort_order, uploaded_at) — high
- [ ] Dashboard: galería de fotos por piso con drag-and-drop para reordenar — high
- [ ] Dashboard: subir fotos desde el navegador (dropzone o input file) — high
- [ ] Dashboard: asignar fotos a habitaciones o zonas comunes — high
- [ ] Dashboard: activar/desactivar fotos individuales — medium
- [ ] Dashboard: descripción/alt text por foto (para SEO) — medium
- [ ] Dashboard: elegir foto principal (portada) por piso y por habitación — medium

#### Sync completo (flats.ts 100% auto-generado desde API)
El script sync-web.js reemplaza al actual sync-availability.js. Genera TODO el contenido web desde la API, para que un cambio en el dashboard se propague a los 8 idiomas automáticamente.

- [ ] Crear sync-web.js que genera flats.ts completo desde API (pisos, habitaciones, precios, disponibilidad, fotos, descripciones multiidioma) — high
- [ ] flats.ts pasa a ser 100% auto-generado (no editable manualmente) — high
- [ ] Sync incluye: fotos activas con sort_order, alt texts para SEO — high
- [ ] Generar llms.txt y llms-full.txt desde API (GEO siempre actualizado) — medium
- [ ] deploy-web.js: sincroniza fotos + datos + git push → 72 páginas regeneradas — high
- [ ] Flujo completo desde dashboard: Vista previa → Publicar/Cancelar — high (ya existe, conectar con sync-web.js)

#### Reviews
- [ ] CRUD reviews desde dashboard (nombre, texto multiidioma, piso) — low

### Prospect CRM & Analytics (prospects.html) — 2026-04-12
Objetivo: visibilidad completa del funnel comercial — quién pregunta, por dónde, en qué estado está, y métricas de conversión. Sin CRM externo, todo local.

#### Base de datos de prospects
- [x] DB: tabla `prospects` (id, name, phone, email, language, channel, status, flat_interest, room_interest, notes, created_at, updated_at) — 2026-04-12
- [x] DB: tabla `prospect_interactions` (id, prospect_id, type, direction, summary, channel, created_at) — 2026-04-12
- [ ] DB: tabla `web_hits` (id, page, referrer, utm_source, utm_medium, utm_campaign, language, user_agent, ip_hash, created_at) — medium
- [x] API: CRUD endpoints /api/prospects, /api/prospects/:id/interactions (8 endpoints) — 2026-04-12
- [x] API: GET /api/prospects/analytics/summary (by_status, by_channel, funnel, avg_days, monthly_leads) — 2026-04-12
- [ ] API: POST /api/hits (pixel tracking desde la web) — medium

#### Pipeline de ventas
- [x] Dashboard: vista Kanban del funnel: Nuevo → Contactado → Visita prog. → Visita hecha → Contrato env. → Firmado / Perdido — 2026-04-12
- [x] Dashboard: ficha de prospect con historial de interacciones (timeline) — 2026-04-12
- [x] Dashboard: crear prospect manualmente — 2026-04-12
- [ ] Dashboard: auto-crear prospect desde mensajes WhatsApp (requiere sales agent) — high
- [x] Dashboard: mover prospects entre estados con botones (→ avanzar, ✗ perdido) — 2026-04-12
- [x] Dashboard: filtrar por piso de interés, canal, estado — 2026-04-12
- [x] Dashboard: campo "motivo de pérdida" cuando se marca como Perdido (precio, ubicación, timing, otro) — 2026-04-12

#### Estadísticas y métricas
- [x] Dashboard: KPIs — leads activos, tasa de conversión, leads este mes — 2026-04-12
- [x] Dashboard: gráfico leads por canal (barras horizontales) — 2026-04-12
- [x] Dashboard: gráfico funnel de conversión — 2026-04-12
- [x] Dashboard: leads por mes (últimos 6 meses, barras) — 2026-04-12
- [ ] Dashboard: ranking de habitaciones más demandadas — medium
- [ ] Dashboard: mapa de calor por idioma/nacionalidad de los prospects — low

#### Tracking web (analytics propios)
- [ ] Web: pixel tracker ligero (1 JS, envía a /api/hits) — sin cookies, solo page+referrer+UTM — medium
- [ ] Web: UTM params en links de WhatsApp/Telegram para atribución de canal — medium
- [ ] Dashboard: visitas por página, por idioma, por referrer — medium
- [ ] Dashboard: tendencia de visitas diarias/semanales — low

#### Integración con agentes
- [ ] Sales agent auto-crea prospect + interaction al recibir primer mensaje — high
- [ ] Sales agent actualiza estado del prospect según conversación — medium
- [ ] Sales agent registra cada interacción en prospect_interactions — high

### Gestión de contratos (contracts.html) — 2026-04-12
Objetivo: crear, almacenar e imprimir contratos desde el dashboard. Contratos basados en plantillas con placeholders, multi-idioma, guardados en filesystem.

**Flujo clave**: el contrato se genera desde el **prospect**, no desde el inquilino. La firma del contrato es lo que convierte un prospect en tenant (contact). El ciclo es: Prospect → Contrato generado → Contrato firmado → se crea Contact + se asigna Room.

#### Plantillas de contrato
- [x] 8 plantillas en `agents/templates/contracts/contract-{lang}.html` (ES, EN, GL, FR, DE, KO, PT, PL) — 2026-04-12
- [x] Placeholders: {{tenant_name}}, {{tenant_dni}}, {{room_name}}, {{flat_address}}, {{monthly_rent}}, {{deposit}}, {{start_date}}, {{end_date}}, etc. — 2026-04-12
- [x] Incluye: condiciones, normas, cláusulas legales, espacio firmas, @media print A4 — 2026-04-12
- [x] DB: tabla `contracts` (id, prospect_id, room_id, template_lang, file_path, status, monthly_rent, deposit, dates) — 2026-04-12

#### Dashboard: generación de contratos (desde prospect)
- [x] Dashboard: seleccionar prospect + habitación + idioma → auto-rellenar → generar — 2026-04-12
- [x] Dashboard: preview del contrato en iframe — 2026-04-12
- [x] Dashboard: generar → guardar como HTML en `data/contracts/{prospect_id}_{room}_{date}.html` — 2026-04-12
- [x] Dashboard: botón imprimir (window.print()) — 2026-04-12
- [x] Dashboard: lista de contratos con filtros (estado, piso) — 2026-04-12
- [x] Dashboard: "Firmar" → auto-crear contact + asignar room + prospect → Firmado (transacción atómica) — 2026-04-12
- [x] Dashboard: terminar contrato — 2026-04-12

#### También accesible desde Kanban
- [x] Pipeline Kanban: link a contratos desde cards de prospect — 2026-04-12
- [ ] Pipeline Kanban: acción rápida "Firmado" directa desde Kanban (actualmente vía contracts page) — medium

#### API
- [x] API: POST /api/contracts/generate — 2026-04-12
- [x] API: GET /api/contracts, GET /api/contracts/:id (con JOINs a prospects y rooms) — 2026-04-12
- [x] API: PUT /api/contracts/:id/sign → transacción atómica (contract + contact + room + prospect) — 2026-04-12
- [x] API: PUT /api/contracts/:id/status (draft → terminated) — 2026-04-12
- [x] API: GET /api/contracts/:id/download — 2026-04-12

#### Code quality (simplify 2026-04-12)
- [x] contractGenerator.js: template cache + mkdirSync guard — 2026-04-12
- [x] Shared constants.js (PROSPECT_STATUSES, PRE_CONTRACT_STATUSES) — 2026-04-12
- [x] Shared esc() in app.js (eliminadas 2 copias privadas) — 2026-04-12
- [x] Fix: path depth bug en CONTRACTS_OUTPUT_DIR (5→4 niveles) — 2026-04-12
- [x] Fix: _computeAnalytics variable 'signed' filtrando 'lost' — 2026-04-12

### Constraints
- Runs on localhost only (NOT internet-facing)
- Dashboard es read+write: CMS completo para el propietario
- Simplest tech possible
- Un rebuild genera las 72 páginas de los 8 idiomas (5.5s actualmente)
- Contratos en filesystem (no en DB), indexados en tabla `contracts`
- Analytics sin cookies ni servicios externos — todo local
