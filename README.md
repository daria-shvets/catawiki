# Catawiki Test Automation

A Playwright/TypeScript end-to-end test suite built as a technical assignment, covering critical user journeys on [catawiki.com](https://www.catawiki.com).

## Project Overview

Catawiki is a Netherlands-based online auction marketplace for special objects — art, jewellery, watches, and collectibles — with over 10 million unique visitors per month. This project automates key buyer journeys including authentication, lot discovery, and favourites management.

## Research & Planning

Before writing any code, I spent time manually exploring the site to understand its architecture and identify the most business-critical flows.

I also inspected the DOM in DevTools to identify the most stable locator strategy, and analysed network requests to understand the API layer — both informed test design and the pre-test cleanup approach.

The following scenarios are covered:

**Authentication** — sign in, sign out, and sign up (skipped in CI — see Challenges)

**Homepage** — page loads correctly, category navigation is visible, search bar is visible

**Search** — search returns results for a known keyword, clicking a lot card opens the lot detail page

**Lot Detail Page** — lot title, current bid, and images are visible, favourite button is visible and enabled

**Favourites** — add lot to favourites, remove lot from favourites

Test scenarios were selected to cover critical user journeys without interfering with real platform data. Destructive or transactional flows — such as placing a bid, setting a maximum bid, or adding payment details — were intentionally excluded as they would impact live auction data. These flows would be covered in a dedicated test environment with mocked payment providers and test auction data.

> **Note for reviewers:** The required assignment scenario (search for "train", click the second lot, log lot name, favourites count and current bid) is covered by `tests/logLotData.spec.ts`.

## Technical Decisions

### Page Object Model

Each page has a dedicated class encapsulating locators and actions. This keeps test files focused on behaviour rather than implementation details, and makes locator updates a single-file change.

### Test Data Structure

Test data lives in `test-data/userData.ts` and `test-data/testData.ts` with a TypeScript interface for compile-time validation. Emails for new account sign-up are generated dynamically using `Date.now()` to avoid conflicts between runs. Secrets (passwords) are stored in `.env` only — never committed to the repo.

### Locator Strategy

Locators are chosen in this priority order:

1. `getByRole()` — Playwright's recommended approach, accessible and resilient to styling changes
2. `getByTestId()` — used when role-based selectors are not specific enough
3. `data-sentry-component` attributes — Catawiki uses Sentry for error monitoring, which adds stable component-level attributes to the DOM. These map directly to React component names and are resilient to CSS refactoring
4. CSS classes — last resort, only when no better option exists

Where multiple elements share the same locator (e.g. sticky bidding panels duplicating the main bid section), locators are scoped to a stable parent container to avoid strict mode violations.

### API Helpers

Pre-test cleanup (removing saved lots) is handled via direct API calls rather than UI interactions. This logic lives in `utils/apiHelpers.ts`, separate from page objects, keeping responsibilities clean and making helpers reusable across test files.

## Project Structure

```
├── pages/                        # Page Object Model classes
│   ├── BasePage.ts
│   ├── FavouritePage.ts
│   ├── HeaderPage.ts
│   ├── HomePage.ts
│   ├── LotPage.ts
│   ├── SearchResultsPage.ts
│   ├── SignInPage.ts
│   └── SignUpPage.ts
├── tests/                        # Test specs
│   ├── addRemoveFromFavourite.spec.ts
│   ├── loadHomePage.spec.ts
│   ├── logLotData.spec.ts
│   ├── signInSignOut.spec.ts
│   └── signUp.spec.ts
├── utils/
│   ├── apiHelpers.ts             # API-based pre-test cleanup
│   └── env.ts                    # Environment variable loader
├── test-data/
│   └── userData.ts
│   └── testData.ts               # Test data types and values
├── scripts/
│   └── saveStorageState.ts       # Manual auth state capture
├── .auth/                        # Gitignored; holds saved session state
├── .husky/                       # Pre-commit hooks
├── .env.example                  # Environment variable template
├── eslint.config.mjs             # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── playwright.config.ts
├── tsconfig.json
└── .github/workflows/
    └── playwright.yml            # CI pipeline
```

## Challenges & Solutions

### Cookie Banner Interference

Catawiki's cookie consent banner appears on every fresh page load and overlaps interactive elements, causing clicks to fail. Rather than dismissing it in each test, I inspected the browser cookies set after accepting the banner and saved them to `.auth/cookies.json`. This file is injected globally via `storageState` in `playwright.config.ts`, so the banner never appears in any test run.

### Headless Browser Detection

Playwright's default bundled Chromium is detectable by bot protection systems — its browser fingerprint differs from real Chrome, causing pages to be blocked entirely. Switching to real Google Chrome via `channel: "chrome"` in `playwright.config.ts` resolved this.

### Authenticated API Calls in beforeAll

The default Playwright `request` fixture doesn't inherit browser cookies, so API cleanup calls were returning 403. The fix was to create a browser context with `storageState` explicitly and use its request context.

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

All technical decisions, implementation, and debugging were done by me; AI was a tool for discussion and review, not a replacement for engineering judgment.

## Setup

**Prerequisites:** Node.js 18+, npm

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install chrome --with-deps
```

**Generating auth state:**

Two separate files are required in `.auth/`:

- `cookies.json` — cookie consent only (no login required)
- `user.json` — full authenticated session

**Step 1: Generate `cookies.json`**

```bash
npx ts-node scripts/saveStorageState.ts .auth/cookies.json
```

A browser window will open. Accept the cookie banner only — do not log in. Press **Resume** in the Playwright Inspector.

**Step 2: Generate `user.json`**

```bash
npx ts-node scripts/saveStorageState.ts .auth/user.json
```

A browser window will open. Log in with your test account credentials, then press **Resume** in the Playwright Inspector.

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

**CI authentication** — store the contents of `.auth/cookies.json` as `AUTH_COOKIES_JSON` and `.auth/user.json` as `AUTH_USER_JSON` GitHub Secrets. The pipeline writes both files to disk before tests run. Request secret values via email — they are not committed to the repository.

**Session management:**

The authenticated session in `.auth/user.json` contains a short-lived `oauth_token` (expires in ~2 hours) and a longer-lived `refresh_token` (expires in ~30 days).

If tests fail with authentication errors (403, user not logged in), regenerate the session:

```bash
npx ts-node scripts/saveStorageState.ts .auth/user.json
```

Then update the `AUTH_USER_JSON` GitHub Secret with the new file contents.

## Local Development

**Run quality checks before pushing:**

```bash
npm run check
```

Husky is configured to run the same checks automatically before every commit — it activates on `npm ci`, no extra setup needed.
