---
name: git-workflow
description: Git workflow patterns including branching strategies, commit conventions, merge vs rebase, conflict resolution, and collaborative development.
origin: ECC (everything-claude-code)
---

# Git Workflow Patterns

## When to Activate

- Setting up Git workflow for a new project
- Deciding on branching strategy
- Writing commit messages and PR descriptions
- Resolving merge conflicts
- Managing releases

## Branching Strategies

### GitHub Flow (Recommended)

```
main (always deployable)
  +-- feature/room-api       -> PR -> merge
  +-- fix/whatsapp-timeout   -> PR -> merge
```

### Conventional Commits

```
<type>(<scope>): <subject>

Types: feat, fix, docs, refactor, test, chore, perf, ci
```

| Type | Example |
|------|---------|
| feat | `feat(api): add room availability endpoint` |
| fix | `fix(agent): handle null WhatsApp response` |
| refactor | `refactor(db): extract connection pool` |
| test | `test(api): add room endpoint tests` |

### Merge vs Rebase

- **Merge**: for shared branches, preserves history
- **Rebase**: for local-only branches, linear history
- **NEVER** rebase pushed/shared branches

### Branch Naming

```
feature/room-availability-api
fix/whatsapp-connection-timeout
hotfix/critical-security-patch
release/1.2.0
```

### PR Template

```markdown
## What
Brief description.

## Why
Motivation and context.

## Testing
- [ ] Unit tests added
- [ ] Manual testing done
```

## Anti-Patterns

- Committing to main directly
- Committing secrets
- Giant PRs (1000+ lines)
- Vague commit messages
- Force pushing to main
- Long-lived branches
