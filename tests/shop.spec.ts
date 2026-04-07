import { test, expect } from "@playwright/test"

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

test("get navigation time", async ({ page }) => {

    await page.goto("http://localhost:5173/shop")

    const title = await page.title();
    expect(title).toBe("Shop")

    const navigationTimingJson = await page.evaluate(() => 
    JSON.stringify(window.performance.getEntriesByType("navigation")))

    const navigationTiming = JSON.parse(navigationTimingJson);
    console.log(navigationTiming)
});

test("display First Contentful Paint", async ({ page }) => {

    await page.goto("http://localhost:5173/shop", {waitUntil: "load"});

    const title = await page.title();
    expect(title).toBe("Shop")

    const paintingTimingJson = await page.evaluate(() => 
    JSON.stringify(window.performance.getEntriesByType("paint")))
    const paintingTiming = JSON.parse(paintingTimingJson);

     console.log("Paint Metrics:", paintingTiming);
})

test("Display Largest Contentful Paint", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "LCP is onlu supported in chromium-based browsers")
        
    await page.goto("http://localhost:5173/shop", {waitUntil: "load"});

    const title = await page.title();
    expect(title).toBe("Shop")

    const largestPaint = await page.evaluate(() => {
        return new Promise<number | undefined>(( resolve ) => {
            new PerformanceObserver((l) => {
                const entries = l.getEntries()

               const largestEntry = entries.at(-1)
                resolve(largestEntry?.startTime)
                resolve(largestEntry?.duration)
            }).observe({
                type: "largest-contentful-paint",
                buffered: true
            })
        })
    })

    const largestContentfulPaint = parseFloat(String(largestPaint))

    console.log(parseFloat(String(largestContentfulPaint)))
})

test("display Cumulative Layout Shift", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "only testing CLS on chromium-based browsers")
  await page.goto("http://localhost:5173/shop", { waitUntil: "load" });

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