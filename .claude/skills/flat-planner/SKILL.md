---
name: flat-planner
description: "Plan and develop the Vigo flat/room management system. Use this skill when the user wants to work on the flat management project, answer planning questions, review the architecture, define features, check project progress, or build any component of the room rental system (web, agent, local app). Also trigger when the user mentions casasvigo, rooms, flats, pisos, habitaciones, alquiler, tenants, inquilinos, or Vigo Room Manager."
---

# Flat Management System Planner

You are helping plan and build a flat/room management system for rental properties in Vigo, Spain. This is an incremental planning process - the user may answer a few questions per session, especially from mobile.

## First thing: load context

1. Read `references/product-decisions.md` — All confirmed product decisions. This is the source of truth for what has been decided.
2. Read `references/existing-infrastructure.md` — What already exists in each repo.
3. Read `E:/Claude/FlatManagementSystem/planning.md` — Current planning state, pending questions, architecture plan.

Show the user a brief status and what to work on next.

## The three components

| Component | Repo | Status |
|-----------|------|--------|
| **Public Web** - SEO-optimized, free hosting, multilingual, shows rooms/availability | `/casasvigo` | Has WhatsApp bot infra, no web yet |
| **AI Agent** - WhatsApp + other channels, answers inquiries, sends contracts, multilingual | `/casasvigo` | Express API + whatsapp-web.js exists |
| **Local Management App** - Desktop, NOT internet-facing, income/costs/availability | `/Vigo_room_manager` | Empty repo |

## How to run a session

1. Read `planning.md` to get current state
2. Show a **short summary** of progress (mobile-friendly, max 5 lines)
3. Present the **next unanswered block** (or let the user pick)
4. Show questions **3-5 at a time** max (mobile screens are small)
5. After the user answers, update `planning.md` immediately
6. If enough questions are answered (20+), offer to generate the architecture plan
7. Always end with: what's pending and a suggestion for next session

## Adapting to context

- **Mobile session**: Be extra concise. Short questions, short confirmations. No walls of text.
- **Desktop session**: Can go deeper, show architecture diagrams, write code.
- **If user says "plan"**: Show architecture overview based on current answers.
- **If user says "build"**: Start implementing based on the plan. Check `planning.md` for decisions.
- **If user gives answers unprompted**: Parse them, match to questions, update `planning.md`.

## The 36 planning questions

Organized in 6 blocks. Present one block at a time. Within a block, show 3-5 questions max per turn.

### Block 1: Properties & Rooms (Q1-Q8)
1. How many flats do you manage? How many rooms total?
2. Where are they? All in Vigo? Same neighborhood?
3. Rental type: monthly, seasonal, short-term (Airbnb-style), or mix?
4. Tenant profile: students, workers, tourists, digital nomads...?
5. What info per room? (size, price, photos, private/shared bathroom, furnished, internet, bills included...)
6. Common areas to showcase? (kitchen, living room, terrace...)
7. Fixed prices or variable by season/duration?
8. Do you already have photos of the rooms and flats?

### Block 2: Public Web (Q9-Q16)
9. Do you own a domain? (e.g., casasvigo.com)
10. Hosting preference: GitHub Pages (free, static) or something with more features?
11. Web purpose: showcase only (info + contact) or should users be able to request/book directly?
12. Availability display: real-time availability on web, or just a "check availability" button linking to WhatsApp/agent?
13. Web languages: Spanish + English? Portuguese too (Portugal is close)?
14. SEO target keywords: "habitaciones en Vigo", "rooms for rent Vigo", others?
15. Need a blog or extra content for SEO, or just room pages?
16. Should the web live in the CasasVigo repo or a separate one?

### Block 3: AI Agent (Q17-Q23)
17. Primary channel: WhatsApp? Reuse existing CasasVigo bot infrastructure?
18. Additional channels: Telegram, email, web chat, Instagram DMs?
19. Agent capabilities needed: answer questions, check availability, make reservations, send contracts, payment instructions, handle current tenant issues?
20. Contracts: do you have a base template? What format? What fields get customized? (name, ID/passport, dates, price, room...)
21. Agent languages: same as web? More?
22. Agent autonomy: can it confirm bookings alone, or must it always escalate to you for approval?
23. Agent schedule: 24/7 or business hours? What happens outside hours?

### Block 4: Local Management App (Q24-Q30)
24. Who uses it? Just you, or others too (partner, business partner, accountant...)?
25. Income data needed: per room, per flat, per month, annual totals?
26. Costs to track: mortgage, community fees, electricity, water, internet, cleaning, repairs, taxes...?
27. Need tax-ready reports or similar?
28. Tenant management: personal data, move-in/out dates, contract status, deposit...?
29. Alerts: contract expiring soon? Payment not received?
30. UI preference: desktop GUI app or a web interface running on localhost?

### Block 5: Architecture & Data (Q31-Q33)
31. Source of truth: where does the master data for rooms and availability live? Local app? A shared JSON/database?
32. Sync: when the agent confirms a booking, how should it update the web and local app? Shared data source?
33. Repo structure: CasasVigo for web + agent, Vigo_Room_Manager for local management? Or different?

### Block 6: Budget & Priorities (Q34-Q36)
34. Real budget: absolute zero cost? Or room for a domain (~10-12 EUR/year) and maybe basic hosting?
35. Development priority: what do you need FIRST? Web? Agent? Local management?
36. Timeline: any target date? Do you have empty rooms right now that need filling?

## Planning document template

When creating `planning.md` for the first time, use this structure:

```markdown
# Flat Management System - Planning

## Status
- Last updated: [date]
- Questions answered: 0/36
- Current phase: Gathering requirements

## Answers

### Block 1: Properties & Rooms
_(unanswered)_

### Block 2: Public Web
_(unanswered)_

### Block 3: AI Agent
_(unanswered)_

### Block 4: Local Management App
_(unanswered)_

### Block 5: Architecture & Data
_(unanswered)_

### Block 6: Budget & Priorities
_(unanswered)_

## Architecture Plan
_(will be generated after enough questions are answered)_

## Implementation Roadmap
_(will be generated after architecture is defined)_
```

## When updating planning.md

- Replace `_(unanswered)_` with the actual answers under each block
- Update the question count and date
- Keep answers concise but complete
- If the user changes a previous answer, update it and note the change
- When generating the architecture plan, write it in the Architecture Plan section

## Generating the architecture plan

Once 20+ questions are answered, offer to generate a plan covering:

1. **Data model** - Rooms, flats, tenants, bookings, costs, income
2. **Tech stack per component** - Specific choices justified by the answers
3. **Data flow** - How the three components share data
4. **Hosting & deployment** - Minimizing cost based on budget answers
5. **Implementation phases** - Ordered by priority answers
6. **Cost estimate** - Domain, hosting, APIs, etc.

Write the plan into `planning.md` and also create `architecture.md` with the detailed technical design.

## Language

The user speaks Spanish. Communicate in Spanish unless they switch to English. Technical terms can stay in English.
