import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

const PAGES = {
  hacking: { path: "/hacking/", reference: "04-Hacking_res-1920x1080.jpg" },
  journal: { path: "/journal/", reference: "01-Cursor_res-1920x1080.jpg" },
} as const;

type PageName = keyof typeof PAGES;

const name = process.argv[2] as PageName | undefined;
if (name === undefined || !(name in PAGES)) {
  console.error(`usage: vpx scripts/shoot.ts <${Object.keys(PAGES).join("|")}>`);
  process.exit(2);
}

const BASE_URL = process.env.SHOOT_URL ?? "http://localhost:5173";
const OUT = process.env.SHOOT_OUT ?? `${name}-shot.png`;
const SIZE = { width: 1920, height: 1080 };
const { path, reference: referenceFile } = PAGES[name];
const REFERENCE = resolve(import.meta.dirname, "../screenshots", referenceFile);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: SIZE });
const errors: string[] = [];
page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
page.on("pageerror", (error) => errors.push(String(error)));

const target = new URL(path, BASE_URL);
target.searchParams.set("paused", "");
await page.goto(target.href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const ours = await page.screenshot();
const oursPath = OUT.replace(/\.png$/, "-ours.png");
writeFileSync(oursPath, ours);

const side = await browser.newPage({ viewport: { width: SIZE.width * 2, height: SIZE.height } });
const reference = `data:image/jpeg;base64,${readFileSync(REFERENCE).toString("base64")}`;
await side.setContent(
  `<body style="margin:0;display:flex;background:#000"><img src="${reference}" width="1920" height="1080"><img src="data:image/png;base64,${ours.toString("base64")}" width="1920" height="1080"></body>`,
);
await side.screenshot({ path: OUT });
await browser.close();

console.log(`side by side (reference | ours): ${resolve(OUT)}`);
console.log(`ours alone: ${resolve(oursPath)}`);
if (errors.length > 0) {
  console.error(`console errors:\n${errors.join("\n")}`);
  process.exit(1);
}
