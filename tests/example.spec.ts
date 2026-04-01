import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


// test('basic performance largest contentful paint', async ({ page }) => {
//   await page.goto('http://localhost:5173') // ✅ added http://

//   const largestContentfulPaint = await page.evaluate(() => {
//     return new Promise<number | undefined>((resolve) => {
//       new PerformanceObserver((l) => {
//         const entries = l.getEntries()
//         const largestPaintEntry = entries.at(-1)
//         resolve(largestPaintEntry?.startTime)
//       }).observe({
//         type: 'largest-contentful-paint',
//         buffered: true
//       })
//     })
//   })

//   console.log(parseFloat(String(largestContentfulPaint)))
// })

// test("display Cumulative Layout Shift", async ({ page }) => {
//   await page.goto("http://localhost:5173") // ✅ added http://

//   const clsValue = await page.evaluate(() => { // ✅ use PerformanceObserver
//     return new Promise<number>((resolve) => {
//       let cumulativeScore = 0;
//       new PerformanceObserver((list) => {
//         for (const entry of list.getEntries()) {
//           const layoutShift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
//           if (!layoutShift.hadRecentInput) {
//             cumulativeScore += layoutShift.value;
//           }
//         }
//         resolve(cumulativeScore);
//       }).observe({ type: 'layout-shift', buffered: true });
//     });
//   });

//   console.log("CLS Metrics:", clsValue);
// });

