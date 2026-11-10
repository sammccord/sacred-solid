import { readFileSync, writeFileSync } from "node:fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const [first, second, diffPath] = process.argv.slice(2);
if (first === undefined || second === undefined) {
  console.error("usage: vpx scripts/pixel-diff.ts <a.png> <b.png> [diff.png]");
  process.exit(2);
}

const a = PNG.sync.read(readFileSync(first));
const b = PNG.sync.read(readFileSync(second));
if (a.width !== b.width || a.height !== b.height) {
  console.error(`size differs: ${a.width}x${a.height} vs ${b.width}x${b.height}`);
  process.exit(2);
}

const diff = new PNG({ width: a.width, height: a.height });
const threshold = Number(process.env.PIXEL_THRESHOLD ?? 0.1);
const different = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold });
if (diffPath !== undefined) writeFileSync(diffPath, PNG.sync.write(diff));
console.log(`${different} of ${a.width * a.height} pixels differ (threshold ${threshold})`);
process.exit(different === 0 ? 0 : 1);
