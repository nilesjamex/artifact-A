import { test, expect } from "@playwright/test";

// test.beforeEach(async ({ page, browserName }) => {
//   test.skip(browserName !== "chromium", "CDP is only supported in Chromium-based browsers")
//   const client = await page.context().newCDPSession(page);

//   client.send('Network.enable');
  
//   await client.send('Network.emulateNetworkConditions', {
//     offline: false,
//     downloadThroughput: (2 * 1024 * 1024) / 8,
//     uploadThroughput: (0.5 * 1024 * 1024) / 8,
//     latency: 250,
//   });

//   await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
// });

test('get navigation time', async ({ page }) => {

  await page.goto('http://localhost:5173', { waitUntil: "load" })

  const navigationTimingJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType('navigation'))
  )

  const navigationTiming = JSON.parse(navigationTimingJson)
  console.log(navigationTiming)
})

test("display First Contentful Paint", async ({ page }) => {

  await page.goto("http://localhost:5173", { waitUntil: "load" });
  const title = await page.title();
  const paintTimingJson = await page.evaluate(() =>
      JSON.stringify(window.performance.getEntriesByType("paint"))
  )
  const paintTiming = JSON.parse(paintTimingJson);
  console.log("Paint Metrics:", paintTiming);
  expect(title).toBe("StoreFront")
})

test('basic performance largest contentful paint', async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "LCP is only supported in Chromium-based browsers")

  await page.goto('http://localhost:5173', { waitUntil: "load" })
  const largestContentfulPaint = await page.evaluate(() => {
    return new Promise<number | undefined>((resolve) => {
      new PerformanceObserver((l) => {
        const entries = l.getEntries()
        // the last entry is the largest contentful paint
        const largestPaintEntry = entries.at(-1)
        resolve(largestPaintEntry?.startTime)
      }).observe({
        type: 'largest-contentful-paint',
        buffered: true
      })
    })
  })

  console.log(parseFloat(String(largestContentfulPaint))) // 1139.39
})

test("display Cumulative Layout Shift", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "only testing CLS on chromium-based browsers")
  await page.goto("http://localhost:5173", { waitUntil: "load" });

  const clsValue = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      let cumulativeScore = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!layoutShift.hadRecentInput) {
            cumulativeScore += layoutShift.value;
          }
        }
      });

      observer.observe({ type: "layout-shift", buffered: true });

      setTimeout(() => {
        observer.disconnect();
        resolve(cumulativeScore);
      }, 2000);
    });
  });

  console.log("CLS Metrics:", clsValue);
  expect(clsValue).toBeLessThan(0.1);
});

// INP test code
