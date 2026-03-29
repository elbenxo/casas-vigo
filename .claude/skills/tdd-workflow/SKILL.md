---
name: tdd-workflow
description: Test-driven development workflow. Enforces test-first with 80%+ coverage including unit, integration, and E2E tests.
origin: ECC (everything-claude-code)
---

# Test-Driven Development Workflow

## When to Activate

- Writing new features
- Fixing bugs
- Refactoring code
- Adding API endpoints

## Core Principles

1. **Tests BEFORE Code** — always write tests first
2. **80%+ coverage** — unit + integration + E2E
3. **Three test types** — unit, integration, E2E

## TDD Steps

### 1. Write test cases
```typescript
describe('Room Availability', () => {
  it('returns available rooms for a flat', async () => { })
  it('handles empty result', async () => { })
  it('filters by price range', async () => { })
})
```

### 2. Run tests — RED (they should fail)
```bash
npm test
```

### 3. Write minimal code to pass
```typescript
export async function getAvailableRooms(flatId: string) {
  return db.all('SELECT * FROM rooms WHERE flat_id = ? AND status = ?', [flatId, 'available'])
}
```

### 4. Run tests — GREEN
### 5. Refactor (keep tests green)
### 6. Verify coverage (80%+)

## Test Patterns

### Unit Test

```typescript
describe('calculateMonthlyIncome', () => {
  it('sums occupied room prices', () => {
    const rooms = [
      { price: 350, status: 'occupied' },
      { price: 400, status: 'occupied' },
      { price: 300, status: 'available' }
    ]
    expect(calculateMonthlyIncome(rooms)).toBe(750)
  })
})
```

### API Integration Test

```typescript
describe('GET /api/rooms', () => {
  it('returns rooms', async () => {
    const res = await request(app).get('/api/rooms')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('filters by flat_id', async () => {
    const res = await request(app).get('/api/rooms?flat_id=1A')
    expect(res.status).toBe(200)
    res.body.data.forEach(r => expect(r.flat_id).toBe('1A'))
  })
})
```

### E2E Test (Playwright)

```typescript
test('owner can view rooms', async ({ page }) => {
  await page.goto('/dashboard')
  const cards = page.locator('[data-testid="room-card"]')
  await expect(cards).toHaveCount(27)

  await page.selectOption('[data-testid="flat-filter"]', '1A')
  await expect(cards).toHaveCount(5)
})
```

## Common Mistakes

| Bad | Good |
|-----|------|
| Test internal state | Test user-visible behavior |
| `.css-class-xyz` selectors | `[data-testid="submit"]` |
| Tests depend on each other | Each test sets up own data |
| Only happy path | Test errors and edge cases |

## Coverage Thresholds

```json
{ "coverageThresholds": { "global": { "branches": 80, "functions": 80, "lines": 80 } } }
```
