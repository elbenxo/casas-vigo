---
name: property-data
description: "Property and room data for Casas Vigo flats. Use this skill when you need detailed information about flats, rooms, prices, amenities, addresses, or availability. Also use when agents need to load property context for answering tenant/prospect questions. Trigger on: room names, flat addresses, 'Alfonso XIII', 'Irmandinos', room prices, availability, deposit, contract, empadronamiento, tourist rental, nightly rate."
---

# Casas Vigo - Property Data

This skill provides structured data about all properties and rooms. Agents and other skills load this to answer questions about the flats.

## Quick reference

- **5 flats, 23 rooms** in Vigo
- **Addresses**: Alfonso XIII 9 (4 flats), Irmandinos 23 (1 flat)
- **Monthly price range**: 300-400 EUR/month
- **Room sizes**: 10-16 m2
- **Deposit**: 1 month rent
- **Min. contract**: 2 months (monthly rental)
- **Payment**: Cash preferred
- **Utilities**: ~30 EUR/month per tenant (split equally, per-flat — estimate, subject to change)
- **Tourist licenses**: All Alfonso XIII flats (4). Irmandinos does NOT have one.
- **Rental modes**: Monthly contracts (all flats) + nightly tourist rental (Alfonso XIII flats only)

## Rental conditions

These are critical for agents answering prospect questions:

- **Deposit**: 1 month rent, paid before move-in
- **Minimum contract**: 2 months for monthly rentals
- **Cancellation**: Allowed with penalty of the current month's rent
- **Empadronamiento** (address registration): Available, but requires minimum 6-month contract
- **Couples**: NOT allowed in one room. Each person must rent their own room. No exceptions.
- **Move-in**: After contract is signed AND deposit is paid, subject to room availability
- **Utilities**: Split equally among occupied rooms in each flat (~30 EUR/month estimate, varies by flat and season)
- **Payment method**: Cash preferred

## Data sources

- `references/flats.md` — Complete flat and room inventory with all details
- `references/house-rules.md` — House rules and FAQ for prospects/tenants
- `data/availability.json` — Current availability by dates (source of truth)
- `web/src/data/flats.ts` — Web data (TypeScript, includes photos and translations)

## How to use

### For agents answering questions:
1. Read `references/flats.md` for room details (price, size, amenities)
2. Read `references/house-rules.md` for rules and FAQ
3. Read `data/availability.json` for current availability
4. Construct answer with relevant info + link to web

### For updating data:
1. Owner sends update via WhatsApp (e.g., "habitacion Primavera cerrada hasta julio")
2. Update `data/availability.json`
3. Script pushes change -> web rebuilds

### For the web:
The web reads from `web/src/data/flats.ts`, **AUTO-GENERADO** desde la DB por `scripts/sync-web.js`. No editar `flats.ts` a mano: hacer cambios vía dashboard (`/dashboard/flats.html`, `/dashboard/rooms.html`, `/dashboard/photos.html`) o API REST. El flujo "Vista previa → Publicar" regenera el fichero y lo despliega.

## Bathrooms

Bathrooms are shared freely — no room-to-bathroom assignment. Tenants use whichever is available.

## Cleaning

No cleaning service currently contracted for any flat. Tenants are responsible for keeping common areas clean. This may change in the future.

## Language

Room names and flat names stay in their original language (Spanish). Web y agentes soportan los 8 idiomas: ES, EN, GL, FR, DE, KO, PT, PL. Las traducciones de pisos/habitaciones/descripciones/reviews viven en la DB (`name_i18n`, `description_i18n`, etc.) y se editan vía `dashboard/flats.html`.
