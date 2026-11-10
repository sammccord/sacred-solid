import { chromium, type Browser, type Page } from "playwright";

export const VIEWPORT = { width: 1280, height: 900 };
const START = new Date("2026-01-01T00:00:00Z");

const seedRandom = `(() => {
  let s = 0x2f6e2b1;
  window.__reseed = () => { s = 0x2f6e2b1; };
  Math.random = () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();`;

export async function launch(): Promise<Browser> {
  return chromium.launch();
}

export async function openPage(browser: Browser, url: string): Promise<Page> {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.route(/api\.internet\.dev\/analytics/, (route) => route.abort());
  await page.addInitScript(seedRandom);
  await page.clock.install({ time: START });
  await page.clock.pauseAt(new Date(START.getTime() + 1));
  await page.goto(url, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await waitForHydration(page);
  await page.evaluate(() => (window as unknown as { __reseed: () => void }).__reseed());
  await advance(page, 1000);
  await page.waitForTimeout(150);
  return page;
}

async function waitForHydration(page: Page): Promise<void> {
  const isReactHost = await page.evaluate(() => "__next_f" in self);
  if (!isReactHost) return;
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const hydrated = await page.evaluate(() =>
      [...document.querySelectorAll('[role="button"]')].some((el) =>
        Object.keys(el).some((key) => key.startsWith("__reactFiber")),
      ),
    );
    if (hydrated) return;
    await page.waitForTimeout(50);
  }
  throw new Error("React never hydrated");
}

//NOTE: React commits and runs effects in a later task. One long runFor would let Solid chain timer reschedules inside the jump while React waits for the jump to finish. Small steps with a real yield keep both on the same timeline.
export async function advance(page: Page, ms: number, step = 16): Promise<void> {
  for (let elapsed = 0; elapsed < ms; elapsed += step) {
    await page.clock.runFor(Math.min(step, ms - elapsed));
    await page.waitForTimeout(4);
  }
}
