import { test, expect } from "@playwright/test";

// test('basic performance emulation', async ({ page }) => {
//   const client = await page.context().newCDPSession(page)
//   await client.send('Network.enable')
//   await client.send('Network.emulateNetworkConditions', {
//     offline: false,
//     downloadThroughput: (4 * 1024 * 1024) / 8,
//     uploadThroughput: (3 * 1024 * 1024) / 8,
//     latency: 20
//   })

//   await page.goto('http://localhost:5173')
// })

test('get navigation time', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const navigationTimingJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType('navigation'))
  )

  const navigationTiming = JSON.parse(navigationTimingJson)
  console.log(navigationTiming)
})

test("display First Contentful Paint", async ({ page }) => {
    await page.goto("http://localhost:5173");
    const title = await page.title();
    const paintTimingJson = await page.evaluate(() =>
        JSON.stringify(window.performance.getEntriesByType("paint"))
    )
    const paintTiming = JSON.parse(paintTimingJson);
    console.log("Paint Metrics:", paintTiming);
    expect(title).toBe("StoreFront")
})

test("display Largest Contentful Paint", async ({page}) => {
    await page.goto("localhost:5173");
    const title = await page.title();
    const lcpTimingJson = await page.evaluate(() =>
        JSON.stringify(window.performance.getEntriesByType("largest-contentful-paint"))
    )
    const lcpTiming = JSON.parse(lcpTimingJson);
    console.log("LCP Metrics:", lcpTiming);
    expect(title).toBe("StoreFront")
})

test('basic performance largest contentful paint', async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "LCP is only supported in Chromium-based browsers")
  await page.goto('http://localhost:5173')
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

test("display Cumulative Layout Shift", async ({page}) => {
    await page.goto("http://localhost:5173");
    const clsValue = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      let cumulativeScore = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!layoutShift.hadRecentInput) {
            cumulativeScore += layoutShift.value;
          }
        }
        resolve(cumulativeScore);
      }).observe({ type: 'layout-shift', buffered: true });
    });
  });

  console.log("CLS Metrics:", clsValue);
})

