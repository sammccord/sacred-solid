import type { Page } from "playwright";
import { advance } from "./browser.ts";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Slice {
  name: string;
  rect: (page: Page) => Promise<Rect>;
  dom: (page: Page, canonicalise: string) => Promise<string>;
}

export interface Scenario {
  name: string;
  route: string;
  settleMs?: number;
  stepMs?: number;
  act?: (page: Page, stepMs?: number) => Promise<void>;
  slices: (page: Page) => Promise<Slice[]>;
}

const documentSlice = (name: string): Slice => ({
  name,
  rect: (page) =>
    page.evaluate(() => ({
      x: 0,
      y: 0,
      width: document.documentElement.clientWidth,
      height: document.documentElement.scrollHeight,
    })),
  dom: (page, canonicalise) => page.evaluate(`(${canonicalise})(document.body)`) as Promise<string>,
});

const viewportSlice = (name: string): Slice => ({
  name,
  rect: (page) =>
    page.evaluate(() => ({
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    })),
  dom: (page, canonicalise) => page.evaluate(`(${canonicalise})(document.body)`) as Promise<string>,
});

const accordionHeaders = `(() => {
  const headers = [...document.querySelectorAll('[role="button"][aria-expanded]')].filter((el) => {
    const glyph = el.querySelector("span")?.textContent ?? "";
    return glyph === "▾" || glyph === "▸";
  });
  return headers.filter((h) => !headers.some((o) => o !== h && o.nextElementSibling?.contains(h)));
})()`;

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function accordionSlices(page: Page): Promise<Slice[]> {
  const titles = (await page.evaluate(
    `${accordionHeaders}.map((h) => h.textContent.replace(/^[▾▸]/, "").trim())`,
  )) as string[];
  const seen = new Map<string, number>();
  const slices: Slice[] = [documentTop];
  titles.forEach((title, index) => {
    const base = slug(title) || "untitled";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const name = `acc-${String(index).padStart(2, "0")}-${count ? `${base}-${count}` : base}`;
    const section = `const h = ${accordionHeaders}[${index}]; const body = h.nextElementSibling && !h.nextElementSibling.matches('[role="button"]') ? h.nextElementSibling : null;`;
    slices.push({
      name,
      rect: (p) =>
        p.evaluate(`(() => { ${section}
          const a = h.getBoundingClientRect(); const b = body ? body.getBoundingClientRect() : a;
          const left = Math.min(a.left, b.left) + scrollX, top = Math.min(a.top, b.top) + scrollY;
          return { x: left, y: top, width: Math.max(a.right, b.right) + scrollX - left, height: Math.max(a.bottom, b.bottom) + scrollY - top };
        })()`) as Promise<Rect>,
      dom: (p, canonicalise) =>
        p.evaluate(`(() => { ${section}
          const c = ${canonicalise};
          return c(h) + (body ? "\\n" + c(body) : "");
        })()`) as Promise<string>,
    });
  });
  return slices;
}

const documentTop: Slice = {
  name: "top",
  rect: (page) =>
    page.evaluate(`(() => {
      const first = ${accordionHeaders}[0];
      return { x: 0, y: 0, width: document.documentElement.clientWidth, height: first.getBoundingClientRect().top + scrollY };
    })()`) as Promise<Rect>,
  dom: (page, canonicalise) =>
    page.evaluate(`(() => {
      const first = ${accordionHeaders}[0];
      const c = ${canonicalise};
      const parts = [];
      for (const el of document.body.querySelectorAll(":scope > * ")) {
        if (el.contains(first)) break;
        parts.push(c(el));
      }
      return parts.join("\\n");
    })()`) as Promise<string>,
};

const clickText =
  (label: string, index = 0) =>
  async (page: Page) => {
    await page.getByText(label, { exact: true }).nth(index).click();
  };

const sequence =
  (...steps: Array<(page: Page) => Promise<void>>) =>
  async (page: Page) => {
    for (const step of steps) {
      await step(page);
      await advance(page, 300);
    }
  };

const viewport = async () => [viewportSlice("viewport")];

const interaction = (
  name: string,
  act: (page: Page, stepMs?: number) => Promise<void>,
  stepMs?: number,
): Scenario => ({
  name,
  route: "/",
  act,
  settleMs: 600,
  stepMs,
  slices: viewport,
});

const press = (key: string) => (page: Page) => page.keyboard.press(key);

const modalLabels = [
  "Render Canvas Snake",
  "Render DOM Snake",
  "Render Canvas Platformer",
  "Render Modal Matrix Modes",
  "Render Modal Checkmate",
  "Render Alert Modal A",
  "Render Alert Modal B",
  "Render Alert Modal C",
  "Render Create Account Modal",
  "Error A",
  "Error B",
  "Error C",
];

const fineStepModals = new Set(["Render DOM Snake", "Render Modal Matrix Modes"]);

const interactions: Scenario[] = [
  interaction(
    "keys-tab-arrows",
    sequence(
      press("Tab"),
      press("Tab"),
      press("ArrowDown"),
      press("ArrowDown"),
      press("ArrowDown"),
    ),
  ),
  interaction("keys-debug-grid", press("Control+g")),
  interaction("menu-ctrl-o", press("Control+o")),
  interaction("menu-ctrl-a", press("Control+a")),
  interaction("menu-ctrl-t", press("Control+t")),
  interaction(
    "menu-fonts-hover",
    sequence(press("Control+o"), async (page) => page.getByRole("menuitem").nth(3).hover()),
  ),
  interaction(
    "menu-fonts-arrow",
    sequence(press("Control+o"), press("ArrowDown"), press("ArrowDown")),
  ),
  interaction("accordion-collapse", clickText("ACTION BAR")),
  ...["TOP LEFT", "TOP RIGHT", "BOTTOM LEFT", "BOTTOM RIGHT"].map((label) =>
    interaction(`dropdown-${slug(label)}`, sequence(clickText(label, 0))),
  ),
  ...modalLabels.map((label) =>
    interaction(
      `modal-${slug(label)}`,
      sequence(clickText(label)),
      fineStepModals.has(label) ? 2 : undefined,
    ),
  ),
  interaction(
    "modal-stack",
    sequence(
      clickText("Render Alert Modal A"),
      clickText("Render Alert Modal B"),
      clickText("Error A"),
    ),
  ),
  interaction("modal-escape", sequence(clickText("Render Alert Modal A"), press("Escape"))),
  interaction("modal-error-enter", sequence(clickText("Error A"), press("Enter"))),
];

export const scenarios: Scenario[] = [
  { name: "kitchen-sink", route: "/", slices: accordionSlices },
  { name: "concept-1", route: "/concept-1/", slices: async () => [documentSlice("page")] },
  { name: "concept-2", route: "/concept-2/", slices: async () => [documentSlice("page")] },
  ...interactions,
];
