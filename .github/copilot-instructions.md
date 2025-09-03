# Playwright Axe Fixture Instructions

## Project Overview

This project creates a Playwright fixture that automatically integrates Axe accessibility testing into standard Playwright workflows. The core concept is extending Playwright's `Page` class to automatically run accessibility scans on DOM-modifying actions like `goto()` and `click()`.

## Architecture

**Core Pattern**: Fixture-based Page Extension

- Located in `tests/example.spec.ts` (will be refactored to standalone fixture)
- Extends Playwright's base test with `test.extend<{ page: AccessibilityPage }>`
- Wraps key Page methods (`goto`, `click`) to trigger automatic axe analysis
- Attaches accessibility reports as JSON artifacts to test results

**Key Components**:

- `AccessibilityPage` interface - extends Page with `runAxeAnalysis()` method
- Automatic Axe scanning on DOM interactions with comprehensive WCAG tag coverage
- Test artifacts - JSON reports attached via `testInfo.attach()`
- Sample app (`sample-app/`) with intentional accessibility violations for testing

## Development Workflows

**Testing Setup**:

```bash
npm run start:server  # Starts sample app on localhost:8080
npm run test          # Runs Playwright tests with --headed flag
```

**Test Environment**:

- Uses `webServer` config to auto-start sample app before tests
- Currently Chromium-only project (Firefox/Safari commented out)
- HTML reporter enabled for test results

## Critical Patterns

**Fixture Extension Pattern**:

```typescript
const test = base.extend<{ page: AccessibilityPage }>({
  page: async ({ page }, use, testInfo) => {
    // Wrap original methods
    const original = {
      click: page.click.bind(page),
      goto: page.goto.bind(page),
    };
    // Add accessibility scanning to wrapped methods
    accessibilityPage.goto = async (...args) => {
      const result = await original.goto(...args);
      await accessibilityPage.runAxeAnalysis();
      return result;
    };
    await use(accessibilityPage);
  },
});
```

**Axe Configuration Standards**:

- Uses comprehensive WCAG tag set (2a, 2aa, 2aaa, 21a, 21aa, 22aa, best-practice)
- Reporter config: `{ reporter: 'no-passes' }` to reduce noise
- Results attached as JSON artifacts for custom reporting pipeline

**Sample App Design**:

- Intentionally includes accessibility violations (poor contrast, missing alt text)
- Button toggles hidden content to test dynamic DOM changes
- Located at `sample-app/index.html`, served via http-server

## Future Architecture Goals

**Per TODO.md**:

- Extract fixture to reusable module supporting all Page methods
- Implement custom HTML reporter for accessibility results
- Add screenshot capture of accessibility violations
- Include context metadata (URL, method, args) with each scan
- Build element highlighter for violations

## Code Quality Standards

- TypeScript strict mode, avoid `any` types
- Preserve original Playwright API signatures and behavior
- Use Prettier config: single quotes, 2-space tabs, trailing commas
- Test after changes with `npm run test`

## Dependencies Strategy

- Core: `@playwright/test`, `@axe-core/playwright`, `axe-core`
- Minimal external dependencies - avoid adding unless critical
- `http-server` for sample app hosting only
