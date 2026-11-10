import { readFileSync } from "node:fs";
import { expect, test } from "vite-plus/test";

const css = readFileSync("src/aug/aug.css", "utf8");

const DEFAULTS = {
  "--aug-border-bg": "var(--theme-line-strong)",
  "--aug-inlay-bg": "var(--theme-surface-float)",
  "--aug-border-all": "var(--theme-line-width)",
  "--aug-inlay-all": "var(--theme-line-width)",
};

const where = /:where\(\[data-augmented-ui\]\) \{([^}]*)\}/.exec(css)?.[1] ?? "";

test("border and inlay defaults read role tokens", () => {
  for (const [name, value] of Object.entries(DEFAULTS)) {
    expect(where).toContain(`${name}: ${value};`);
  }
  expect(where).toContain("position: relative;");
});

test("the defaults need no specificity, the sacred.aug layer sits above the vendor layer", () => {
  expect(css).not.toMatch(/(^|\n)\[data-augmented-ui\] \{/);
});
