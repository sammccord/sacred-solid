import { readFileSync, writeFileSync } from "node:fs";
import { chromium, type Browser } from "playwright";

const PAGES = ["/", "/concept-1/", "/concept-2/", "/aug/"];
const THEMES = [
  "theme-light",
  "theme-dark",
  "theme-light tint-green",
  "theme-dark tint-purple",
  "theme-light tint-orange",
  "theme-dark tint-yellow",
];
const PROPERTIES = [
  "color",
  "background-color",
  "background-image",
  "box-shadow",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "outline-color",
  "caret-color",
  "scrollbar-color",
  "text-decoration-color",
];

interface Collected {
  elements: Record<string, Record<string, string>>;
  tokens: Record<string, { raw: string; color: string }>;
}

type Snapshot = Record<string, Collected>;

async function collect(browser: Browser, url: string, theme: string): Promise<Collected> {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await page.goto(url, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
      content:
        "*, *::before, *::after { animation: none !important; transition: none !important; }",
    });
    await page.waitForTimeout(300);
    return await page.evaluate(
      ({ theme, properties }) => {
        document.body.classList.remove(
          ...[...document.body.classList].filter((c) => /^(theme|tint)-/.test(c)),
        );
        document.body.classList.add(...theme.split(" "));
        const names = new Set<string>();
        for (const sheet of document.styleSheets) {
          const walk = (rules: CSSRuleList) => {
            for (const rule of rules) {
              if ("style" in rule) {
                const style = (rule as CSSStyleRule).style;
                for (let i = 0; i < style.length; i++) {
                  if (style[i]!.startsWith("--theme-")) names.add(style[i]!);
                }
              }
              if ("cssRules" in rule) walk((rule as CSSGroupingRule).cssRules);
            }
          };
          try {
            walk(sheet.cssRules);
          } catch {
            continue;
          }
        }
        const probe = document.createElement("div");
        document.body.appendChild(probe);
        const bodyStyle = getComputedStyle(document.body);
        const tokens: Record<string, { raw: string; color: string }> = {};
        for (const name of [...names].sort()) {
          probe.style.color = "";
          probe.style.color = `var(${name})`;
          tokens[name] = {
            raw: bodyStyle.getPropertyValue(name).trim(),
            color: getComputedStyle(probe).color,
          };
        }
        probe.remove();
        const elements: Record<string, Record<string, string>> = {};
        const visit = (el: Element, path: string) => {
          for (const pseudo of ["", "::before", "::after"]) {
            const style = getComputedStyle(el, pseudo || null);
            if (pseudo && style.content === "none") continue;
            const entry: Record<string, string> = {};
            for (const property of properties) entry[property] = style.getPropertyValue(property);
            elements[`${path}${pseudo}`] = entry;
          }
          [...el.children].forEach((child, i) =>
            visit(child, `${path}/${child.tagName.toLowerCase()}[${i}]`),
          );
        };
        visit(document.documentElement, "html");
        return { elements, tokens };
      },
      { theme, properties: PROPERTIES },
    );
  } finally {
    await page.close();
  }
}

async function snapshot(base: string, out: string) {
  const result: Snapshot = {};
  const browser = await chromium.launch();
  try {
    for (const path of PAGES) {
      for (const theme of THEMES) {
        result[`${path} ${theme}`] = await collect(browser, new URL(path, base).href, theme);
      }
    }
  } finally {
    await browser.close();
  }
  writeFileSync(out, JSON.stringify(result, null, 1).replaceAll(new URL(base).origin, "<origin>"));
  const total = Object.values(result).reduce((n, v) => n + Object.keys(v.elements).length, 0);
  console.log(
    `wrote ${out}: ${Object.keys(result).length} page/theme pairs, ${total} element states`,
  );
}

function diff(aFile: string, bFile: string) {
  const a = JSON.parse(readFileSync(aFile, "utf8")) as Snapshot;
  const b = JSON.parse(readFileSync(bFile, "utf8")) as Snapshot;
  let compared = 0;
  const problems: string[] = [];
  for (const key of Object.keys(a)) {
    const left = a[key]!.elements;
    const right = b[key]?.elements;
    if (!right) {
      problems.push(`${key}: missing in second snapshot`);
      continue;
    }
    for (const path of new Set([...Object.keys(left), ...Object.keys(right)])) {
      const x = left[path];
      const y = right[path];
      if (!x || !y) {
        problems.push(`${key} ${path}: present in only one snapshot`);
        continue;
      }
      for (const property of PROPERTIES) {
        compared++;
        if (x[property] !== y[property]) {
          problems.push(`${key} ${path} ${property}: ${x[property]} -> ${y[property]}`);
        }
      }
    }
  }
  console.log(
    `compared ${compared} computed values across ${Object.keys(a).length} page/theme pairs`,
  );
  if (problems.length > 0) {
    console.log(`${problems.length} difference(s)`);
    console.log(problems.slice(0, 40).join("\n"));
    process.exitCode = 1;
  } else {
    console.log("identical");
  }
}

const [command, first, second] = process.argv.slice(2);
if (command === "snapshot" && first && second) await snapshot(first, second);
else if (command === "diff" && first && second) diff(first, second);
else {
  console.error(
    "usage: vpx scripts/computed-snapshot.ts <snapshot <base-url> <out.json> | diff <a.json> <b.json>>",
  );
  process.exitCode = 2;
}
