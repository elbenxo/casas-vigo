---
name: property-data
description: "Property and room data for Casas Vigo flats. Use this skill when you need detailed information about flats, rooms, prices, amenities, addresses, or availability. Also use when agents need to load property context for answering tenant/prospect questions. Trigger on: room names, flat addresses, 'Alfonso XIII', 'Irmandinos', room prices, availability."
---

# Casas Vigo - Property Data

This skill provides structured data about all properties and rooms. Agents and other skills load this to answer questions about the flats.

## Quick reference

- **5 flats, 27 rooms** in Vigo
- **Addresses**: Alfonso XIII 9 (4 flats), Irmandinos 23 (1 flat)
- **Price range**: 300-400 EUR/month
- **Room sizes**: 10-16 m2

## Data sources

- `references/flats.md` — Complete flat and room inventory with all details
- `data/availability.json` — Current availability by dates (source of truth)
- `web/src/data/flats.ts` — Web data (TypeScript, includes photos and translations)

## How to use

### For agents answering questions:
1. Read `references/flats.md` for room details (price, size, amenities)
2. Read `data/availability.json` for current availability
3. Construct answer with relevant info + link to web

### For updating data:
1. Owner sends update via WhatsApp (e.g., "habitacion Primavera cerrada hasta julio")
2. Update `data/availability.json`
3. Script pushes change -> web rebuilds

### For the web:
The web reads from `web/src/data/flats.ts`. When room data changes (price, description), update both `flats.ts` and `references/flats.md` to keep them in sync.

## Language

Room names and flat names stay in their original language (Spanish). Descriptions available in ES/EN/GL.
