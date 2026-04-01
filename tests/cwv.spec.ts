import { test, expect } from '@playwright/test';

const R100_PROFILE = {
  downloadThroughput: (2 * 1024 * 1024) / 8, // 2 Mbps
  uploadThroughput: (0.5 * 1024 * 1024) / 8, // 0.5 Mbps
  latency: 250, // RTT in ms
};

test.describe('Comprehensive Socio-Technical Audit', () => {
  test('Audit: Search Interactivity + Core Web Vitals', async ({ browser }) => {
    // 1. Create context with mobile viewport
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });

    const page = await context.newPage();

    // 2. Open a CDP session on the new page
    const client = await page.context().newCDPSession(page);

    // 3. Enforce R100 "Market Failure" Constraints
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: R100_PROFILE.downloadThroughput,
      uploadThroughput: R100_PROFILE.uploadThroughput,
      latency: R100_PROFILE.latency,
    });

    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    // 4. Navigate and Capture Milestone Metrics (FCP, LCP, CLS)
    await page.goto('http://localhost:5173', { waitUntil: 'load' });

    const vitals = await page.evaluate(() => {
      return new Promise<{ fcp?: number; lcp?: number; cls?: number }>((resolve) => {
        const data: { fcp?: number; lcp?: number; cls?: number } = {};

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              data.fcp = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              data.lcp = entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              data.cls = (data.cls ?? 0) + (entry as any).value;
            }
          }
          if (data.fcp && data.lcp) resolve(data);
        });

        observer.observe({ type: 'paint', buffered: true });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        observer.observe({ type: 'layout-shift', buffered: true });

        // Fallback: resolve after 10s if LCP never fires
        setTimeout(() => resolve(data), 10000);
      });
    });

    // 5. Search Bar "Keypress Latency" Test
    // Targets the Hydration Gap during active typing
    const searchBar = page.locator('input[type="search"], .search-input').first();
    await expect(searchBar).toBeVisible({ timeout: 15000 });

    const testQuery = 'Huawei';
    const keystrokeLatencies: number[] = [];

    for (const char of testQuery) {
      const start = Date.now();
      await searchBar.pressSequentially(char, { delay: 50 }); // Simulate human typing speed
      await page.evaluate(() => new Promise(requestAnimationFrame));
      keystrokeLatencies.push(Date.now() - start);
    }

    const avgKeystrokeLatency =
      keystrokeLatencies.reduce((a, b) => a + b, 0) / keystrokeLatencies.length;

    // 6. INP "Rage Click" on Add to Cart
    const cartBtn = page.locator('.storefront__card button').first();
    await expect(cartBtn).toBeVisible({ timeout: 10000 });

    const clickStart = Date.now();
    await cartBtn.click();
    await page.evaluate(() => new Promise(requestAnimationFrame));
    const inpValue = Date.now() - clickStart;

    // 7. Final Data Output for Chapter 6 Analysis
    console.log('--- LABORATORY RESULTS ---');
    console.log(`FCP (Network/Serialization Tax):  ${vitals.fcp?.toFixed(2) ?? 'N/A'}ms`);
    console.log(`LCP (Visual Readiness):           ${vitals.lcp?.toFixed(2) ?? 'N/A'}ms`);
    console.log(`Search Keystroke Avg Latency:     ${avgKeystrokeLatency.toFixed(2)}ms`);
    console.log(`INP (Interaction to Next Paint):  ${inpValue.toFixed(2)}ms`);
    console.log(`CLS (Visual Stability):           ${vitals.cls?.toFixed(7) ?? '0.0000000'}`);
    console.log('--------------------------');

    // 8. Assertions (adjust thresholds to your targets)
    expect(vitals.fcp).toBeDefined();
    expect(vitals.lcp).toBeDefined();
    expect(avgKeystrokeLatency).toBeLessThan(500); // 500ms keystroke budget under throttle
    expect(inpValue).toBeLessThan(500);             // INP "Needs Improvement" ceiling
    expect(vitals.cls ?? 0).toBeLessThan(0.1);      // Google "Good" CLS threshold

    await context.close();
  });
});