---
name: deployment-patterns
description: Deployment workflows, CI/CD pipeline patterns, Docker containerization, health checks, rollback strategies, and production readiness checklists.
origin: ECC (everything-claude-code)
---

# Deployment Patterns

Production deployment workflows and CI/CD best practices.

## When to Activate

- Setting up CI/CD pipelines
- Dockerizing an application
- Planning deployment strategy
- Implementing health checks
- Preparing for a production release

## Deployment Strategies

### Rolling Deployment
Replace instances gradually. **Pros:** Zero downtime. **Cons:** Two versions run simultaneously.

### Blue-Green Deployment
Two identical environments, switch traffic atomically. **Pros:** Instant rollback. **Cons:** 2x infrastructure.

### Canary Deployment
Route small % of traffic to new version first. **Pros:** Catches issues early. **Cons:** Requires traffic splitting.

## Docker (Node.js)

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001
USER appuser
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]
```

## Health Checks

```typescript
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/health/detailed", async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
  const allHealthy = checks.database.status === "ok";
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    checks,
  });
});
```

## Environment Configuration

```typescript
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]),
  PORT: z.coerce.number().default(3000),
  DATABASE_PATH: z.string(),
  ANTHROPIC_API_KEY: z.string().min(1),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export const env = envSchema.parse(process.env);
```

## Production Readiness Checklist

### Application
- [ ] All tests pass
- [ ] No hardcoded secrets
- [ ] Error handling covers edge cases
- [ ] Structured logging, no PII
- [ ] Health check endpoint works

### Infrastructure
- [ ] Environment variables validated at startup
- [ ] Resource limits set
- [ ] SSL/TLS enabled

### Monitoring
- [ ] Application metrics exported
- [ ] Alerts configured
- [ ] Log aggregation set up

### Security
- [ ] Dependencies scanned for CVEs
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Auth verified
- [ ] Security headers set

### Operations
- [ ] Rollback plan documented and tested
- [ ] Database migration tested
