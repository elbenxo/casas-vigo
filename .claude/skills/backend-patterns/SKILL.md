---
name: backend-patterns
description: Backend architecture patterns, API design, database optimization, and server-side best practices for Node.js, Express, and Next.js API routes.
origin: ECC (everything-claude-code)
---

# Backend Development Patterns

Backend architecture patterns and best practices for scalable server-side applications.

## When to Activate

- Designing REST or GraphQL API endpoints
- Implementing repository, service, or controller layers
- Optimizing database queries (N+1, indexing, connection pooling)
- Adding caching (Redis, in-memory, HTTP cache headers)
- Setting up background jobs or async processing
- Structuring error handling and validation for APIs
- Building middleware (auth, logging, rate limiting)

## API Design Patterns

### RESTful API Structure

```typescript
// Resource-based URLs
GET    /api/markets                 // List resources
GET    /api/markets/:id             // Get single resource
POST   /api/markets                 // Create resource
PUT    /api/markets/:id             // Replace resource
PATCH  /api/markets/:id             // Update resource
DELETE /api/markets/:id             // Delete resource

// Query parameters for filtering, sorting, pagination
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

### Repository Pattern

```typescript
// Abstract data access logic
interface MarketRepository {
  findAll(filters?: MarketFilters): Promise<Market[]>
  findById(id: string): Promise<Market | null>
  create(data: CreateMarketDto): Promise<Market>
  update(id: string, data: UpdateMarketDto): Promise<Market>
  delete(id: string): Promise<void>
}

class SQLiteMarketRepository implements MarketRepository {
  async findAll(filters?: MarketFilters): Promise<Market[]> {
    let query = 'SELECT * FROM markets WHERE 1=1'
    const params: any[] = []

    if (filters?.status) {
      query += ' AND status = ?'
      params.push(filters.status)
    }

    if (filters?.limit) {
      query += ' LIMIT ?'
      params.push(filters.limit)
    }

    return db.all(query, params)
  }
}
```

### Service Layer Pattern

```typescript
// Business logic separated from data access
class MarketService {
  constructor(private repo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    const results = await this.repo.findAll({ search: query, limit })
    return results
  }
}
```

### Middleware Pattern

```typescript
// Request/response processing pipeline
export function withAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const user = await verifyToken(token)
      req.user = user
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}
```

## Database Patterns

### Query Optimization

```typescript
// GOOD: Select only needed columns
const rooms = db.all('SELECT id, name, price, status FROM rooms WHERE flat_id = ?', [flatId])

// BAD: Select everything
const rooms = db.all('SELECT * FROM rooms')
```

### N+1 Query Prevention

```typescript
// BAD: N+1 query problem
const flats = await getFlats()
for (const flat of flats) {
  flat.rooms = await getRoomsByFlat(flat.id)  // N queries
}

// GOOD: Batch fetch
const flats = await getFlats()
const flatIds = flats.map(f => f.id)
const rooms = await getRoomsByFlatIds(flatIds)  // 1 query
const roomsByFlat = new Map()
rooms.forEach(r => {
  if (!roomsByFlat.has(r.flat_id)) roomsByFlat.set(r.flat_id, [])
  roomsByFlat.get(r.flat_id).push(r)
})
flats.forEach(f => { f.rooms = roomsByFlat.get(f.id) || [] })
```

### Transaction Pattern

```typescript
async function createTenantWithContract(tenantData, contractData) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION')
      try {
        db.run('INSERT INTO tenants ...', tenantData)
        db.run('INSERT INTO contracts ...', contractData)
        db.run('COMMIT')
        resolve()
      } catch (err) {
        db.run('ROLLBACK')
        reject(err)
      }
    })
  })
}
```

## Caching Strategies

### Cache-Aside Pattern

```typescript
async function getRoom(id) {
  const cacheKey = `room:${id}`
  const cached = cache.get(cacheKey)
  if (cached) return cached

  const room = await db.get('SELECT * FROM rooms WHERE id = ?', [id])
  if (!room) throw new Error('Room not found')

  cache.set(cacheKey, room, 300)
  return room
}
```

## Error Handling Patterns

### Centralized Error Handler

```typescript
class ApiError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message)
  }
}

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: { code: err.statusCode, message: err.message }
    })
  }

  console.error('Unexpected error:', err)
  return res.status(500).json({
    error: { code: 500, message: 'Internal server error' }
  })
}
```

### Retry with Exponential Backoff

```typescript
async function fetchWithRetry(fn, maxRetries = 3) {
  let lastError
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  throw lastError
}
```

## Authentication & Authorization

### Role-Based Access Control

```typescript
const rolePermissions = {
  owner: ['read', 'write', 'delete', 'admin'],
  agent: ['read', 'write'],
  tenant: ['read']
}

function hasPermission(user, permission) {
  return rolePermissions[user.role]?.includes(permission) || false
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
```

## Rate Limiting

### Simple In-Memory Rate Limiter

```typescript
class RateLimiter {
  private requests = new Map()

  checkLimit(identifier, maxRequests, windowMs) {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []
    const recent = requests.filter(time => now - time < windowMs)

    if (recent.length >= maxRequests) return false

    recent.push(now)
    this.requests.set(identifier, recent)
    return true
  }
}
```

## Background Jobs & Queues

### Simple Queue Pattern

```typescript
class JobQueue {
  private queue = []
  private processing = false

  async add(job) {
    this.queue.push(job)
    if (!this.processing) this.process()
  }

  private async process() {
    this.processing = true
    while (this.queue.length > 0) {
      const job = this.queue.shift()
      try {
        await this.execute(job)
      } catch (error) {
        console.error('Job failed:', error)
      }
    }
    this.processing = false
  }
}
```

## Logging & Monitoring

### Structured Logging

```typescript
class Logger {
  log(level, message, context = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context
    }
    console.log(JSON.stringify(entry))
  }

  info(msg, ctx) { this.log('info', msg, ctx) }
  warn(msg, ctx) { this.log('warn', msg, ctx) }
  error(msg, err, ctx) {
    this.log('error', msg, { ...ctx, error: err.message, stack: err.stack })
  }
}
```
