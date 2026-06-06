# Catawiki Test Automation

A Playwright/TypeScript end-to-end test suite built as a technical assignment, covering critical user journeys on [catawiki.com](https://www.catawiki.com).

## Project Overview

Catawiki is a Netherlands-based online auction marketplace for special objects — art, jewellery, watches, and collectibles — with over 10 million unique visitors per month. This project automates key buyer journeys including authentication, lot discovery, and favourites management.

## Research & Planning

Before writing any code, I spent time manually exploring the site to understand its architecture and identify the most business-critical flows. I mapped out user journeys by priority:

- **Authentication** — sign up, sign in, sign out
- **Discovery** — search, category browsing, lot detail page
- **Favourites** — add, remove, verify state

Test scenarios were selected to cover critical user journeys without interfering
with real platform data. Destructive or transactional flows — such as placing a
bid, setting a maximum bid, or adding payment details — were intentionally
excluded from automation as they would impact live auction data. These flows
would be covered in a dedicated test environment with mocked payment providers
and test auction data.

I also inspected the DOM in DevTools to identify the most stable locator strategy, and analysed network requests to understand the API layer — both informed test design and the pre-test cleanup approach.

## Technical Decisions

### Page Object Model

Each page has a dedicated class encapsulating locators and actions. This keeps test files focused on behaviour rather than implementation details, and makes locator updates a single-file change.

### Test Data Structure

Test data lives in `test-data/user-data.ts` with a TypeScript interface for compile-time validation. Emails for new account sign-up are generated dynamically using `Date.now()` to avoid conflicts between runs. Secrets (passwords) are stored in `.env` only — never committed to the repo.

### Locator Strategy

Locators are chosen in this priority order:

1. `getByRole()` — Playwright's recommended approach, accessible and resilient to styling changes
2. `getByTestId()` — used when role-based selectors are not specific enough
3. CSS classes — last resort, only when no better option exists

### API Helpers

Pre-test cleanup (removing saved lots) is handled via direct API calls rather than UI interactions. This logic lives in `utils/apiHelpers.ts`, separate from page objects, keeping responsibilities clean and making helpers reusable across test files.

## Project Structure

```
├── pages/                        # Page Object Model classes
│   ├── BasePage.ts
│   ├── HeaderPage.ts
│   ├── HomePage.ts
│   ├── SignInPage.ts
│   ├── SignUpPage.ts
│   ├── SearchResultsPage.ts
│   ├── LotPage.ts
│   └── FavoritePage.ts
├── tests/                        # Test specs
│   ├── signUp.spec.ts
│   ├── signInSignOut.spec.ts
│   ├── addRemoveFromFavorite.spec.ts
│   └── logLotData.spec.ts
├── utils/
│   ├── apiHelpers.ts             # API-based pre-test cleanup
│   └── env.ts                    # Environment variable loader
├── test-data/
│   └── user-data.ts              # Test data types and values
├── scripts/
│   └── saveStorageState.ts       # Manual auth state capture
├── .auth/                        # Gitignored; holds saved session state
├── playwright.config.ts
└── .github/workflows/
    └── playwright.yml            # CI pipeline
```

## Challenges & Solutions

### Cookie Banner Interference

Catawiki's cookie consent banner appears on every fresh page load and overlaps interactive elements, causing clicks to fail. Rather than dismissing it in each test, I inspected the browser cookies set after accepting the banner and saved them to `.auth/cookies.json`. This file is injected globally via `storageState` in `playwright.config.ts`, so the banner never appears in any test run.

### Bot Protection Blocking Automated Login

Catawiki's bot protection blocks headless browser login attempts. Rather than fighting it, I used Playwright's built-in `page.pause()` to open an interactive browser session, log in manually, and save the authenticated state to `.auth/user.json` via `storageState`. This file is gitignored and injected in CI via GitHub Secrets.

### Authenticated API Calls in beforeAll

The default Playwright `request` fixture doesn't inherit browser cookies, so API cleanup calls were returning 403. The fix was to create a browser context with `storageState` explicitly and use its request context — ensuring the cleanup calls are properly authenticated.

### Sign Up Test

The sign up test is skipped to avoid creating real accounts on the live platform
on every test run. The test covers the full registration flow but is marked
`test.skip` intentionally — it would be enabled in a dedicated test environment
with a disposable account strategy or mocked registration endpoint.

## AI Assistance

This project was built with the assistance of Claude (Anthropic) as a pair
programming tool. Specific areas where AI was used:

- Generated the utility script for manually saving authenticated state to `.auth/user.json` and cookie consent to `.auth/cookies.json` via Playwright Inspector pause
- Final code review
- README drafting

All technical decisions, implementation, and debugging were done by me; AI was
used as a sounding board rather than a code generator.

## Setup

**Prerequisites:** Node.js 18+, npm

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

**Generate auth state manually:**

```bash
npx ts-node scripts/saveStorageState.ts
```

A browser window will open. Log in manually, then press **Resume** in the Playwright Inspector. The session will be saved to `.auth/user.json`.

**Environment variables:**

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

**Run tests:**

```bash
npx playwright test
```

**View report:**

```bash
npx playwright show-report
```

## CI/CD

The GitHub Actions pipeline runs on every push and pull request to `main`. Quality gates run in this order:

1. **Lint** — ESLint checks for code quality issues
2. **Format check** — Prettier ensures consistent formatting
3. **Type check** — `tsc --noEmit` catches TypeScript errors
4. **Tests** — Playwright runs with 2 retries to catch flakiness

**Caching** is configured for both npm packages and Playwright browsers to reduce pipeline execution time.

**Artifacts** — HTML report and raw test results (including failure videos) are uploaded after every run and retained for 30 days, accessible from the GitHub Actions tab.

**Headed mode** — tests run headed locally to bypass Catawiki's bot protection, which blocks headless browsers. In CI, headless mode is enabled automatically via the `process.env.CI` flag. Pre-saved session state injected via GitHub Secrets ensures authenticated tests still pass in the pipeline.

**CI authentication** — store the contents of `.auth/user.json` as an `AUTH_USER_JSON` GitHub Secret. The pipeline writes it to disk before tests run.

## Local Development

**Run quality checks before pushing:**

```bash
npm run check
```

Husky is configured to run the same checks automatically before every commit — it activates on `npm ci`, no extra setup needed.
