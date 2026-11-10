import "./docs/css-stub.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const { generate, ROOT } = await import("./docs/generate.ts");

const check = process.argv.includes("--check");
const stale: string[] = [];
for (const [path, text] of generate()) {
  if (readFileSync(join(ROOT, path), "utf8") === text) continue;
  stale.push(path);
  if (!check) writeFileSync(join(ROOT, path), text);
}
if (check && stale.length > 0) {
  console.error(`stale, run vpx scripts/gen-docs.ts: ${stale.join(", ")}`);
  process.exit(1);
}
console.log(check ? "docs are current" : `rewrote ${stale.length} file(s)`);
