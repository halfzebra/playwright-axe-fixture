---
applyTo: 'package.json'
---

# Package Config

## Required Scripts

```json
{
  "scripts": {
    "test": "playwright test --headed",
    "start:server": "http-server ./sample-app"
  }
}
```

## Dependencies

- Keep current setup with `@playwright/test`, `@axe-core/playwright`, `axe-core`
- Don't add more dependencies unless absolutely necessary
