import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.LAYERS_URL ?? "http://localhost:4173/layers/";
const ORDER = "@layer sacred.vendor, sacred.base, sacred.aug, sacred.components, sacred.themes;";

const failures: string[] = [];
let checks = 0;

function expect(ok: boolean, message: string) {
  checks++;
  if (!ok) failures.push(message);
}

for (const file of [
  "dist/style.css",
  "dist/styles/global.css",
  "dist/styles/global-fonts.css",
  "dist/themes/holo.css",
  "dist/themes/acid.css",
  "dist/themes/redline.css",
]) {
  expect(
    readFileSync(file, "utf8").startsWith(`${ORDER}\n`),
    `${file} starts with the layer order`,
  );
}
const bundle = readFileSync("dist/style.css", "utf8");
expect(bundle.split(ORDER).length === 2, "dist/style.css states the order once");
const unlayered = bundle
  .replace(/@layer [^{;]+;/g, "")
  .replace(/@layer sacred\.[a-z]+ \{[\s\S]*?\n\}\n(?=@layer|$)/g, "")
  .trim();
expect(unlayered === "", "dist/style.css has nothing outside a sacred layer");

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "load" });
  const probes = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".caller")].map((element) => {
      const style = getComputedStyle(element);
      return {
        name: [...element.classList].find((name) => name.startsWith("probe-"))!.slice(6),
        background: style.backgroundColor,
        paddingTop: style.paddingTop,
        color: style.color,
        borderTopWidth: style.borderTopWidth,
        borderTopColor: style.borderTopColor,
      };
    }),
  );
  expect(probes.length === 3, "the fixture rendered all three probes");
  for (const probe of probes) {
    expect(probe.background === "rgb(1, 2, 3)", `${probe.name} caller background wins over lib`);
    expect(probe.paddingTop === "7px", `${probe.name} caller padding wins over lib`);
    expect(probe.color === "rgb(4, 5, 6)", `${probe.name} caller color wins over lib`);
  }
  const panel = probes.find((probe) => probe.name === "Panel");
  expect(
    panel?.borderTopWidth === "5px" && panel.borderTopColor === "rgb(7, 8, 9)",
    "Panel caller border wins over the lib border",
  );
} finally {
  await browser.close();
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`check-layers: ${checks} checks passed`);
