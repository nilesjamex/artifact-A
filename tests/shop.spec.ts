import { test, expect } from "@playwright/test";

// global.d.ts or at the top of your test file
export {};

declare global {
  interface Window {
    __inpEntries: {
      name: string;
      duration: number;
      startTime: number;
    }[];
  }

  // Extend the existing PerformanceEventTiming if your TS version is older
  interface PerformanceEventTiming extends PerformanceEntry {
    duration: number;
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

// INP test code
test("Interaction to Next Paint full traversal", async ({ page }) => {
  test.setTimeout(30000)

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

  //  await page.addInitScript(() => {
  //   window.__inpEntries = [];
  //   new PerformanceObserver((list) => {
  //     for (const entry of list.getEntries()) {
  //       if (["click", "keydown", "keypress", "mousedown"].includes(entry.name)) {
  //         window.__inpEntries.push({
  //           name: entry.name,
  //           duration: entry.duration,
  //           startTime: entry.startTime
  //         });
  //       }
  //     }
  //   }).observe({ type: "event", buffered: true });
  // });

  await page.goto("http://localhost:5173/shop", {waitUntil: "load"});

  // interaction simulation
  await page.click(`button:has-text("Add to cart") >> nth=0`);
  await page.waitForTimeout(350);
  await page.click(`button:has-text("Add to cart") >> nth=2`);
  await page.waitForTimeout(350);
  await page.click(`button:has-text("Add to cart") >> nth=2`);
  await page.waitForTimeout(350);
  await page.click(".navbar__links>button:has-text('cart')");
  await page.waitForTimeout(400)
  await page.click(`.cart__header__close`);
  await page.waitForTimeout(350)
  await page.click(`button:has-text("Add to cart") >> nth=10`);
  await page.waitForTimeout(350);
  await page.click(`button:has-text("Add to cart") >> nth=20`);
  await page.waitForTimeout(350);
  await page.click(`button:has-text("Add to cart") >> nth=24`);
  await page.waitForTimeout(350);
  await page.click('button:has-text("Furnitures")')
  await page.waitForTimeout(350)
  // filter simulation
  await page.click('button:has-text("All")')
  await page.waitForTimeout(350)
  await page.click('button:has-text("Beauty")')
  await page.waitForTimeout(350)
  await page.click('button:has-text("Fragrances")')
  await page.waitForTimeout(350)
  await page.click('button:has-text("Groceries")')
  await page.waitForTimeout(350)
  await page.click('button:has-text("All")')
  await page.waitForTimeout(350)
  // sorting simulation
   await page.click('[aria-label="sort"]') // adjust selector to match your button
  await page.waitForTimeout(350)
  await page.click('button:has-text("Lowest Price")')
  await page.waitForTimeout(350)
   await page.click('[aria-label="sort"]') // adjust selector to match your button
  await page.waitForTimeout(350)
  await page.click('button:has-text("Highest Price")')
  await page.waitForTimeout(350)
   await page.click('[aria-label="sort"]') // adjust selector to match your button
  await page.waitForTimeout(350)
  await page.click('button:has-text("Oldest")')
  await page.waitForTimeout(350)
   await page.click('[aria-label="sort"]') // adjust selector to match your button
  await page.waitForTimeout(350)
  await page.click('button:has-text("Newest")')
  await page.waitForTimeout(350)
  // add to cart simulation
  await page.click(`button:has-text("Add to cart") >> nth=0`);
  await page.waitForTimeout(350);
  await page.click(`button:has-text("Add to cart") >> nth=2`);
  await page.waitForTimeout(350);
  await page.click(`button:has-text("Add to cart") >> nth=2`);
  await page.waitForTimeout(350);
  // open cart
  await page.click(".navbar__links>button:has-text('cart')");
  await page.waitForTimeout(400)
  // close cart
  await page.click(`.cart__header__close`);
  await page.waitForTimeout(350)
  await page.click(`button:has-text("Add to cart") >> nth=10`);
  await page.waitForTimeout(350);
  await page.click(`button:has-text("Add to cart") >> nth=20`);
  await page.waitForTimeout(350);
  await page.click(`button:has-text("Add to cart") >> nth=10`);
  await page.waitForTimeout(350);
  // search simulation
  await page.click(`input[placeholder="search products..."]`);
  await page.waitForTimeout(350);
  await page.press(`input[placeholder="search products..."]`, "h");
  await page.waitForTimeout(350);
  await page.press(`input[placeholder="search products..."]`, "u");
  await page.waitForTimeout(350);
  await page.press(`input[placeholder="search products..."]`, "a");
  await page.waitForTimeout(350);
  await page.press(`input[placeholder="search products..."]`, "w");
  await page.waitForTimeout(350);
  await page.press(`input[placeholder="search products..."]`, "e");
  await page.waitForTimeout(350);
  await page.press(`input[placeholder="search products..."]`, "i");
  await page.waitForTimeout(350);
  await page.click(`.search__item >> nth=0`);

  const inpReport = await page.evaluate(() => {
    const entries = window.__inpEntries || [];
    if (!entries.length) return null;

    const durations = entries.map(e => e.duration).sort((a, b) => a - b);
    const worst = durations[durations.length - 1];
    const sum = durations.reduce((a, b) => a + b, 0);
    const average = sum / durations.length;
    return { durations, worst, average, count: entries.length };
  });

  console.log('INP Report:', inpReport)
  console.log(`Durations: ${inpReport?.durations.join(", ")}ms`)
  console.log(`Worst interaction: ${inpReport?.worst}ms`)
  console.log(`Average interaction: ${inpReport?.average}ms`)
})

test("Add to Cart INP test", async ({ page }) => {
   test.setTimeout(30000)
  await page.goto("http://localhost:5173/shop", {waitUntil: "load"});

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
  await page.goto("http://localhost:5173/shop", {waitUntil: "load"});

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
  await page.goto("http://localhost:5173/shop", {waitUntil: "load"});

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