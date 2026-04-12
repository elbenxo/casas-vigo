# Task Group: Web SEO & GEO

Make the Astro web (web/) SEO and GEO (Generative Engine Optimization) compatible.

## Completed
- [x] Add dynamic meta descriptions per page (flat name, location, price range) — 2026-04-12 (Layout.astro)
- [x] Add Schema.org JSON-LD structured data (LocalBusiness, LodgingBusiness, BreadcrumbList, FAQPage) — 2026-04-12
- [x] Create dynamic sitemap.xml — 2026-04-12 (@astrojs/sitemap)
- [x] Add robots.txt — 2026-04-12 (con reglas para AI crawlers: GPTBot, Claude-Web, etc.)
- [x] Add Open Graph tags (og:title, og:image, og:description) — 2026-04-12 (Layout.astro)
- [x] Add Twitter Card tags — 2026-04-12 (Layout.astro)
- [x] Add canonical URLs per page — 2026-04-12 (Layout.astro)
- [x] Add hreflang tags for 8 languages + x-default — 2026-04-12 (Layout.astro, auto desde languages object)
- [x] Optimize image alt texts for SEO — 2026-04-12 (multiidioma, usa t(lang, 'flats.rooms'))
- [x] Create llms.txt at site root — 2026-04-12 (GEO: resumen para AI crawlers)
- [x] Add llms-full.txt with complete property data — 2026-04-12 (GEO: datos completos, 11KB)
- [x] Ensure clean semantic HTML — 2026-04-12
- [x] Add FAQ section with FAQPage schema — 2026-04-12 (FAQ.astro + utils/json-ld.ts)
- [x] Ensure all property data is in parseable text — 2026-04-12
- [x] Web reads from availability.json — 2026-04-12 (flats.ts overlay)
- [x] Build component showing "Available/Occupied" per room — 2026-04-12
- [x] Add structured pricing tables in HTML — 2026-04-12 (PricingTable.astro, tabla semántica en 8 idiomas)

### i18n expansion (2026-04-12)
- [x] Expand from 3 idiomas (es/en/gl) to 8 (+ fr/de/ko/pt/pl) — 72 páginas estáticas
- [x] translations.ts: ~60 keys × 8 idiomas
- [x] flats.ts: nombres, descripciones, barrios, habitaciones, reviews en 8 idiomas
- [x] vigo.ts: secciones de ciudad en 8 idiomas
- [x] 25 nuevos page files (5 idiomas × 5 tipos de página)
- [x] astro.config.mjs: 8 locales configurados
- [x] Layout.astro: hreflang, og:locale, breadcrumbs, meta descriptions para 8 idiomas
- [x] Nav.astro: language switcher auto-expandido (lee de languages object)
- [x] Tipo compartido I18nText = Record<Lang, string> (en vez de repetir 8 campos)
- [x] utils/json-ld.ts: generateHomeJsonLd(lang) compartido por las 8 home pages
- [x] Telegram link añadido a las 8 páginas de contacto

### Code quality (/simplify 2026-04-12)
- [x] Fix: FlatCard.astro alt text hardcoded en español → usa t(lang, 'flats.rooms')
- [x] Fix: FAQ JSON-LD duplicado (54 líneas × 8 páginas) → extraído a utils/json-ld.ts
- [x] Fix: LocalBusiness solo en home ES → ahora en las 8 home pages
- [x] Fix: Doble semicolon en gl/index.astro
- [x] Refactor: I18nText type compartido en flats.ts y vigo.ts

### Auto-sync (2026-04-12)
- [x] Auto-sync availability.json tras PUT/POST rooms (fire-and-forget en rooms.js) — 2026-04-12

## Pending

### Contact (requiere dar de alta servicios)
- [ ] Dar de alta: número WhatsApp Business, email, bot Telegram — high
- [ ] Replace placeholders con datos reales en las 8 páginas de contacto — high
- [ ] Replace Formspree placeholder con WhatsApp link — high
- [ ] Update astro.config.mjs site URL — medium

### Next available date (para prospects) — 2026-04-12
Objetivo: un prospect que ve una habitación ocupada debe saber cuándo estará libre, sin tener que preguntar.

- [x] `availability.json` incluye `available_from` (fecha) para habitaciones ocupadas — 2026-04-12 (ya existía)
- [x] `sync-availability.js` calcula `available_from` desde rooms DB — 2026-04-12 (ya existía)
- [x] Web: RoomCard.astro componente reutilizable muestra "Disponible desde: DD/MM/YYYY" — 2026-04-12
- [x] Web: badge "Disponible pronto" si `available_from` < SOON_DAYS (30 días) — 2026-04-12
- [x] Web: ordenar habitaciones con sortRoomsByAvailability() en flats.ts — 2026-04-12
- [x] Web: texto multiidioma `flats.availableFrom` + `flats.availableSoon` en 8 idiomas — 2026-04-12
- [x] Schema.org: `availabilityStarts` en structured data de habitaciones ocupadas — 2026-04-12
- [x] FlatCard.astro: badge "disponible pronto" en cards de listado (ventana 60 días) — 2026-04-12

### GEO maintenance
- [ ] Actualizar llms.txt y llms-full.txt cuando cambie inventario (integrar en sync-web.js) — medium
