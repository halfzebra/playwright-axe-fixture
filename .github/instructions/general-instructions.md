---
applyTo: '**'
---

# Playwright Axe Fixture - Simple Instructions

## Goal

Create a Playwright fixture that automatically runs accessibility tests with Axe.

## Basic Setup

- `tests/` - Test files and fixtures
- `sample-app/` - Test app (runs on http://127.0.0.1:8080)
- Start with the existing `example.spec.ts` pattern

## Key Rules

- Write TypeScript, avoid `any` types
- Run `npm run test` after changes
- Don't break existing Playwright API patterns
- Auto-run Axe scans on page navigation and interactions

## Dependencies

- `@playwright/test` - Core framework
- `@axe-core/playwright` - Axe integration
- `axe-core` - Accessibility engine
