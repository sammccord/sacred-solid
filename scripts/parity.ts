import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { launch } from "./parity/browser.ts";
import { captureAll } from "./parity/capture.ts";

const ROOT = ".parity";
const BASELINE_URL = process.env.BASELINE_URL ?? "http://localhost:10000";
const SOLID_URL = process.env.SOLID_URL ?? "http://localhost:4173";

const [command, ...rest] = process.argv.slice(2);
const only = rest.find((arg) => !arg.startsWith("--"));

function compareDirs(
  aDir: string,
  bDir: string,
  diffDir: string,
): { name: string; pixels: number; domEqual: boolean; note: string }[] {
  mkdirSync(diffDir, { recursive: true });
  const aNames = new Set(
    readdirSync(aDir)
      .filter((f) => f.endsWith(".png"))
      .map((f) => f.slice(0, -4)),
  );
  const bNames = new Set(
    readdirSync(bDir)
      .filter((f) => f.endsWith(".png"))
      .map((f) => f.slice(0, -4)),
  );
  const rows = [];
  for (const name of [...new Set([...aNames, ...bNames])].sort()) {
    if (only && !name.includes(only)) continue;
    if (!aNames.has(name) || !bNames.has(name)) {
      rows.push({
        name,
        pixels: -1,
        domEqual: false,
        note: aNames.has(name) ? "missing in solid" : "missing in baseline",
      });
      continue;
    }
    const a = PNG.sync.read(readFileSync(join(aDir, `${name}.png`)));
    const b = PNG.sync.read(readFileSync(join(bDir, `${name}.png`)));
    let pixels = 0;
    let note = "";
    if (a.width !== b.width || a.height !== b.height) {
      pixels = Math.max(a.width * a.height, b.width * b.height);
      note = `size ${a.width}x${a.height} vs ${b.width}x${b.height}`;
    } else {
      const diff = new PNG({ width: a.width, height: a.height });
      pixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0 });
      if (pixels > 0) writeFileSync(join(diffDir, `${name}.png`), PNG.sync.write(diff));
    }
    const domA = existsSync(join(aDir, `${name}.dom.txt`))
      ? readFileSync(join(aDir, `${name}.dom.txt`), "utf8")
      : "";
    const domB = existsSync(join(bDir, `${name}.dom.txt`))
      ? readFileSync(join(bDir, `${name}.dom.txt`), "utf8")
      : "";
    const domEqual = domA === domB;
    if (!domEqual) {
      const la = domA.split("\n");
      const lb = domB.split("\n");
      let i = 0;
      while (i < la.length && i < lb.length && la[i] === lb[i]) i++;
      note += ` dom@${i + 1}\n    baseline: ${la[i]?.trim().slice(0, 160)}\n    solid:    ${lb[i]?.trim().slice(0, 160)}`;
    }
    rows.push({ name, pixels, domEqual, note });
  }
  return rows;
}

const UNSTABLE_FILE = join(ROOT, "unstable.txt");

function readUnstable(): Set<string> {
  return new Set(
    existsSync(UNSTABLE_FILE)
      ? readFileSync(UNSTABLE_FILE, "utf8").split("\n").filter(Boolean)
      : [],
  );
}

function report(
  rows: ReturnType<typeof compareDirs>,
  label: string,
  unstable = new Set<string>(),
): { ok: boolean; text: string } {
  const lines: string[] = [];
  const decided = rows.filter((r) => !unstable.has(r.name));
  const failed = decided.filter((r) => r.pixels !== 0 || !r.domEqual);
  for (const row of rows) {
    const ok = row.pixels === 0 && row.domEqual;
    const verdict = unstable.has(row.name) ? "INCONCLUSIVE" : ok ? "PASS" : "FAIL";
    lines.push(`${verdict} ${row.name} pixels=${row.pixels}${row.note ? " " + row.note : ""}`);
  }
  lines.push(
    `${label}: ${decided.length - failed.length}/${decided.length} identical, ${rows.length - decided.length} inconclusive (baseline differs from itself)`,
  );
  const text = lines.join("\n");
  console.log(text);
  return { ok: failed.length === 0, text };
}

const browser = await launch();
try {
  if (command === "baseline") {
    if (!only) rmSync(join(ROOT, "baseline"), { recursive: true, force: true });
    const { names, unstable } = await captureAll(browser, BASELINE_URL, join(ROOT, "baseline"), {
      only,
      requireStable: true,
    });
    const rerun = new Set(names.map((name) => name.split("__")[0]));
    const kept = [...readUnstable()].filter((name) => !rerun.has(name.split("__")[0]));
    writeFileSync(UNSTABLE_FILE, [...kept, ...unstable].join("\n"));
    console.log(`captured ${names.length} baseline slices, ${unstable.length} never stabilised`);
  } else if (command === "check") {
    const solidDir = join(ROOT, "solid");
    if (!only) rmSync(solidDir, { recursive: true, force: true });
    await captureAll(browser, SOLID_URL, solidDir, { only });
    const compare = () => compareDirs(join(ROOT, "baseline"), solidDir, join(ROOT, "diff"));
    let rows = compare();
    for (let round = 0; round < 2; round++) {
      const failing = new Set(
        rows
          .filter((r) => (r.pixels !== 0 || !r.domEqual) && !readUnstable().has(r.name))
          .map((r) => r.name.split("__")[0]!),
      );
      if (failing.size === 0) break;
      for (const scenario of failing) {
        await captureAll(browser, BASELINE_URL, join(ROOT, "baseline"), {
          only: scenario,
          requireStable: true,
        });
        await captureAll(browser, SOLID_URL, solidDir, { only: scenario });
      }
      rows = compare();
    }
    const result = report(rows, "parity", readUnstable());
    if (!only) writeFileSync(join(ROOT, "check.log"), result.text + "\n");
    process.exitCode = result.ok ? 0 : 1;
  } else {
    console.error("usage: vpx scripts/parity.ts <baseline|check> [name-filter]");
    process.exitCode = 2;
  }
} finally {
  await browser.close();
}
