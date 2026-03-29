---
name: e2e-testing
description: Playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strategies.
origin: ECC (everything-claude-code)
---

# E2E Testing Patterns

Comprehensive Playwright patterns for stable, fast, and maintainable E2E test suites.

## When to Activate

- Setting up Playwright for a project
- Writing E2E tests for critical user flows
- Debugging flaky tests
- Configuring CI/CD for E2E tests

## Test File Organization

```
tests/
├── e2e/
│   ├── auth/
│   ├── features/
│   └── api/
├── fixtures/
└── playwright.config.ts
```

## Page Object Model

```typescript
import { Page, Locator } from '@playwright/test'

export class RoomListPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly roomCards: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.roomCards = page.locator('[data-testid="room-card"]')
  }

  async goto() {
    await this.page.goto('/rooms')
    await this.page.waitForLoadState('networkidle')
  }

  async search(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForResponse(resp => resp.url().includes('/api/search'))
  }

  async getCount() { return await this.roomCards.count() }
}
```

## Playwright Configuration

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Flaky Test Fixes

```typescript
// BAD: arbitrary timeout
await page.waitForTimeout(5000)

// GOOD: wait for specific condition
await page.waitForResponse(resp => resp.url().includes('/api/data'))

// GOOD: wait for element stability
await page.locator('[data-testid="menu"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.locator('[data-testid="menu"]').click()
```

### Quarantine flaky tests

```typescript
test('flaky: complex flow', async ({ page }) => {
  test.fixme(true, 'Flaky - Issue #123')
})
```

### Identify flakiness

```bash
npx playwright test tests/search.spec.ts --repeat-each=10
```

## CI/CD Integration

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```
