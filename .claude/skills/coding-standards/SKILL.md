---
name: coding-standards
description: Baseline cross-project coding conventions for naming, readability, immutability, and code-quality review.
origin: ECC (everything-claude-code)
---

# Coding Standards & Best Practices

## When to Activate

- Initiating new projects or modules
- Conducting code quality reviews
- Refactoring for consistency
- Enforcing naming conventions

## Core Principles

1. **Readability First** — clear names over comments
2. **KISS** — simplest working solution
3. **DRY** — extract common logic
4. **YAGNI** — build only what's needed

## Naming

```typescript
// Variables: descriptive
const searchQuery = 'Alfonso XIII'
const isAuthenticated = true

// Functions: verb-noun
async function fetchRoomData(roomId: string) { }
function calculateMonthlyIncome(rooms: Room[]) { }
function isValidEmail(email: string): boolean { }
```

## Immutability

```typescript
// GOOD
const updatedRoom = { ...room, status: 'occupied' }
const updatedList = [...rooms, newRoom]

// BAD
room.status = 'occupied'
rooms.push(newRoom)
```

## Error Handling

```typescript
async function fetchData(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw new Error('Failed to fetch data')
  }
}
```

## Async Best Practices

```typescript
// Parallel when possible
const [rooms, tenants] = await Promise.all([fetchRooms(), fetchTenants()])
```

## Code Smells

```typescript
// Long functions: decompose at 50+ lines
function processData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}

// Deep nesting: early returns
if (!user || !user.isOwner) return
if (!room?.isAvailable) return

// Magic numbers: named constants
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500
```

## Comments

```typescript
// GOOD: explain WHY
// Exponential backoff to avoid API rate limit exhaustion
const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)

// BAD: state the obvious
// Increment counter
count++
```

## Testing

```typescript
// AAA pattern, descriptive names
test('returns empty array when no rooms match filter', () => {
  const rooms = []
  const result = filterRooms(rooms, { status: 'available' })
  expect(result).toEqual([])
})
```
