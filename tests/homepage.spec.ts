import { test, expect, Page } from "@playwright/test";

interface INPEntry {
  name: string;
  duration: number;
  interactionId: any;
}

interface INPReport {
  durations: number[];
  worst: number;
  average: string;
  count: number;
}

// Extend Window to avoid implicit `any` in page.evaluate()
declare global {
  interface Window {
    __inpEntries?: INPEntry[];
    __inpObserver?: PerformanceObserver;
  }
}

const setupINPObserver = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    window.__inpEntries = [];

    const handleEntries = (entries: PerformanceEntryList) => {
      for (const entry of entries) {
        const eventEntry = entry as PerformanceEventTiming;
        if (eventEntry.interactionId > 0 && window.__inpEntries) {
          window.__inpEntries.push({
            name: entry.name,
            duration: entry.duration,
            interactionId: eventEntry.interactionId
          });
        };
      };
    };

    window.__inpObserver = new PerformanceObserver((l) => handleEntries(l.getEntries()));

    window.__inpObserver.observe({
      type: "event",
      buffered: true,
      durationThreshold: 0,
    } as PerformanceObserverInit);
  })
}

const collectINPReport = async (page: Page): Promise<INPReport | null> => {
  return page.evaluate(() => {
    // flush entries yet to be delivered to the observer
    if (window.__inpObserver) {
      const pending = window.__inpObserver.takeRecords();
      for (const entry of pending) {
        const eventEntry = entry as PerformanceEventTiming;
        if (eventEntry.interactionId > 0 && window.__inpEntries) {
          window.__inpEntries.push({
            name: entry.name,
            duration: entry.duration,
            interactionId: eventEntry.interactionId
          });
        }
      }
    }

    const entries = window.__inpEntries ?? [];
    if (!entries.length) return null;

    const interactionMap = new Map<number, number>();

    for (const entry of entries) {
      const current = interactionMap.get(entry.interactionId as number) ?? 0;
      interactionMap.set(entry.interactionId as number, Math.max(current, entry.duration));
    }

    // result variables
    const duration = [...interactionMap.values()].sort((a,b) => a -b);
    const worst = duration[duration.length - 1];
    const sum = duration.reduce((a, b) => a + b, 0);
    const average = (sum / duration.length).toFixed(2);

    return {
      durations: duration,
      worst: worst,
      average: average,
      count: duration.length
    }
  })
}

// interaction simulation function for adding to cart
const addToCartInteraction = async (page: Page): Promise<void> => {
  const addButtons = page.locator('button:has-text("Add to cart")');
  const totalButtons = await addButtons.count();

  // rage click simulation on first button
  for (let i = 0; i<6; i++) {
    await addButtons.first().click();
    await page.waitForTimeout(104);
  }

  // add 10 more random products to cart
  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * totalButtons);
    const button = addButtons.nth(i);
    await button.scrollIntoViewIfNeeded();
    await button.waitFor({ state: "visible", timeout: 15000});
    await button.click({ timeout: 15000});
    await page.waitForTimeout(250);
  }
  await page.click(".navbar__links>button:has-text('cart')");
  await page.click("div.cart__header__close");

  await page.waitForTimeout(2500);
}

const cartAddition = async (page: Page): Promise<void> => {
  const increaseButtons = page.locator('[aria-label="sort"]');
  const totalIncreaseButtons = await increaseButtons.count();

  for (let i = 0; i < totalIncreaseButtons; i++) {
    const button = increaseButtons.nth(i);
    await button.scrollIntoViewIfNeeded();
    await button.waitFor({ state: "visible", timeout: 15000});
    await button.click({ timeout: 15000});
    await page.waitForTimeout(250);
  }
}

test.describe("Interaction to Next Paint Tests", () => {
  test.setTimeout(220000)
  // test only in chromium browsers bc of cdp support
  test.skip(({ browserName}) => browserName !== 'chromium', 'CDP is only supported in Chromium');

  // setup network throttling and cpu throttling for all tests
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

    test("Add to Cart INP test", async ({ page }) => {
      await page.goto("http://localhost:5173", { waitUntil: "load" });
      await setupINPObserver(page)
      await addToCartInteraction(page);

      const inpResult = await collectINPReport(page);

       console.log("--- INP Report ---");
        if (!inpResult) {
          console.warn("No interactions captured — INP report unavailable.");
          return;
        }

        console.log(`Total Unique Interactions : ${inpResult.count}`);
        console.log(`Durations                 : ${inpResult.durations.join(", ")}ms`);
        console.log(`Worst interaction (INP)   : ${inpResult.worst}ms`);
        console.log(`Average interaction       : ${inpResult.average}ms`);
    })

    test("KeyStroke INP test", async ({ page }) => {
      await page.goto("http://localhost:5173", { waitUntil: "load" });
      await setupINPObserver(page)

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
      // await page.click(`.search__item >> nth=0`);

      const inpResult = await collectINPReport(page);

      console.log("--- INP Report ---");
      if (!inpResult) {
        console.warn("No interactions captured — INP report unavailable.");
        return;
      }

      console.log(`Total Unique Interactions : ${inpResult.count}`);
      console.log(`Durations                 : ${inpResult.durations.join(", ")}ms`);
      console.log(`Worst interaction (INP)   : ${inpResult.worst}ms`);
      console.log(`Average interaction       : ${inpResult.average}ms`);
    })

    test("Cart Interaction INP test", async ({ page }) => {
      await page.goto("http://localhost:5173", { waitUntil: "load" });
      await setupINPObserver(page)

      await page.click(".navbar__links>button:has-text('cart')");
      await page.waitForTimeout(400)
      await page.click("div.cart__header__close");
      await page.waitForTimeout(150)
      await page.click(`button:has-text("Add to cart") >> nth=10`);
      await page.waitForTimeout(150);
      await page.click(`button:has-text("Add to cart") >> nth=20`);
      await page.waitForTimeout(150);
      await page.click(`button:has-text("Add to cart") >> nth=24`);
      await page.waitForTimeout(150);
      await page.click(".navbar__links>button:has-text('cart')");
      await page.waitForTimeout(400)
      await cartAddition(page);
      await page.waitForTimeout(150)
      await page.click("div.cart__header__close");
      await page.waitForTimeout(150)
      // await page.click(`button:has-text("Add to cart") >> nth=10`);

      const inpResult = await collectINPReport(page);

      console.log("--- INP Report ---");
      if (!inpResult) {
        console.warn("No interactions captured — INP report unavailable.");
        return;
      }

      console.log(`Total Unique Interactions : ${inpResult.count}`);
      console.log(`Durations                 : ${inpResult.durations.join(", ")}ms`);
      console.log(`Worst interaction (INP)   : ${inpResult.worst}ms`);
      console.log(`Average interaction       : ${inpResult.average}ms`);
    })

    test("Full INP Traversal Test", async ({ page }) => {
      await page.goto("http://localhost:5173", { waitUntil: "load" });
      await setupINPObserver(page)

      // interaction simulation
      await addToCartInteraction(page);
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
      await page.click(".navbar__links>button:has-text('cart')");
      await page.waitForTimeout(400)
      await cartAddition(page);


      const inpResult = await collectINPReport(page);

      console.log("--- INP Report ---");
      if (!inpResult) {
        console.warn("No interactions captured — INP report unavailable.");
        return;
      }

      console.log(`Total Unique Interactions : ${inpResult.count}`);
      console.log(`Durations                 : ${inpResult.durations.join(", ")}ms`);
      console.log(`Worst interaction (INP)   : ${inpResult.worst}ms`);
      console.log(`Average interaction       : ${inpResult.average}ms`);
    })
})