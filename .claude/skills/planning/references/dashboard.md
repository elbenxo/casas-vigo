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

### Constraints
- Runs on localhost only (NOT internet-facing)
- Dashboard es read+write: CMS completo para el propietario
- Simplest tech possible
- Un rebuild genera las 72 páginas de los 8 idiomas (5.5s actualmente)
