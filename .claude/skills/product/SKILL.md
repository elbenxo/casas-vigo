---
name: product
description: "Product definition for Casas Vigo flat management system. Use this skill when discussing product scope, features, decisions, architecture, or when you need to understand what the system does and why. Trigger when the user mentions product decisions, requirements, scope, features, or asks 'what does the system do'."
---

# Casas Vigo - Product Definition

This skill contains the canonical product definition. Read the references before making any suggestion about features, scope, or architecture.

## References

- `references/product-decisions.md` — All confirmed decisions (what to build, what NOT to build, budget, priorities)
- `references/architecture.md` — System architecture and data flow

## Quick summary

Casas Vigo is a flat/room management system for 5 rental properties (27 rooms) in Vigo, Spain. Three components:

1. **Web** (`web/`) — Static escaparate with availability by dates, SEO + GEO optimized. Astro + Tailwind, GitHub Pages.
2. **Agents** (`agents/`) — Pre-venta (WhatsApp/Telegram, info, calendar, contracts) + Post-venta (invoices, communications to tenants).
3. **Dashboard** (`dashboard/`) — Local read-only view of income, costs, occupancy.

Shared data lives in `data/`. The owner controls everything via WhatsApp to the agents.

## Monorepo structure

```
casas-vigo/                       (github.com/elbenxo/casas-vigo)
├── web/                          Astro static site, 3 languages, 67 photos
├── agents/
│   ├── services/whatsapp-api/    Express + whatsapp-web.js
│   ├── sales-agent/              Pre-venta agent config
│   └── tenant-agent/             Post-venta agent config
├── dashboard/                    Local app (to build)
├── data/                         Shared data (availability.json)
├── docs/                         Product decisions, architecture
└── .claude/skills/               Skills (product, planning, property-data)
```

## When making decisions

Always check `references/product-decisions.md` first. Key constraints:
- Budget: free or minimum cost
- No SaaS, no multi-user
- No backend for the web (static only)
- Owner controls via WhatsApp, not via app UI
- Agents respond 9:00-13:00, 7 days/week

## Language

Communicate with the user in Spanish. Technical terms in English are fine.
