---
name: planning
description: "Project planning and task management for Casas Vigo. Use this skill when the user wants to check progress, create tasks, review what's done, plan next steps, or asks about implementation status. Trigger on: 'what's next', 'planning', 'tasks', 'roadmap', 'progress', 'what's pending'."
---

# Casas Vigo - Planning & Tasks

This skill manages implementation planning. Each work area has its own reference file with tasks.

## How it works

1. Read `references/` to see all task groups and their status
2. Show the user a summary of progress across all groups
3. Help create, update, or complete tasks within the appropriate group

## Task groups (references/)

Each reference file contains a group of related tasks:

- `references/web-seo-geo.md` — Tasks for making the web SEO & GEO compatible
- `references/dashboard.md` — Tasks for building the local dashboard
- `references/agents-implementation.md` — Tasks for implementing sales and tenant agents
- `references/infrastructure.md` — Tasks for repo setup, CI/CD, shared data

## Task format

Within each reference file, tasks follow this format:

```markdown
## Task Group Name

### Completed
- [x] Task description — completed date

### In Progress
- [ ] **Task description** — who/what is working on it

### Pending
- [ ] Task description — priority (high/medium/low)
```

## Updating tasks

When a task is completed:
1. Move it from Pending/In Progress to Completed
2. Add the completion date
3. If the task generated new sub-tasks, add them to Pending

When creating new tasks:
1. Identify the correct task group (or create a new reference file if none fits)
2. Add to Pending with priority
3. Update the task group summary

## Session workflow

1. Read all task group references
2. Show: "X tasks completed, Y in progress, Z pending" per group
3. Ask: "What do you want to work on?" or suggest the highest priority pending task
4. Work on it, mark completed when done

## Mobile-friendly

Keep status summaries short (3-5 lines max). On mobile, show only the current group's tasks, not all groups at once.

## Language

Spanish with the user. Task descriptions can be in English or Spanish.
