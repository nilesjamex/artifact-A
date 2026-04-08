import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    __inpEntries: {
      name: string;
      duration: number;
      startTime: number;
    }[];
  }
}

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
  // test.setTimeout(30000)
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
test("Interaction to Next Paint full traversal", async ({ page }) => {
  test.setTimeout(30000)
  await page.goto("http://localhost:5173", {waitUntil: "load"});

  await page.evaluate(() => {
    window.__inpEntries = [];
    new PerformanceObserver((l) => {
      for (const entry of l.getEntries()) {
        if (["click", "keydown", "keypress", "mousedown"].includes(entry.name)) {
          window.__inpEntries.push({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          })
        }
      }
    }).observe({type: "event", buffered: true})
  })

  // interaction simulation
  await page.click(`button:has-text("Add to cart") >> nth=0`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=2`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=2`);
  await page.waitForTimeout(150);
  await page.click(".navbar__links>button:has-text('cart')");
  await page.waitForTimeout(400)
  await page.click(`.cart__header__close`);
  await page.waitForTimeout(150)
  await page.click(`button:has-text("Add to cart") >> nth=10`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=20`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=24`);
  await page.waitForTimeout(150);
  await page.click(`input[placeholder="search products..."]`);
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "h");
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "u");
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "a");
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "w");
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "e");
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "i");
  await page.waitForTimeout(150);
  await page.click(`.search__item >> nth=0`);

  const inpReport = await page.evaluate(() => {
    const entries = window.__inpEntries || [];
    if (!entries.length) return null;

    const durations = entries.map(e => e.duration).sort((a, b) => a - b);
    const worst = durations[durations.length - 1];
    const sum = durations.reduce((a, b) => a + b, 0);
    const average = sum / durations.length;
    return {durations, worst, average, count: entries.length};
  });

   console.log('INP Report:', inpReport)
   console.log(`Durations: ${inpReport?.durations.join(", ")}ms`)
  console.log(`Worst interaction: ${inpReport?.worst}ms`)
  console.log(`Average interaction: ${inpReport?.average}ms`)

})

test("Add to Cart INP test", async ({ page }) => {
   test.setTimeout(30000)
  await page.goto("http://localhost:5173", {waitUntil: "load"});

  await page.evaluate(() => {
    window.__inpEntries = [];
    new PerformanceObserver((l) => {
      for (const entry of l.getEntries()) {
        if (["click", "keydown", "keypress", "mousedown"].includes(entry.name)) {
          window.__inpEntries.push({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          })
        }
      }
    }).observe({type: "event", buffered: true})
  })

   // interaction simulation
  await page.click(`button:has-text("Add to cart") >> nth=0`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=2`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=2`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=10`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=20`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=24`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=10`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=20`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=24`);
  await page.waitForTimeout(150);
  await page.click(".navbar__links>button:has-text('cart')");
  await page.waitForTimeout(400)
  await page.click(`.cart__header__close`);
  await page.waitForTimeout(150)
  await page.click(`button:has-text("Add to cart") >> nth=10`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=20`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=24`);
  await page.waitForTimeout(150);

  const inpReport = await page.evaluate(() => {
    const entries = window.__inpEntries || [];
    if (!entries.length) return null;

    const durations = entries.map(e => e.duration).sort((a, b) => a - b);
    const worst = durations[durations.length - 1];
    const sum = durations.reduce((a, b) => a + b, 0);
    const average = sum / durations.length;
    return {durations, worst, average, count: entries.length};
  });

   console.log('INP Report:', inpReport)
   console.log(`Durations: ${inpReport?.durations.join(", ")}ms`)
  console.log(`Worst interaction: ${inpReport?.worst}ms`)
  console.log(`Average interaction: ${inpReport?.average}ms`)

})

test("KeyStroke INP test", async ({ page }) => {
   test.setTimeout(30000)
  await page.goto("http://localhost:5173", {waitUntil: "load"});

  await page.evaluate(() => {
    window.__inpEntries = [];
    new PerformanceObserver((l) => {
      for (const entry of l.getEntries()) {
        if (["click", "keydown", "keypress", "mousedown"].includes(entry.name)) {
          window.__inpEntries.push({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          })
        }
      }
    }).observe({type: "event", buffered: true})
  })

  // interaction simulation
  await page.click(`input[placeholder="search products..."]`);
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "h");
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "u");
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "a");
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "w");
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "e");
  await page.waitForTimeout(150);
  await page.press(`input[placeholder="search products..."]`, "i");
  await page.waitForTimeout(150);
  await page.click(`.search__item >> nth=0`);

  // report
   const inpReport = await page.evaluate(() => {
    const entries = window.__inpEntries || [];
    if (!entries.length) return null;

    const durations = entries.map(e => e.duration).sort((a, b) => a - b);
    const worst = durations[durations.length - 1];
    const sum = durations.reduce((a, b) => a + b, 0);
    const average = sum / durations.length;
    return {durations, worst, average, count: entries.length};
  });

   console.log('INP Report:', inpReport)
   console.log(`Durations: ${inpReport?.durations.join(", ")}ms`)
  console.log(`Worst interaction: ${inpReport?.worst}ms`)
  console.log(`Average interaction: ${inpReport?.average}ms`)
})

test("Cart Interaction INP test", async ({ page }) => {
   test.setTimeout(30000)
  await page.goto("http://localhost:5173", {waitUntil: "load"});

  await page.evaluate(() => {
    window.__inpEntries = [];
    new PerformanceObserver((l) => {
      for (const entry of l.getEntries()) {
        if (["click", "keydown", "keypress", "mousedown"].includes(entry.name)) {
          window.__inpEntries.push({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          })
        }
      }
    }).observe({type: "event", buffered: true})
  })

  // interaction simulation
  await page.click(".navbar__links>button:has-text('cart')");
  await page.waitForTimeout(400)
  await page.click(`.cart__header__close`);
  await page.waitForTimeout(150)
  await page.click(`button:has-text("Add to cart") >> nth=10`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=20`);
  await page.waitForTimeout(150);
  await page.click(`button:has-text("Add to cart") >> nth=24`);
  await page.waitForTimeout(150);
  await page.click(".navbar__links>button:has-text('cart')");
  await page.waitForTimeout(400)
  await page.click(`.ccart__quantity__buttons__plus >> nth=0`);
  await page.waitForTimeout(150)
  await page.click(`.ccart__quantity__buttons__plus >> nth=0`);
  await page.waitForTimeout(150)
  await page.click(`.ccart__quantity__buttons__plus >> nth=0`);
  await page.waitForTimeout(150)
  await page.click(`.ccart__quantity__buttons__plus >> nth=1`);
  await page.waitForTimeout(150)
  await page.click(`.ccart__quantity__buttons__plus >> nth=2`);
  await page.waitForTimeout(150)
  await page.click(`.cart__header__close`);
  await page.waitForTimeout(150)
  await page.click(`button:has-text("Add to cart") >> nth=10`);

  // report
  const inpReport = await page.evaluate(() => {
    const entries = window.__inpEntries || [];
    if (!entries.length) return null;

    const durations = entries.map(e => e.duration).sort((a, b) => a - b);
    const worst = durations[durations.length - 1];
    const sum = durations.reduce((a, b) => a + b, 0);
    const average = sum / durations.length;
    return {durations, worst, average, count: entries.length};
  });

   console.log('INP Report:', inpReport)
   console.log(`Durations: ${inpReport?.durations.join(", ")}ms`)
  console.log(`Worst interaction: ${inpReport?.worst}ms`)
  console.log(`Average interaction: ${inpReport?.average}ms`)

})