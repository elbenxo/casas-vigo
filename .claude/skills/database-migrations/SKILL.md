---
name: database-migrations
description: Database migration best practices for schema changes, data migrations, rollbacks, and zero-downtime deployments. Covers SQLite and PostgreSQL.
origin: ECC (everything-claude-code)
---

# Database Migration Patterns

Safe, reversible database schema changes for production systems.

## When to Activate

- Creating or altering database tables
- Adding/removing columns or indexes
- Running data migrations (backfill, transform)
- Planning zero-downtime schema changes
- Setting up migration tooling for a new project

## Core Principles

1. **Every change is a migration** — never alter production databases manually
2. **Migrations are forward-only in production** — rollbacks use new forward migrations
3. **Schema and data migrations are separate** — never mix DDL and DML in one migration
4. **Test migrations against production-sized data**
5. **Migrations are immutable once deployed** — never edit a deployed migration

## Migration Safety Checklist

- [ ] Migration has both UP and DOWN (or is marked irreversible)
- [ ] No full table locks on large tables
- [ ] New columns have defaults or are nullable
- [ ] Indexes created without blocking writes where possible
- [ ] Data backfill is a separate migration from schema change
- [ ] Tested against a copy of production data
- [ ] Rollback plan documented

## SQLite Patterns

### Adding a Column Safely

```sql
-- GOOD: Nullable column
ALTER TABLE rooms ADD COLUMN notes TEXT;

-- GOOD: Column with default
ALTER TABLE rooms ADD COLUMN is_furnished INTEGER NOT NULL DEFAULT 1;

-- BAD: NOT NULL without default (fails on existing rows)
ALTER TABLE rooms ADD COLUMN category TEXT NOT NULL;
```

### Creating Indexes

```sql
CREATE INDEX IF NOT EXISTS idx_rooms_flat_id ON rooms (flat_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms (status);
CREATE INDEX IF NOT EXISTS idx_rooms_flat_status ON rooms (flat_id, status);
```

### Renaming a Column (Expand-Contract)

```sql
-- Step 1: Add new column
ALTER TABLE tenants ADD COLUMN display_name TEXT;

-- Step 2: Backfill data (separate migration)
UPDATE tenants SET display_name = name WHERE display_name IS NULL;

-- Step 3: Update app code to read/write both columns, deploy

-- Step 4: Drop old column (SQLite 3.35.0+)
ALTER TABLE tenants DROP COLUMN old_name;
```

### Large Data Migrations

```javascript
// Batch update in application code
while (true) {
  const batch = db.all('SELECT id FROM rooms WHERE normalized_name IS NULL LIMIT 1000')
  if (batch.length === 0) break
  for (const row of batch) {
    db.run('UPDATE rooms SET normalized_name = LOWER(name) WHERE id = ?', [row.id])
  }
}
```

## Zero-Downtime Migration Strategy

```
Phase 1: EXPAND
  - Add new column/table (nullable or with default)
  - Deploy: app writes to BOTH old and new
  - Backfill existing data

Phase 2: MIGRATE
  - Deploy: app reads from NEW, writes to BOTH
  - Verify data consistency

Phase 3: CONTRACT
  - Deploy: app only uses NEW
  - Drop old column/table in separate migration
```

## Migration File Structure

```
migrations/
├── 001_create_flats.sql
├── 002_create_rooms.sql
├── 003_create_tenants.sql
├── 004_create_contracts.sql
├── 005_add_room_notes.sql
├── 006_backfill_room_notes.sql
└── 007_add_room_amenities.sql
```

## Anti-Patterns

| Anti-Pattern | Why It Fails | Better Approach |
|---|---|---|
| Manual SQL in production | No audit trail | Always use migration files |
| Editing deployed migrations | Causes drift | Create new migration |
| NOT NULL without default | Locks/fails on existing rows | Add nullable, backfill, constrain |
| Schema + data in one migration | Hard to rollback | Separate migrations |
| Dropping column before removing code | App errors | Remove code first, drop next deploy |
