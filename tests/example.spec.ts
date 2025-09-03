import { test as base, expect, Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { AxeResults } from 'axe-core';

interface AccessibilityPage extends Page {
  runAxeAnalysis(tags?: string[]): Promise<AxeResults>;
}

const test = base.extend<{
  page: AccessibilityPage;
}>({
  page: async ({ page }, use, testInfo) => {
    const accessibilityPage = page as AccessibilityPage;

    accessibilityPage.runAxeAnalysis = async (tags?: string[]) => {
      const results = await new AxeBuilder({ page })
        .withTags([
          'wcag2a',
          'wcag2aa',
          'wcag2aaa',
          'wcag21a',
          'wcag21aa',
          'wcag22aa',
          'best-practice',
        ])
        .options({
          reporter: 'no-passes',
        })
        .analyze();

      await testInfo.attach('axe-accessibility-report.json', {
        body: JSON.stringify(results, null, 2),
        contentType: 'application/json',
      });

      return results;
    };

    const original = {
      click: page.click.bind(page),
      goto: page.goto.bind(page),
    };

    accessibilityPage.goto = async (...args: Parameters<Page['goto']>) => {
      const result = await original.goto(...args);
      await accessibilityPage.runAxeAnalysis();
      return result;
    };

    accessibilityPage.click = async (...args: Parameters<Page['click']>) => {
      const result = await original.click(...args);
      await accessibilityPage.runAxeAnalysis();
      return result;
    };

    await use(accessibilityPage);
  },
});

test('has title', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080');

  await page.click('button');

  await expect(page).toHaveTitle(/Sample App/);
});

export { test, expect };
