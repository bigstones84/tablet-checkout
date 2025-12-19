# Tablet Price Monitor

Automated price monitoring for Lenovo Tab P12 (128GB/256GB) across 5 Italian retailers with email alerts and price history tracking.

## Product Information

See [product-info.md](./product-info.md) for detailed product specs and market analysis (in Italian).

**SKUs:**
- 128GB WiFi: `ZACH0112SE` (threshold: €350)
- 256GB WiFi: `ZACH0204SE` (threshold: €400)

**Monitored Sites:**
- Amazon.it
- Trovaprezzi.it
- Idealo.it
- Yeppon
- PcComponentes.it

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **HTTP Client**: axios
- **HTML Parsing**: cheerio
- **Email**: nodemailer (Gmail SMTP)
- **Testing**: Jest (TDD approach)
- **Execution**: tsx (no build step needed)

## Project Structure

```
tablet-checkout/
├── src/
│   ├── scrapers/
│   │   ├── amazon.ts
│   │   ├── trovaprezzi.ts
│   │   ├── idealo.ts
│   │   ├── yeppon.ts
│   │   ├── pccomponentes.ts
│   │   └── base.ts (interfaces + utilities)
│   ├── notifier.ts (email alerts)
│   ├── storage.ts (price history management)
│   ├── config.ts (configurable thresholds)
│   └── index.ts (main orchestrator)
├── tests/
│   ├── scrapers/
│   ├── notifier.test.ts
│   ├── storage.test.ts
│   └── integration.test.ts
├── data/
│   └── price-history.json (auto-committed by GitHub Actions)
├── .github/
│   └── workflows/
│       └── price-check.yml
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Configuration Example

```typescript
// src/config.ts
export const PRODUCTS = {
  '128GB': { sku: 'ZACH0112SE', threshold: 350 },
  '256GB': { sku: 'ZACH0204SE', threshold: 400 }
};

export const EMAIL_CONFIG = {
  recipient: process.env.ALERT_EMAIL || '',
  from: 'tablet-monitor@noreply.com'
};
```

## Price History Format

```json
{
  "lastUpdated": "2025-12-19T10:00:00Z",
  "prices": [
    {
      "date": "2025-12-19",
      "model": "128GB",
      "results": [
        {
          "site": "Amazon.it",
          "price": 364,
          "available": true,
          "url": "https://amazon.it/..."
        }
      ]
    }
  ]
}
```

## Development Approach: Test-Driven Development (TDD)

We follow TDD methodology:

1. **Write test first** - Define expected behavior
2. **Run test (it fails)** - Red phase
3. **Write minimal code** - Make it pass
4. **Refactor** - Clean up while keeping tests green
5. **Repeat** - For each new feature

### Testing Strategy

**Unit Tests:**
- Each scraper module (mocked HTTP responses)
- Storage module (read/write/append operations)
- Config module (threshold validation)
- Notifier module (email formatting, mocked SMTP)

**Integration Tests:**
- Full price check flow
- Error handling scenarios
- Price history persistence

**Test Doubles:**
- Mock axios responses for scrapers
- Mock nodemailer for email testing
- Mock file system for storage tests

## Implementation Steps (TDD)

### Phase 1: Core Infrastructure
1. Setup project: package.json, tsconfig, jest config
2. **Test**: Config module loads thresholds correctly
3. **Implement**: Config module
4. **Test**: Storage reads/writes price history
5. **Implement**: Storage module

### Phase 2: Scrapers (One at a Time)
For each scraper:
1. **Test**: Scraper returns PriceResult with mocked HTML
2. **Implement**: HTML parsing logic
3. **Test**: Error handling (timeout, 404, invalid HTML)
4. **Implement**: Retry logic and error cases
5. **Test**: URL construction for different SKUs
6. **Implement**: URL builder

Start with Amazon (simplest), then add others incrementally.

### Phase 3: Orchestration
1. **Test**: Main runs all scrapers in parallel
2. **Implement**: Orchestrator with Promise.all
3. **Test**: Results aggregation and filtering
4. **Implement**: Result processing
5. **Test**: Price history update after check
6. **Implement**: Storage integration

### Phase 4: Notifications
1. **Test**: Email format with price table (mocked SMTP)
2. **Implement**: HTML email template
3. **Test**: Only sends when threshold met
4. **Implement**: Conditional sending logic
5. **Test**: Email with partial data (some scrapers failed)
6. **Implement**: Error-resilient formatting

### Phase 5: GitHub Actions
1. Create workflow YAML
2. Test with manual trigger
3. Add scheduled cron
4. Test auto-commit of price data

## Anti-Bot Measures

- Rotating User-Agent headers
- 10s timeout per request
- 3 retry attempts with exponential backoff
- 2s delay between different sites
- Graceful degradation on failure

## GitHub Secrets Required

Set these in repository settings:

- `ALERT_EMAIL`: Your email address
- `SMTP_USER`: Gmail address
- `SMTP_PASS`: Gmail App Password (not regular password)

## GitHub Actions Workflow

```yaml
name: Price Check
on:
  schedule:
    - cron: '0 9 * * *'  # 9 AM UTC = 10 AM Italy
  workflow_dispatch:  # Manual trigger for testing

jobs:
  check-prices:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test  # Run tests first
      - run: npm start
        env:
          ALERT_EMAIL: ${{ secrets.ALERT_EMAIL }}
          SMTP_USER: ${{ secrets.SMTP_USER }}
          SMTP_PASS: ${{ secrets.SMTP_PASS }}
      - name: Commit price data
        run: |
          git config user.name "Price Bot"
          git config user.email "bot@github.com"
          git add data/price-history.json
          git diff --quiet || git commit -m "Update prices $(date +%Y-%m-%d)"
          git push
```

## Local Testing

```bash
# Run tests
npm test

# Run price check locally (requires .env file)
npm start

# Run specific scraper test
npm test -- scrapers/amazon
```

## Error Handling Philosophy

- **Individual failures don't crash the system**
- Log all errors to console (visible in GitHub Actions)
- Email sent even with partial data
- Price history always saved (even if some scrapers fail)
- Clear error messages for debugging

## Next Steps

1. Initialize Node/TypeScript project
2. Setup Jest for testing
3. Implement base interfaces (TDD)
4. Build Amazon scraper first (simplest)
5. Add remaining scrapers incrementally
6. Integrate email notifications
7. Setup GitHub Actions
8. Configure secrets and test end-to-end

---

## Current Status

**Setup Complete:**
- ✅ GitHub repo created: https://github.com/bigstones84/tablet-checkout
- ✅ Local git configured (user: bigstones84, local credential helper)
- ✅ Documentation committed and pushed
- ✅ Ready to start implementation

**Next Session - Start Here:**
1. Initialize Node.js project: `npm init -y`
2. Install dependencies: `npm install --save-dev typescript @types/node tsx jest @jest/globals @types/jest`
3. Install runtime deps: `npm install axios cheerio nodemailer`
4. Setup tsconfig.json and jest.config.js
5. Begin TDD with Phase 1: Config module tests

**Important Notes:**
- Git credential helper configured for **this repo only** (`.git/credentials`)
- Won't interfere with work account (apietroni51)
- Fine-grained PAT has Contents: Read+Write permission

---

**Created:** 19 December 2025
**Development Approach:** Test-Driven Development
