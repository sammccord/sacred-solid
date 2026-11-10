import { readFileSync } from "node:fs";
import { expect, test } from "vite-plus/test";
import { generate, scrapeMixins } from "../scripts/aug/generate.ts";

const css = readFileSync("node_modules/augmented-ui/augmented-ui.css", "utf8");

test("src/aug/mixins.generated.ts matches a fresh generation, rerun scripts/gen-aug.ts", () => {
  expect(readFileSync("src/aug/mixins.generated.ts", "utf8")).toBe(generate(css));
});

test("every scraped mixin lands in exactly one table", () => {
  const table = scrapeMixins(css);
  const scraped = new Set(
    [...css.matchAll(/\[data-augmented-ui~="([^"]+)"\]/g)].map((match) => match[1]),
  );
  const tabled = [
    ...Object.entries(table.regions).flatMap(([region, tails]) =>
      tails.map((tail) => `${region}-${tail}`),
    ),
    ...table.all.map((tail) => `all-${tail}`),
    ...table.flags,
  ];
  expect(tabled.toSorted()).toEqual([...scraped].toSorted());
});

test("unknown mixin families fail the generator", () => {
  expect(() => scrapeMixins('[data-augmented-ui~="zz-clip"] {}')).toThrow(/unrecognized/);
});
