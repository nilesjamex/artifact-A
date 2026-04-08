import { test, chromium } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test('Lighthouse performance audit for CLS and LCP', async () => {
  // 1. Launch browser with remote debugging port
  const browser = await chromium.launch({
    args: ['--remote-debugging-port=5173'],
  });
  const page = await browser.newPage();
  await page.goto('https://localhost:5173');

  // 2. Run the audit
  await playAudit({
    page: page,
    port: 9222,
    thresholds: {
      performance: 90, // Overall performance score
    },
    // You can also assert specific metrics directly
    opts: {
      logLevel: 'info',
    },
    reports: {
      formats: {
        html: true, // This generates a 'lighthouse-report.html'
      },
      name: 'vitals-report',
      directory: 'perf-reports',
    },
  });

  await browser.close();
});