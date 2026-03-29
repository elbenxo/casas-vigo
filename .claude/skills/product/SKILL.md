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

Casas Vigo is a flat/room management system for 5 rental properties (27 rooms) in Vigo, Spain. Three components + MCP:

1. **Web** (`web/`) — Static escaparate with availability by dates, SEO + GEO optimized. Astro + Tailwind, GitHub Pages.
2. **Agents** (`agents/`) — Pre-venta (WhatsApp, info, calendar, contracts) + Post-venta (invoices, communications to tenants). Core API (Express :3000) + SQLite as single data layer.
3. **Dashboard** (`dashboard/`) — Local read+write view of income, costs, occupancy, config. Served by the same Express.
4. **MCP Server** — Claude Code tools for natural-language management by the owner.

All data access goes through the Core API (REST). Owner controls via 3 channels: WhatsApp, Dashboard, Claude Code (MCP).

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
- Owner controls via WhatsApp, Dashboard, or Claude Code (MCP)
- Agents respond 8:00-23:00, 7 days/week
- All data access via Core API REST (no direct SQLite access)
- Single Node.js process, runs as Windows Service (NSSM)

## Language

Communicate with the user in Spanish. Technical terms in English are fine.
