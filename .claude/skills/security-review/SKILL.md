---
name: security-review
description: Security review checklist and patterns. Use when adding auth, handling user input, working with secrets, creating API endpoints, or implementing sensitive features.
origin: ECC (everything-claude-code)
---

# Security Review

Ensures code follows security best practices and identifies vulnerabilities.

## When to Activate

- Implementing authentication or authorization
- Handling user input or file uploads
- Creating new API endpoints
- Working with secrets or credentials
- Storing or transmitting sensitive data

## Security Checklist

### 1. Secrets Management

```typescript
// NEVER
const apiKey = "sk-proj-xxxxx"

// ALWAYS
const apiKey = process.env.ANTHROPIC_API_KEY
if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured')
```

### 2. Input Validation

```typescript
import { z } from 'zod'

const CreateTenantSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(9).max(15),
  room_id: z.string()
})

export async function createTenant(input: unknown) {
  const validated = CreateTenantSchema.parse(input)
  return await db.run('INSERT INTO tenants ...', validated)
}
```

### 3. SQL Injection Prevention

```typescript
// NEVER
const query = `SELECT * FROM rooms WHERE name = '${userInput}'`

// ALWAYS
const room = db.get('SELECT * FROM rooms WHERE name = ?', [userInput])
```

### 4. Authentication & Authorization

```typescript
export async function deleteRoom(roomId, requesterId) {
  const requester = await getUser(requesterId)
  if (requester.role !== 'owner') return { status: 403, error: 'Forbidden' }
  await db.run('DELETE FROM rooms WHERE id = ?', [roomId])
}
```

### 5. XSS Prevention

```typescript
import DOMPurify from 'isomorphic-dompurify'

function renderUserContent(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
}
```

### 6. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit'

app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
app.use('/api/search', rateLimit({ windowMs: 60 * 1000, max: 10 }))
```

### 7. Error Messages

```typescript
// NEVER
catch (error) { return res.json({ error: error.message, stack: error.stack }) }

// ALWAYS
catch (error) {
  console.error('Internal error:', error)
  return res.status(500).json({ error: 'An error occurred' })
}
```

### 8. Dependencies

```bash
npm audit
npm audit fix
npm ci  # In CI for reproducible builds
```

## Pre-Deployment Checklist

- [ ] No hardcoded secrets
- [ ] All inputs validated
- [ ] All queries parameterized
- [ ] User content sanitized
- [ ] Auth and role checks in place
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Security headers set
- [ ] No sensitive data in errors/logs
- [ ] Dependencies scanned
- [ ] CORS configured
