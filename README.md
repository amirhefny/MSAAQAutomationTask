# Playwright E2E Test Suite

This repository contains end-to-end automated tests built with Playwright and TypeScript for a course management workflow.

## Project Structure

```
.
├── .github/workflows/end-to-end.yml        # GitHub Actions workflow (runs @end-to-end tests only)
├── allure-results/                 # Allure raw results (generated)
├── CoursePhoto/                    # Static assets for tests
├── data/                           # Test data (e.g., CSV files)
├── locators/                       # Page object locators (JSON)
├── logs/                           # Test run logs
├── node_modules/
├── pages/                          # Page Object Model (POM) classes
├── playwright.config.ts            # Playwright configuration
├── playwright-report/              # HTML report (generated)
├── scripts/                        # Helper scripts (if any)
├── test-config.json                # Test configuration values
├── test-results/                   # Per-run artifacts (generated)
├── tests/                          # Test specs
├── tests-examples/                 # Example specs
└── utilities/                      # Utilities (CSV reader, logging, random data)
```

### Notable Directories

- `pages/`: Page Object classes like `LoginPage.ts`, `HomePage.ts`, `NewCoursePage.ts`, etc.
- `tests/`: Test specs. Example: `TenantHomePageTest.spec.ts` includes the `@end-to-end` scenario.
- `utilities/`: Shared helpers, including CSV reading and logging wrappers.
- `locators/`: Element locators in JSON used by pages.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+

### Install Dependencies

```bash
npm ci
```

### Install Playwright Browsers

```bash
npx playwright install --with-deps
```

## Running Tests Locally

- Run all tests on Chromium:

```bash
npx playwright test --project=chromium
```

- Run by tag, e.g., only `@end-to-end`:

```bash
npx playwright test --project=chromium --grep "@end-to-end"
```

- Open the HTML report:

```bash
npx playwright show-report
```

## GitHub Actions CI

The workflow `.github/workflows/end-to-end-tests.yml` is simplified to run a single pipeline that executes only tests tagged `@end-to-end` on Chromium. Artifacts like traces, videos, screenshots, and logs are uploaded on failure. An HTML report artifact is always uploaded.

Trigger: on every push and pull request to `main`.

## Tagging Strategy

Use tags in your tests to control selection in CI and local runs. Example:

```ts
test('check the published course from Tenant @end-to-end', async ({ page }) => {
  // ...
});
```

Additional tags you can use locally: `@smoke`, `@critical`, `@ui`, etc. CI currently uses only `@end-to-end`.

## Logging & Artifacts

- Logs are written to `logs/`.
- Run artifacts (screenshots, videos, traces) go under `test-results/`.
- Allure raw results are in `allure-results/` (if you integrate Allure report generation).



