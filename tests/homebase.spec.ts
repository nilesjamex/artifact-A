import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// path to save csv file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, "home_performance_metrics.csv")

test.describe("homebase network settings - 30 Benchmark RUNS", () => {
  test.setTimeout(60000)
  test.skip(({ browserName }) => browserName !== 'chromium', 'CDP is only supported in Chromium');

  test.beforeAll(() => {
    const headers = "Test,Navigation Time (ms),FCP (ms),LCP (ms),CLS (ms),TBT (ms)\n";
    fs.writeFileSync(CSV_PATH, headers);
  })

  test.beforeEach(async ({ page }) => {
  const client = await page.context().newCDPSession(page);

  await client.send('Network.enable');
  
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (2 * 1024 * 1024) / 8,
    uploadThroughput: (0.5 * 1024 * 1024) / 8,
    latency: 250,
  });

  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
});

for (let i = 1; i <= 30; i++) {
  test(`Test ${i}: Measure All Web Vitals`, async ({ page }) => {
    await page.goto("http://localhost:4173", { waitUntil: "load"});
    await expect(page).toHaveTitle("StoreFront");

    const metrics = await page.evaluate(async () => {
        
      // navigation time
        const navEntries = performance.getEntriesByType('navigation');
        const navTime = navEntries.length > 0 ? (navEntries[0] as PerformanceNavigationTiming).loadEventEnd : 0;

        // First Contentful Paint
        const paintEntries = performance.getEntriesByName("first-contentful-paint");
        const fcp = paintEntries.length > 0 ? paintEntries[0].startTime : 0;

        // Largest Contentful Paint
        const lcp = await new Promise<number>((resolve) => {
          let lastLCP = 0;
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            lastLCP = entries.at(-1)?.startTime || lastLCP;
          });
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
          
          // Give the page 1 second to settle before finalizing LCP
          setTimeout(() => {
            observer.disconnect();
            resolve(lastLCP);
          }, 1000);
        });

        // Cumulative Layout Shift
        const cls = await new Promise<number>((resolve) => {
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

          // Give the page 1 second to settle before finalizing CLS
          setTimeout(() => {
            observer.disconnect();
            resolve(cumulativeScore);
          }, 1000);
        });

        const tbt = await new Promise<number>((resolve) => {
          let tbtMetric = 0;

          const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // TBT only counts the "excess" over 50ms
            if (entry.duration > 50) {
              tbtMetric += (entry.duration - 50);
            }
          }
        });

        // Start observing
        observer.observe({ type: 'longtask', buffered: true });

        setTimeout(() => {
          observer.disconnect();
          resolve(tbtMetric)
        }, 2000);
        })

        return { navTime, fcp, lcp, cls, tbt };
      });

    console.log(`Run ${i} completed. Nav: ${metrics.navTime.toFixed(2)}ms, LCP: ${metrics.lcp.toFixed(2)}ms`);

    // 6. Append this run's data directly to the CSV
    const csvRow = `${i},${metrics.navTime.toFixed(2)},${metrics.fcp.toFixed(2)},${metrics.lcp.toFixed(2)},${metrics.cls.toFixed(4)},${metrics.tbt.toFixed(2)}\n`;
    fs.appendFileSync(CSV_PATH, csvRow);
  })
}

//   test('get navigation time', async ({ page }) => {

//   await page.goto('http://localhost:4173', { waitUntil: "load" })

//   const navigationTimingJson = await page.evaluate(() =>
//     JSON.stringify(window.performance.getEntriesByType('navigation'))
//   )

//   const navigationTiming = JSON.parse(navigationTimingJson)
//   console.log(navigationTiming)
// })

// test("display First Contentful Paint", async ({ page }) => {

//   await page.goto("http://localhost:4173", { waitUntil: "load" });
//   const title = await page.title();
//   const paintTimingJson = await page.evaluate(() =>
//       JSON.stringify(window.performance.getEntriesByType("paint"))
//   )
//   const paintTiming = JSON.parse(paintTimingJson);
//   console.log("Paint Metrics:", paintTiming);
//   expect(title).toBe("StoreFront")
// })

// test('basic performance largest contentful paint', async ({ page, browserName }) => {
//   // test.setTimeout(30000)
//   test.skip(browserName !== "chromium", "LCP is only supported in Chromium-based browsers")

//   await page.goto('http://localhost:4173', { waitUntil: "load" })
//   const largestContentfulPaint = await page.evaluate(() => {
//     return new Promise<number | undefined>((resolve) => {
//       new PerformanceObserver((l) => {
//         const entries = l.getEntries()
//         // the last entry is the largest contentful paint
//         const largestPaintEntry = entries.at(-1)
//         resolve(largestPaintEntry?.startTime)
//       }).observe({
//         type: 'largest-contentful-paint',
//         buffered: true
//       })
//     })
//   })

//   console.log(parseFloat(String(largestContentfulPaint))) // 1139.39
// })

// test("display Cumulative Layout Shift", async ({ page, browserName }) => {
//   test.skip(browserName !== "chromium", "only testing CLS on chromium-based browsers")
//   await page.goto("http://localhost:4173", { waitUntil: "load" });

//   const clsValue = await page.evaluate(() => {
//     return new Promise<number>((resolve) => {
//       let cumulativeScore = 0;

//       const observer = new PerformanceObserver((list) => {
//         for (const entry of list.getEntries()) {
//           const layoutShift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
//           if (!layoutShift.hadRecentInput) {
//             cumulativeScore += layoutShift.value;
//           }
//         }
//       });

//       observer.observe({ type: "layout-shift", buffered: true });

//       setTimeout(() => {
//         observer.disconnect();
//         resolve(cumulativeScore);
//       }, 2000);
//     });
//   });

//   console.log("CLS Metrics:", clsValue);
//   expect(clsValue).toBeLessThan(0.1);
// });

})