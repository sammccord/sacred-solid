import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vite-plus/test";
import { onHandleAppearanceChange } from "../src/common/utilities.ts";
import { themeTokens } from "../src/theme/tokens.ts";

const LEGACY_NAMES = [
  "--theme-background",
  "--theme-background-input",
  "--theme-background-modal",
  "--theme-background-modal-footer",
  "--theme-border",
  "--theme-border-subdued",
  "--theme-button",
  "--theme-button-background",
  "--theme-button-foreground",
  "--theme-button-text",
  "--theme-focused-foreground",
  "--theme-focused-foreground-subdued",
  "--theme-overlay",
  "--theme-text",
  "--theme-window-background",
  "--theme-window-shadow",
  "--card-double-border-width",
];

const SCANNED = [
  "src",
  "playground",
  "concept-1",
  "concept-2",
  "aug",
  "scripts",
  "skills",
  "README.md",
  "AGENTS.md",
  "index.html",
];

const LAYOUT_METRIC = "--theme-line-height-base";
const TEXT_FILE = /\.(css|ts|tsx|html|md)$/;

function textFiles(path: string): string[] {
  if (statSync(path).isFile()) return TEXT_FILE.test(path) ? [path] : [];
  return readdirSync(path).flatMap((name) =>
    name === "node_modules" ? [] : textFiles(join(path, name)),
  );
}

const scanned = SCANNED.flatMap(textFiles);
const sources = scanned.map((path) => ({ path, text: readFileSync(path, "utf8") }));

interface Rule {
  selectors: string[];
  declarations: Map<string, string>;
}

function topLevelRules(css: string): Rule[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: Rule[] = [];
  let depth = 0;
  let selector = "";
  let body = "";
  for (const char of text) {
    if (char === "{") {
      depth++;
      if (depth === 1) continue;
    } else if (char === "}") {
      depth--;
      if (depth === 0) {
        const declarations = new Map<string, string>();
        let flat = "";
        let inner = 0;
        for (const c of body) {
          if (c === "{") inner++;
          else if (c === "}") inner--;
          else if (inner === 0) flat += c;
        }
        for (const part of flat.split(";")) {
          const colon = part.indexOf(":");
          if (colon < 0) continue;
          const name = part.slice(0, colon).trim();
          if (name.startsWith("--")) declarations.set(name, part.slice(colon + 1).trim());
        }
        rules.push({
          selectors: selector.split(",").map((s) => s.replace(/\s+/g, " ").trim()),
          declarations,
        });
        selector = "";
        body = "";
        continue;
      }
    }
    if (depth === 0) selector += char;
    else body += char;
  }
  return rules;
}

const globalRules = topLevelRules(readFileSync("src/styles/global.css", "utf8"));
const holoRules = topLevelRules(readFileSync("src/themes/holo.css", "utf8"));
const acidRules = topLevelRules(readFileSync("src/themes/acid.css", "utf8"));
const redlineRules = topLevelRules(readFileSync("src/themes/redline.css", "utf8"));
const THEME_EXTRA_VARS = ["--font-family-mono"];
const cssName = (name: string) => `--theme-${name}`;
const perTheme = themeTokens.filter((token) => token.scope === "theme");
const constants = themeTokens.filter((token) => token.scope === "constant");
const themeRules = [...globalRules, ...holoRules, ...acidRules, ...redlineRules].filter((rule) =>
  rule.selectors.some((selector) => selector.startsWith("body.theme-")),
);

function tintNames(): string[] {
  return globalRules
    .flatMap((rule) => rule.selectors)
    .flatMap((selector) => selector.match(/^body\.tint-([a-z]+)$/)?.[1] ?? []);
}

function blocksFor(selector: string): Rule[] {
  return globalRules.filter((rule) => rule.selectors.includes(selector));
}

test("the token table is consistent", () => {
  const camel = (name: string) => name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
  expect(themeTokens.map((token) => token.key)).toEqual(themeTokens.map((t) => camel(t.name)));
  expect(new Set(themeTokens.map((token) => token.name)).size).toBe(themeTokens.length);
  expect(new Set(themeTokens.map((token) => token.key)).size).toBe(themeTokens.length);
  for (const token of themeTokens) {
    expect(token.name === token.group || token.name.startsWith(`${token.group}-`)).toBe(true);
  }
});

test("no legacy token name survives", () => {
  const found = sources.flatMap(({ path, text }) =>
    LEGACY_NAMES.filter((name) => new RegExp(`${name}(?![\\w-])`).test(text)).map(
      (name) => `${path} uses ${name}`,
    ),
  );
  expect(found).toEqual([]);
});

test("every per-theme role is set in every theme block", () => {
  const tints = tintNames();
  expect(tints.length).toBeGreaterThan(0);
  const selectors = ["light", "dark"].flatMap((mode) => [
    `body.theme-${mode}`,
    ...tints.map((tint) => `body.theme-${mode}.tint-${tint}`),
  ]);
  const missing = selectors.flatMap((selector) => {
    const blocks = blocksFor(selector);
    if (blocks.length === 0) return [`${selector} has no block`];
    return perTheme
      .filter((token) => !blocks.some((rule) => rule.declarations.has(cssName(token.name))))
      .map((token) => `${selector} does not set ${cssName(token.name)}`);
  });
  expect(missing).toEqual([]);
});

test("theme blocks set only names from the table, each with its own value", () => {
  const known = new Set([...themeTokens.map((token) => cssName(token.name)), ...THEME_EXTRA_VARS]);
  const problems = themeRules.flatMap((rule) =>
    [...rule.declarations].flatMap(([name, value]) => [
      ...(known.has(name) ? [] : [`${rule.selectors[0]} sets ${name}, not in the table`]),
      ...(/var\(--theme-/.test(value)
        ? [`${rule.selectors[0]} derives ${name} from another theme token`]
        : []),
    ]),
  );
  expect(problems).toEqual([]);
});

test("constant geometry is set once on html and body", () => {
  const root = globalRules.find((rule) => rule.selectors.join(",") === "html,body");
  expect(root).toBeDefined();
  const missing = constants.filter((token) => !root!.declarations.has(cssName(token.name)));
  expect(missing.map((token) => token.name)).toEqual([]);
  const themeToken = perTheme.filter((token) => root!.declarations.has(cssName(token.name)));
  expect(themeToken.map((token) => token.name)).toEqual([]);
});

test("every --theme-* name in use resolves to the table or the layout metric", () => {
  const known = new Set([LAYOUT_METRIC, ...themeTokens.map((token) => cssName(token.name))]);
  const unknown = sources.flatMap(({ path, text }) =>
    [...text.matchAll(/(--theme-[a-z][a-z0-9]*(?:-[a-z0-9]+)*)/g)]
      .map((match) => match[1]!)
      .filter((name) => !known.has(name))
      .map((name) => `${path} uses ${name}`),
  );
  expect(unknown).toEqual([]);
});

const FLOAT_CONSUMERS = [
  "AlertBanner",
  "Dialog",
  "DropdownMenu",
  "Message",
  "Panel",
  "Popover",
  "Select",
  "Surface",
  "Tooltip",
].map((name) => `src/components/${name}.module.css`);

test("surface-float fills only overlay panels, everything else uses surface-chip", () => {
  const users = sources
    .filter(
      ({ path, text }) =>
        path.endsWith(".module.css") && text.includes("var(--theme-surface-float)"),
    )
    .map(({ path }) => path);
  expect(users.sort()).toEqual(FLOAT_CONSUMERS);
});

const packaged = [
  ["holo", holoRules],
  ["acid", acidRules],
  ["redline", redlineRules],
] as const;

describe.each(packaged)("%s", (name, rules) => {
  test("sets every per-theme role in one block", () => {
    const blocks = rules.filter((rule) => rule.selectors.includes(`body.theme-${name}`));
    expect(blocks).toHaveLength(1);
    const missing = perTheme.filter((token) => !blocks[0]!.declarations.has(cssName(token.name)));
    expect(missing.map((token) => token.name)).toEqual([]);
    expect(rules.flatMap((rule) => rule.selectors)).toEqual([`body.theme-${name}`]);
  });

  test("overrides constants and sets glow geometry for every shadow", () => {
    const block = rules[0]!;
    for (const shadow of ["window", "float", "tooltip", "ring"]) {
      const geometry = block.declarations.get(`--theme-shadow-${shadow}-geometry`);
      expect(geometry, shadow).toBeDefined();
      expect(geometry, shadow).toMatch(/\b\d+px\b/);
    }
  });

  test("ships in the package", () => {
    const manifest = JSON.parse(readFileSync("package.json", "utf8")) as {
      exports: Record<string, string>;
    };
    expect(manifest.exports[`./themes/${name}.css`]).toBe(`./dist/themes/${name}.css`);
    const config = readFileSync("vite.config.ts", "utf8");
    expect(config).toContain("onSuccess: () => finishPackCss()");
    expect(readFileSync("scripts/pack-css.ts", "utf8")).toContain('"src/themes"');
    expect(config).toContain(`"./themes/${name}.css": "./dist/themes/${name}.css"`);
  });
});

test("redline keeps a red accent for selected rows and cyan for control-foreground", () => {
  const block = redlineRules[0]!;
  expect(block.declarations.get("--font-family-mono")).toContain("Rajdhani");
  expect(block.declarations.get("--theme-accent")).toMatch(/^#7b2526$/i);
  expect(block.declarations.get("--theme-control-foreground")).toMatch(/^#4de1e0$/i);
});

test("acid sets the font stack and keeps cyan for control-foreground", () => {
  const block = acidRules[0]!;
  expect(block.declarations.get("--font-family-mono")).toContain("Rajdhani");
  expect(block.declarations.get("--theme-control-foreground")).toMatch(/^#5edde3$/i);
});

test("onHandleAppearanceChange switches the body to a theme pack class", () => {
  document.body.className = "theme-light tint-green font-x";
  onHandleAppearanceChange("theme-holo");
  expect([...document.body.classList].sort()).toEqual(["font-x", "theme-holo", "tint-green"]);
  onHandleAppearanceChange();
  expect(document.body.classList.contains("theme-light")).toBe(true);
  expect(document.body.classList.contains("theme-holo")).toBe(false);
});
