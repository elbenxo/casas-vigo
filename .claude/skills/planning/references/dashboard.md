# Task Group: Dashboard Builder

Build the local read-only dashboard (dashboard/) for the property owner.

## Completed
_(none yet)_

## In Progress
_(none yet)_

## Pending

### Setup
- [ ] Choose tech stack (simplest option: static HTML + JS reading JSON files, or lightweight framework) — high
- [ ] Define data model for income and costs — high

### Income View
- [ ] Show income per room per month — high
- [ ] Show income per flat per month — high
- [ ] Show annual totals — medium
- [ ] Show occupancy rate per room/flat — medium

### Costs View
- [ ] Track costs by category (IBI, internet, seguros, agua, luz, reparaciones) — high
- [ ] Show costs per flat per month — high
- [ ] Show annual cost totals — medium

### Occupancy View
- [ ] Read from data/availability.json — high
- [ ] Visual calendar showing occupied/free dates per room — medium
- [ ] Summary: current occupancy rate — medium

### Data
- [ ] Define JSON format for income records — high
- [ ] Define JSON format for cost records — high
- [ ] Dashboard reads from data/ folder (same source of truth) — high

### Constraints
- Runs on localhost only (NOT internet-facing)
- Read-only (owner modifies data via WhatsApp to agents)
- Simplest tech possible
