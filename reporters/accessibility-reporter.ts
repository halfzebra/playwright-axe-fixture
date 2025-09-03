import type {
  FullResult,
  Reporter,
  TestCase,
  TestResult as PlaywrightTestResult,
} from '@playwright/test/reporter';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import type { AxeResults } from 'axe-core';

class AccessibilityReporter implements Reporter {
  private results: { test: string; violations: number; url: string }[] = [];

  onTestEnd(test: TestCase, result: PlaywrightTestResult) {
    result.attachments.forEach((attachment) => {
      if (
        attachment.name === 'axe-accessibility-report.json' &&
        attachment.body
      ) {
        try {
          const axeResults: AxeResults = JSON.parse(attachment.body.toString());
          this.results.push({
            test: test.title,
            violations: axeResults.violations.length,
            url: axeResults.url,
          });
        } catch (error) {
          console.warn(`Failed to parse accessibility report:`, error);
        }
      }
    });
  }

  onEnd(result: FullResult) {
    if (this.results.length === 0) {
      console.log('No accessibility results found.');
      return;
    }

    const totalViolations = this.results.reduce(
      (sum, r) => sum + r.violations,
      0
    );

    console.log('\n=== Accessibility Report ===');
    console.log(`Total tests: ${this.results.length}`);
    console.log(`Total violations: ${totalViolations}`);

    this.results.forEach((r) => {
      console.log(`- ${r.test}: ${r.violations} violations (${r.url})`);
    });

    // Simple HTML report
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Accessibility Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        .test { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .violations { color: #d32f2f; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Accessibility Test Report</h1>
    <p>Total tests: ${this.results.length}</p>
    <p>Total violations: ${totalViolations}</p>
    
    ${this.results
      .map(
        (r) => `
        <div class="test">
            <h3>${r.test}</h3>
            <p>URL: ${r.url}</p>
            <p class="violations">Violations: ${r.violations}</p>
        </div>
    `
      )
      .join('')}
    
    <p><small>Generated on ${new Date().toLocaleString()}</small></p>
</body>
</html>`;

    const outputDir = 'playwright-report';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    writeFileSync(join(outputDir, 'accessibility.html'), html);
    console.log(`Report saved to ${outputDir}/accessibility.html`);
  }
}

export default AccessibilityReporter;
