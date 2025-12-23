# Tablet Price Monitor

**🚧 SESSION STATUS (23 Dec 2025):**
- ✅ MVP COMPLETE with Samsung Galaxy Tab S10 FE
- ✅ Amazon scraper refactored to use direct ASINs (more reliable!)
- ✅ Product configuration updated to Samsung Tab S10 FE 256GB
- ✅ All architecture refactored: sku → productKey (retailer-agnostic)
- ✅ ASIN-based scraping: fetches exact product page (€379.99 verified)
- ✅ All tests passing (17/17) and updated for new product
- ✅ Config system supports easy product changes
- 📝 Next: Add more retailers, externalize ASIN config
- 📝 TODO: Price history tracking, GitHub Actions automation

Automated price monitoring for Samsung Galaxy Tab S10 FE (256GB) across Italian retailers with email alerts.

## Product Information

See [product-info.md](./product-info.md) for detailed product specs and market analysis (in Italian).

**Current Product:**
- Samsung Galaxy Tab S10 FE (256GB WiFi, 12GB RAM)
- Product Key: `samsung-tab-s10-fe-256gb`
- ASIN: `B0F3885QQK`
- Target Price: €350 (current: €379.99)

**Monitored Sites:**
- Amazon.it (ASIN-based, implemented ✅)
- Trovaprezzi.it (planned)
- Idealo.it (planned)
- Yeppon (planned)
- PcComponentes.it (planned)

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

## Development philosophy

- **TDD approach** - Write tests first for all features
- **Commit early and often**
- **Build one feature at a time**

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

## Implementation Plan

- Throwaway Amazon test - verify site accessibility
- Orchestrator - run scrapers, check thresholds
- Notifications - email alerts
- Amazon scraper - proper implementation
- GitHub Actions automation
- Additional scrapers (Trovaprezzi, Idealo, etc.)
- Price history tracking

## Error Handling Philosophy

- **Individual failures don't crash the system**
- Log all errors to console (visible in GitHub Actions)
- Email sent even with partial data
- Price history always saved (even if some scrapers fail)
- Clear error messages for debugging


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


