import { chromium } from "playwright";

const BASE = process.env.STRIP_URL ?? "http://localhost:4173/aug/strip/";

interface Probe {
  selector: string;
  line?: true;
  border?: true;
  fill?: true;
  elevation?: true;
}

const PROBES: Record<string, Probe[]> = {
  Card: [
    { selector: ":scope > section", line: true },
    { selector: ":scope > header > div:first-child", line: true },
    { selector: ":scope > header > div:last-child", line: true },
  ],
  CardDouble: [
    { selector: ":scope > section", line: true },
    { selector: ":scope > header > div:first-child", line: true },
    { selector: ":scope > header > div:last-child", line: true },
  ],
  Dialog: [{ selector: ":scope", fill: true, elevation: true }],
  Input: [{ selector: ":scope > div > div:first-child", line: true, fill: true }],
  Panel: [
    { selector: ":scope", border: true },
    { selector: ":scope", elevation: true },
    { selector: ":scope > div", fill: true },
  ],
  Window: [{ selector: ":scope", fill: true, elevation: true }],
  "Button secondary": [{ selector: ":scope", line: true, fill: true }],
  Popover: [{ selector: ":scope", fill: true, elevation: true }],
  Tooltip: [{ selector: ":scope", fill: true, elevation: true }],
};

interface Measure {
  borders: number;
  shadow: string;
  alpha: number;
}

interface Report {
  caseName: string;
  variant: string;
  probe: string;
  measure: Measure;
}

const failures: string[] = [];
let checks = 0;

function expect(ok: boolean, message: string) {
  checks++;
  if (!ok) failures.push(message);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto(BASE, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: "*, *::before, *::after { animation: none !important; transition: none !important; }",
  });

  const reports: Report[] = await page.evaluate((probes) => {
    const measure = (el: Element): Measure => {
      const style = getComputedStyle(el);
      const borders = ["top", "right", "bottom", "left"].reduce(
        (sum, side) => sum + Number.parseFloat(style.getPropertyValue(`border-${side}-width`)),
        0,
      );
      const color = style.backgroundColor;
      const match = color.match(/rgba?\(([^)]+)\)/)?.[1]?.split(/[,/]\s*/);
      const alpha = match && match.length > 3 ? Number.parseFloat(match[3]!) : 1;
      return { borders, shadow: style.boxShadow, alpha };
    };
    const out: Report[] = [];
    for (const group of document.querySelectorAll<HTMLElement>("[data-case]")) {
      const caseName = group.dataset.case!;
      for (const holder of group.querySelectorAll<HTMLElement>("[data-variant]")) {
        const host = holder.firstElementChild!;
        const list = probes[caseName] ?? [
          { selector: ":scope" },
          { selector: ":scope article" },
          { selector: ":scope section" },
        ];
        for (const probe of list) {
          const target = probe.selector === ":scope" ? host : host.querySelector(probe.selector);
          if (target)
            out.push({
              caseName,
              variant: holder.dataset.variant!,
              probe: probe.selector,
              measure: measure(target),
            });
        }
      }
    }
    return out;
  }, PROBES);

  const find = (caseName: string, variant: string, probe: string) =>
    reports.find((r) => r.caseName === caseName && r.variant === variant && r.probe === probe)
      ?.measure;

  for (const [caseName, probes] of Object.entries(PROBES)) {
    for (const probe of probes) {
      const tag = (variant: string) => `${caseName} ${probe.selector} [${variant}]`;
      const plain = find(caseName, "plain", probe.selector);
      const both = find(caseName, "both", probe.selector);
      const border = find(caseName, "border", probe.selector);
      const inlay = find(caseName, "inlay", probe.selector);
      const clip = find(caseName, "clip", probe.selector);
      if (!plain || !both || !border || !inlay || !clip) {
        expect(false, `${caseName} ${probe.selector} missing from the page`);
        continue;
      }
      const hasLine = (m: Measure) => m.borders > 0 || m.shadow !== "none";
      const hasElevation = (m: Measure) => m.shadow !== "none";
      if (probe.line) {
        expect(hasLine(plain), `${tag("plain")} has a native line`);
        expect(both.borders === 0 && both.shadow === "none", `${tag("both")} line width is 0`);
        expect(
          border.borders === 0 && border.shadow === "none",
          `${tag("border")} line width is 0`,
        );
        expect(
          inlay.borders === plain.borders && inlay.shadow === plain.shadow,
          `${tag("inlay")} keeps the native line`,
        );
        expect(
          clip.borders === plain.borders && clip.shadow === plain.shadow,
          `${tag("clip")} keeps the native line`,
        );
      }
      if (probe.border) {
        expect(plain.borders > 0, `${tag("plain")} has a native border`);
        expect(both.borders === 0, `${tag("both")} border width is 0`);
        expect(border.borders === 0, `${tag("border")} border width is 0`);
        expect(inlay.borders === plain.borders, `${tag("inlay")} keeps the native border`);
        expect(clip.borders === plain.borders, `${tag("clip")} keeps the native border`);
      }
      if (probe.fill) {
        expect(plain.alpha > 0, `${tag("plain")} has a native fill`);
        expect(both.alpha === 0, `${tag("both")} fill is gone`);
        expect(inlay.alpha === 0, `${tag("inlay")} fill is gone`);
        expect(border.alpha === plain.alpha, `${tag("border")} keeps the native fill`);
        expect(clip.alpha === plain.alpha, `${tag("clip")} keeps the native fill`);
      }
      if (probe.elevation) {
        expect(hasElevation(plain), `${tag("plain")} has an elevation shadow`);
        for (const [variant, measure] of [
          ["both", both],
          ["border", border],
          ["inlay", inlay],
          ["clip", clip],
        ] as const) {
          expect(measure.shadow === "none", `${tag(variant)} elevation shadow is gone`);
        }
      }
    }
  }

  expect(reports.length > 0, "the page rendered");

  const NESTED: [string, string, string][] = [
    ["Card in Card", "section > article", "Card"],
    ["Window in Window", "section", "Window"],
    ["CardDouble in Card", "section > article", "CardDouble"],
  ];
  const nested = await page.evaluate(
    ([specs, probes]) => {
      const pick = (root: Element, selector: string) =>
        selector === ":scope" ? root : root.querySelector(selector);
      const read = (el: Element | null) => {
        if (!el) return null;
        const style = getComputedStyle(el);
        return JSON.stringify([
          ["top", "right", "bottom", "left"].map((side) =>
            style.getPropertyValue(`border-${side}-width`),
          ),
          style.boxShadow,
          style.backgroundColor,
        ]);
      };
      const hostOf = (caseName: string, variant: string) =>
        document.querySelector(`[data-case="${caseName}"] [data-variant="${variant}"]`)!
          .firstElementChild!;
      return specs.flatMap(([caseName, innerSelector, reference]) => {
        const inner = pick(hostOf(caseName, "both"), innerSelector)!;
        const plain = hostOf(reference, "plain");
        return (probes[reference] ?? []).map((probe) => ({
          name: `${caseName} ${probe.selector}`,
          got: read(pick(inner, probe.selector)),
          want: read(pick(plain, probe.selector)),
        }));
      });
    },
    [NESTED, PROBES] as const,
  );
  expect(nested.length > 0, "nested probes ran");
  for (const item of nested) {
    expect(
      item.got !== null && item.got === item.want,
      `nested plain ${item.name} keeps its own chrome`,
    );
  }

  const nestedButton = await page.evaluate(() => {
    const button = document.querySelector<HTMLElement>(
      `[data-case="Card in Card"] [data-variant="both"] button`,
    );
    const plain = document.querySelector<HTMLElement>(
      `[data-case="Button secondary"] [data-variant="plain"] button`,
    );
    if (!button || !plain) return null;
    return [getComputedStyle(button).boxShadow, getComputedStyle(plain).boxShadow];
  });
  expect(
    nestedButton !== null && nestedButton[0] === nestedButton[1] && nestedButton[0] !== "none",
    "a plain secondary Button inside an aug Card keeps its line",
  );

  const header = await page.evaluate(() => {
    const el = (variant: string) =>
      document.querySelector(`[data-case="Dialog"] [data-variant="${variant}"] header`);
    const plain = el("plain");
    const both = el("both");
    return plain && both
      ? [getComputedStyle(plain).backgroundColor, getComputedStyle(both).backgroundColor]
      : null;
  });
  expect(
    header !== null && header[0] === header[1] && header[0] !== "rgba(0, 0, 0, 0)",
    "the Dialog header fill is a part, not the frame, and survives the strip",
  );

  const rows = await page.evaluate(() => {
    const resolve = (token: string) => {
      const probe = document.createElement("i");
      probe.style.background = `var(${token})`;
      document.body.append(probe);
      const color = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return color;
    };
    const read = (name: string) => {
      const element = document.querySelector<HTMLElement>(`[data-row="${name}"]`)!;
      return {
        fill: getComputedStyle(element).backgroundColor,
        inlay: getComputedStyle(element, "::before").backgroundColor,
      };
    };
    return {
      accent: resolve("--theme-accent"),
      float: resolve("--theme-surface-float"),
      selected: read("selected"),
      plain: read("plain"),
      bare: read("bare"),
    };
  });
  expect(rows.accent !== rows.float, "the accent and the float fill differ in this theme");
  expect(
    rows.selected.inlay === rows.accent,
    "a selected ListItem inlay is filled with the accent",
  );
  expect(rows.plain.inlay === rows.float, "an unselected ListItem inlay keeps the float fill");
  expect(
    rows.selected.fill === "rgba(0, 0, 0, 0)",
    "a selected ListItem with an inlay drops its own fill",
  );
  expect(rows.bare.fill === rows.accent, "a selected ListItem without aug fills with the accent");
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.log(failures.join("\n"));
  console.log(`chrome-strip: ${failures.length} of ${checks} checks failed`);
  process.exitCode = 1;
} else {
  console.log(`chrome-strip: ${checks} checks passed`);
}
