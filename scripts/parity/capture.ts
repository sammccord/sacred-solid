import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Browser, Page } from "playwright";
import { advance, openPage } from "./browser.ts";
import { scenarios, type Scenario, type Slice } from "./scenarios.ts";

const SLICE_HEIGHT = 3000;

const canonicalise = `(() => {
  const moduleClass = /^_?[A-Za-z0-9_-]{6}_(\\w+)$/;
  const referenced = new Set();
  for (const sheet of document.styleSheets) {
    try {
      const walkRules = (rules) => { for (const rule of rules) { if (rule.selectorText) for (const m of rule.selectorText.matchAll(/\\.((?:\\\\.|[\\w-])+)/g)) referenced.add(m[1]); if (rule.cssRules) walkRules(rule.cssRules); } };
      walkRules(sheet.cssRules);
    } catch {}
  }
  const skip = new Set(["SCRIPT", "STYLE", "LINK", "NEXT-ROUTE-ANNOUNCER", "NOSCRIPT"]);
  const out = [];
  const walk = (node, depth) => {
    const pad = "  ".repeat(depth);
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentNode.tagName === "TEXTAREA") return;
      const text = node.textContent.replace(/\\s+/g, " ").trim();
      if (text) out.push(pad + JSON.stringify(text));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE || skip.has(node.tagName)) return;
    if (node.hasAttribute("hidden") && !node.children.length) return;
    const attrs = [];
    const type = node.getAttribute("type");
    const keepValueAttr = !["INPUT", "TEXTAREA"].includes(node.tagName) || ["radio", "checkbox", "button", "submit", "hidden"].includes(type);
    for (const attr of node.attributes) {
      let value = attr.value;
      if (attr.name === "checked" || (attr.name === "value" && !keepValueAttr)) continue;
      if (attr.name === "class") {
        value = value.split(/\\s+/).filter(Boolean).filter((c) => !moduleClass.test(c) || referenced.has(c)).map((c) => (moduleClass.exec(c)?.[1] ?? c)).join(" ");
        if (!value) continue;
      }
      else if (attr.name === "style") value = node.style.cssText.split(";").map((d) => d.trim()).filter(Boolean).sort().join("; ");
      else if (attr.name === "d") value = value.replace(/-?\\d+\\.\\d+/g, (n) => Number(n).toFixed(5));
      else if (["id", "for", "aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "list"].includes(attr.name)) value = "<id>";
      attrs.push(attr.name + "=" + JSON.stringify(value));
    }
    if (node.tagName === "INPUT" || node.tagName === "TEXTAREA" || node.tagName === "SELECT") {
      attrs.push("prop:value=" + JSON.stringify(node.value));
      if (node.tagName === "INPUT") attrs.push("prop:checked=" + node.checked);
    }
    attrs.sort();
    out.push(pad + "<" + node.tagName.toLowerCase() + (attrs.length ? " " + attrs.join(" ") : "") + ">");
    for (const child of node.childNodes) walk(child, depth + 1);
  };
  return (root) => { out.length = 0; walk(root, 0); return out.join("\\n"); };
})()`;

export interface Captured {
  name: string;
  png: Buffer;
  dom: string;
}

async function slicesOf(
  page: Page,
  slice: Slice,
): Promise<Array<{ name: string; x: number; y: number; width: number; height: number }>> {
  const rect = await slice.rect(page);
  const result = [];
  for (let offset = 0, i = 0; offset < rect.height; offset += SLICE_HEIGHT, i++) {
    result.push({
      name: rect.height > SLICE_HEIGHT ? `${slice.name}.${i}` : slice.name,
      x: rect.x,
      y: rect.y + offset,
      width: rect.width,
      height: Math.min(SLICE_HEIGHT, rect.height - offset),
    });
  }
  return result;
}

export async function captureScenario(
  browser: Browser,
  baseUrl: string,
  scenario: Scenario,
): Promise<Captured[]> {
  const page = await openPage(browser, baseUrl + scenario.route);
  try {
    await scenario.act?.(page, scenario.stepMs);
    await page.waitForTimeout(150);
    await advance(page, scenario.settleMs ?? 400, scenario.stepMs);
    await page.waitForTimeout(150);
    const captured: Captured[] = [];
    for (const slice of await scenario.slices(page)) {
      const dom = await slice.dom(page, canonicalise);
      for (const piece of await slicesOf(page, slice)) {
        const png = await page.screenshot({
          clip: piece,
          fullPage: true,
          animations: "disabled",
          caret: "hide",
        });
        captured.push({ name: `${scenario.name}__${piece.name}`, png, dom });
      }
    }
    return captured;
  } finally {
    await page.context().close();
  }
}

function sameCapture(a: Captured[], b: Captured[]): boolean {
  return (
    a.length === b.length &&
    a.every(
      (item, i) => item.name === b[i]!.name && item.dom === b[i]!.dom && item.png.equals(b[i]!.png),
    )
  );
}

//NOTE: the React baseline sometimes loses its modal and action bar on a run. A capture counts as stable only when two consecutive runs agree.
async function captureStable(
  browser: Browser,
  baseUrl: string,
  scenario: Scenario,
): Promise<{ results: Captured[]; stable: boolean }> {
  let previous = await captureScenario(browser, baseUrl, scenario);
  for (let attempt = 0; attempt < 4; attempt++) {
    const next = await captureScenario(browser, baseUrl, scenario);
    if (sameCapture(previous, next)) return { results: next, stable: true };
    previous = next;
  }
  return { results: previous, stable: false };
}

export interface CaptureOptions {
  only?: string;
  requireStable?: boolean;
}

export async function captureAll(
  browser: Browser,
  baseUrl: string,
  outDir: string,
  options: CaptureOptions = {},
): Promise<{ names: string[]; unstable: string[] }> {
  mkdirSync(outDir, { recursive: true });
  const names: string[] = [];
  const unstable: string[] = [];
  for (const scenario of scenarios) {
    if (options.only && !scenario.name.includes(options.only)) continue;
    let results: Captured[];
    if (options.requireStable) {
      const outcome = await captureStable(browser, baseUrl, scenario);
      results = outcome.results;
      if (!outcome.stable) unstable.push(...results.map((r) => r.name));
    } else {
      results = await captureScenario(browser, baseUrl, scenario);
    }
    for (const result of results) {
      writeFileSync(join(outDir, `${result.name}.png`), result.png);
      writeFileSync(join(outDir, `${result.name}.dom.txt`), result.dom);
      names.push(result.name);
    }
  }
  return { names, unstable };
}
