---
name: dashboard-builder
description: Build operational dashboards that answer real operator questions. Covers layout, metrics selection, panel design, and avoiding vanity metrics.
origin: ECC (everything-claude-code)
---

# Dashboard Builder

Build dashboards that answer real questions, not show every metric.

## When to Activate

- Creating monitoring dashboards
- Adding panels to existing dashboards
- Designing status/overview pages
- Building admin interfaces with metrics

## Core Philosophy

Every panel should answer: **Is it healthy? Where is the bottleneck? What changed? What action to take?**

If a panel doesn't help an operator make a decision, remove it.

## Workflow

### 1. Define Operating Questions

| Category | Questions |
|----------|-----------|
| Health | Is the system up? All services responding? |
| Latency | Are requests fast enough? |
| Throughput | How many requests/messages per minute? |
| Resources | CPU/memory/disk approaching limits? |
| Service | Rooms available? Agents responding? WhatsApp connected? |

### 2. Build Minimum Useful Board

```
=== OVERVIEW ===
[API Status]  [WhatsApp Status]  [SQLite Status]  [Uptime]

=== AGENTS ===
[Messages Today]  [Avg Response Time]  [Active Conversations]

=== PROPERTY ===
[Rooms Available: X/27]  [Occupancy: X%]  [Monthly Revenue]

=== SYSTEM ===
[Memory]  [CPU]  [DB Size]  [Error Rate]
```

### 3. Remove Vanity Panels

If it doesn't help make a decision, cut it.

## Key Metrics for Casas Vigo

| Metric | Source | Panel Type |
|--------|--------|-----------|
| API health | GET /health | Stat (up/down) |
| WhatsApp connected | Transport status | Stat (boolean) |
| Rooms available | COUNT WHERE status='available' | Stat (number) |
| Occupancy rate | occupied/total * 100 | Gauge (%) |
| Messages today | COUNT messages WHERE date=today | Stat |
| Agent response time | AVG(response_ms) | Time series |
| Monthly revenue | SUM(price) WHERE occupied | Stat (EUR) |
| Error rate | errors/total | Time series |

## Panel Design

- Clear titles with units (ms, %, req/s, MB)
- Green/yellow/red thresholds
- Sensible default time ranges
- Size panels by importance

## Anti-Patterns

| Anti-Pattern | Fix |
|---|---|
| 50+ panels | Focus on 10-15 that matter |
| Vanity metrics | Show active/relevant counts |
| No thresholds | Add green/yellow/red zones |
| Missing units | Always include units |
| No grouping | Organize by concern |
