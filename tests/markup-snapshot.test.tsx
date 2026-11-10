import { render } from "@solidjs/testing-library";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { beforeAll, expect, test } from "vite-plus/test";
import * as src from "../src/index.ts";
import { markupCases } from "./markup-cases.tsx";
import { stubBrowserApis } from "./stubs.ts";

beforeAll(stubBrowserApis);

const SNAPSHOT = "tests/markup-no-class.json";

// Class values are left out. The dev transform and the pack build hash class names differently,
// and the pack build drops a class that no rule styles. The class-merge test covers class values.
// Generated ids count up per render, so they are masked.
function withoutClasses(html: string) {
  return html.replace(/ class="[^"]*"/g, "").replace(/\bcl-\d+\b/g, "cl-#");
}

async function markupOf(lib: typeof src) {
  const out: Record<string, string> = {};
  for (const [name, make] of markupCases(lib)) {
    const { container, unmount } = render(() => <lib.Providers>{make()}</lib.Providers>);
    out[name] = withoutClasses(container.innerHTML);
    unmount();
  }
  return out;
}

// To record the snapshot from an earlier build instead of the source, run the tests once with
// MARKUP_FROM=dist after `vp pack` of the revision to compare against.
test("markup with no class passed matches the recorded snapshot", async () => {
  if (process.env.MARKUP_FROM === "dist") {
    const dist = (await import("../dist/index.mjs")) as unknown as typeof src;
    writeFileSync(SNAPSHOT, `${JSON.stringify(await markupOf(dist), null, 2)}\n`);
  }
  expect(existsSync(SNAPSHOT)).toBe(true);
  const recorded = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as Record<string, string>;
  const current = await markupOf(src);
  expect(Object.keys(current)).toEqual(Object.keys(recorded));
  for (const name of Object.keys(recorded)) {
    expect(current[name], name).toBe(recorded[name]);
  }
});
