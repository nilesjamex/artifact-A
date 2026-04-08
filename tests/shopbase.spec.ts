import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path"
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, "shop_performance_metrics.csv");

test.describe("shop web vitals - 30 Benchmark tests", () => {
  test.setTimeout(60000);
   test.skip(({ browserName }) => browserName !== 'chromium', 'CDP is only supported in Chromium');

  //  creating csv file and writing headers before starting tests
  test.beforeAll(() => {
    const headers = "Test,Navigation Time (ms),FCP (ms),LCP (ms),CLS\n";
    fs.writeFileSync(CSV_PATH, headers)
  })

  test.beforeEach(async ({ page }) => {
    const client = await page.context().newCDPSession(page);

    await client.send("Network.enable");

    await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (2 * 1024 * 1024) / 8,
    uploadThroughput: (0.5 * 1024 * 1024) / 8,
    latency: 250,
  });

  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  })

  for (let i = 1; i <= 30; i++) {
  test(`Test ${i}: Measure All Web Vitals`, async ({ page }) => {
    await page.goto("http://localhost:5173", { waitUntil: "load"});
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

    return { navTime, fcp, lcp, cls };
  });

    console.log(`Run ${i} completed. Nav: ${metrics.navTime.toFixed(2)}ms, LCP: ${metrics.lcp.toFixed(2)}ms`);

    // 6. Append this run's data directly to the CSV
    const csvRow = `${i},${metrics.navTime.toFixed(2)},${metrics.fcp.toFixed(2)},${metrics.lcp.toFixed(2)},${metrics.cls.toFixed(4)}\n`;
    fs.appendFileSync(CSV_PATH, csvRow);
    })
  }
})

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

// test("get navigation time", async ({ page }) => {

//     await page.goto("http://localhost:5173/shop")

//     const title = await page.title();
//     expect(title).toBe("Shop")

//     const navigationTimingJson = await page.evaluate(() => 
//     JSON.stringify(window.performance.getEntriesByType("navigation")))

//     const navigationTiming = JSON.parse(navigationTimingJson);
//     console.log(navigationTiming)
// });

// test("display First Contentful Paint", async ({ page }) => {

//     await page.goto("http://localhost:5173/shop", {waitUntil: "load"});

//     const title = await page.title();
//     expect(title).toBe("Shop")

//     const paintingTimingJson = await page.evaluate(() => 
//     JSON.stringify(window.performance.getEntriesByType("paint")))
//     const paintingTiming = JSON.parse(paintingTimingJson);

//      console.log("Paint Metrics:", paintingTiming);
// })

// test("Display Largest Contentful Paint", async ({ page, browserName }) => {
//     test.skip(browserName !== "chromium", "LCP is onlu supported in chromium-based browsers")
        
//     await page.goto("http://localhost:5173/shop", {waitUntil: "load"});

//     const title = await page.title();
//     expect(title).toBe("Shop")

//     const largestPaint = await page.evaluate(() => {
//         return new Promise<number | undefined>(( resolve ) => {
//             new PerformanceObserver((l) => {
//                 const entries = l.getEntries()

//                const largestEntry = entries.at(-1)
//                 resolve(largestEntry?.startTime)
//                 resolve(largestEntry?.duration)
//             }).observe({
//                 type: "largest-contentful-paint",
//                 buffered: true
//             })
//         })
//     })

//     const largestContentfulPaint = parseFloat(String(largestPaint))

//     console.log(parseFloat(String(largestContentfulPaint)))
// })

// test("display Cumulative Layout Shift", async ({ page, browserName }) => {
//   test.skip(browserName !== "chromium", "only testing CLS on chromium-based browsers")
//   await page.goto("http://localhost:5173/shop", { waitUntil: "load" });

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