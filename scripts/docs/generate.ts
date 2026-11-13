import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { CORNER_REGIONS } from "../../src/aug/collect.ts";
import {
  AUG_ALL_MIXINS,
  AUG_FLAG_MIXINS,
  AUG_REGION_MIXINS,
} from "../../src/aug/mixins.generated.ts";
import {
  ALL_SUFFIXES,
  CORNER_REGION_SUFFIXES,
  EDGE_REGION_SUFFIXES,
  SURFACE_SUFFIXES,
  type Suffixes,
} from "../../src/aug/suffixes.ts";
import { styleAttributes } from "../../src/style/index.ts";
import { themeTokens } from "../../src/theme/tokens.ts";
import {
  ALL_OPTION_MEANINGS,
  CLASS_NOTES,
  COMPONENT_NOTES,
  CORNER_OPTION_MEANINGS,
  EDGE_OPTION_MEANINGS,
  GROUP_MEANINGS,
  NO_ELEMENT_REASONS,
  SKIPPED_REASONS,
  STYLE_CASES,
  SURFACE_OPTION_MEANINGS,
  THEME_NOTES,
  TOKEN_MEANINGS,
} from "./descriptions.ts";
import { topLevelRules } from "./css.ts";
import { type Blocks, code, codeList, fill, table } from "./markdown.ts";

export const ROOT = resolve(import.meta.dirname, "../..");

const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

function sameKeys(label: string, actual: Iterable<string>, expected: Iterable<string>) {
  const have = new Set(actual);
  const want = new Set(expected);
  const missing = [...want].filter((key) => !have.has(key));
  const extra = [...have].filter((key) => !want.has(key));
  if (missing.length + extra.length > 0) {
    throw new Error(`${label}: missing [${missing.join(", ")}], unexpected [${extra.join(", ")}]`);
  }
}

function sourceFiles(dir: string, pattern: RegExp): string[] {
  return readdirSync(join(ROOT, dir)).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(join(ROOT, path)).isDirectory()) return sourceFiles(path, pattern);
    return pattern.test(name) ? [path] : [];
  });
}

const THEME_VAR = (name: string) => `--theme-${name}`;

function tokenConsumers(): Map<string, string[]> {
  const files = [...sourceFiles("src/components", /\.(css|tsx)$/), "src/styles/global.css"];
  const reads = /(?:var\(\s*|getPropertyValue\(\s*["'])(--theme-[a-z0-9-]+)/g;
  const consumers = new Map<string, Set<string>>();
  for (const file of files) {
    const label = file.endsWith("global.css")
      ? "global.css"
      : basename(file).replace(/\.module\.css$|\.tsx$/, "");
    for (const match of read(file).matchAll(reads)) {
      const set = consumers.get(match[1]!) ?? new Set<string>();
      set.add(label);
      consumers.set(match[1]!, set);
    }
  }
  return new Map([...consumers].map(([name, set]) => [name, [...set].toSorted()]));
}

export function tokensBlock(): string {
  sameKeys(
    "TOKEN_MEANINGS",
    Object.keys(TOKEN_MEANINGS),
    themeTokens.map((token) => token.name),
  );
  const groups = [...new Set(themeTokens.map((token) => token.group))];
  sameKeys("GROUP_MEANINGS", Object.keys(GROUP_MEANINGS), groups);
  const defaults = topLevelRules(read("src/styles/global.css")).find(
    (rule) => rule.selector === "html, body",
  )!.declarations;
  const consumers = tokenConsumers();
  const perTheme = themeTokens.filter((token) => token.scope === "theme").length;
  const lines = [
    `The table has ${themeTokens.length} tokens. ${perTheme} are per-theme roles and ${themeTokens.length - perTheme} are constants.`,
  ];
  for (const group of groups) {
    const inGroup = themeTokens.filter((token) => token.group === group);
    lines.push(
      `## ${group[0]!.toUpperCase()}${group.slice(1)} tokens`,
      GROUP_MEANINGS[group]!,
      table(
        ["Variable", "Key", "Scope", "Default", "Meaning"],
        inGroup.map((token) => {
          const fallback = defaults.get(THEME_VAR(token.name));
          if (token.scope === "constant" && fallback === undefined) {
            throw new Error(`constant ${token.name} has no default in global.css`);
          }
          return [
            code(THEME_VAR(token.name)),
            code(token.key),
            token.scope,
            token.scope === "constant" ? code(fallback!) : "set by each theme",
            TOKEN_MEANINGS[token.name]!,
          ];
        }),
      ),
      inGroup
        .map((token) => {
          const used = consumers.get(THEME_VAR(token.name));
          if (used === undefined) throw new Error(`no component reads ${THEME_VAR(token.name)}`);
          return `- ${code(THEME_VAR(token.name))} is read by ${codeList(used)}.`;
        })
        .join("\n"),
    );
  }
  return lines.join("\n\n");
}

export function themeChecklistBlock(): string {
  const groups = [...new Set(themeTokens.map((token) => token.group))];
  const perTheme = themeTokens.filter((token) => token.scope === "theme");
  const lines = groups.flatMap((group) => {
    const names = perTheme
      .filter((token) => token.group === group)
      .map((token) => THEME_VAR(token.name));
    return names.length === 0
      ? []
      : [`- The ${group} group has ${names.length}. ${codeList(names)}.`];
  });
  const constants = themeTokens
    .filter((token) => token.scope === "constant")
    .map((token) => THEME_VAR(token.name));
  return [
    `Set all ${perTheme.length} per-theme roles.`,
    lines.join("\n"),
    `A theme may also override the ${constants.length} constants. ${codeList(constants)}.`,
  ].join("\n\n");
}

function groupedMixins(): string {
  const byList = new Map<string, string[]>();
  for (const [region, mixins] of Object.entries(AUG_REGION_MIXINS)) {
    const key = mixins.join(" ");
    byList.set(key, [...(byList.get(key) ?? []), region]);
  }
  return table(
    ["Regions", "Kind", "Count", "Mixins"],
    [...byList].map(([key, regions]) => {
      const kinds = new Set(
        regions.map((region) => (CORNER_REGIONS.includes(region as never) ? "corner" : "edge")),
      );
      return [
        codeList(regions),
        [...kinds].join(" and "),
        String(key.split(" ").length),
        codeList(key.split(" ")),
      ];
    }),
  );
}

export function regionMixinsBlock(): string {
  return groupedMixins();
}

export function allMixinsBlock(): string {
  return `${AUG_ALL_MIXINS.length} shapes. ${codeList(AUG_ALL_MIXINS)}.`;
}

export function flagMixinsBlock(): string {
  return `augmented-ui declares ${AUG_FLAG_MIXINS.length} flag mixins. ${codeList(AUG_FLAG_MIXINS)}. \`AugProps\` emits only \`border\` and \`inlay\`.`;
}

const takesNumber = (key: string) => key.startsWith("clipmod") || key === "opacity";

function optionTable(
  label: string,
  suffixes: Suffixes,
  meanings: Record<string, string>,
  prefix: string,
): string {
  sameKeys(label, Object.keys(meanings), Object.keys(suffixes));
  return table(
    ["Option", "Type", "CSS variable", "Meaning"],
    Object.entries(suffixes).map(([key, suffix]) => [
      code(key),
      takesNumber(key) ? "string or number" : "string",
      code(`${prefix}${suffix}`),
      meanings[key]!,
    ]),
  );
}

export const cornerOptionsBlock = () =>
  optionTable(
    "CORNER_OPTION_MEANINGS",
    CORNER_REGION_SUFFIXES,
    CORNER_OPTION_MEANINGS,
    "--aug-{region}",
  );
export const edgeOptionsBlock = () =>
  optionTable("EDGE_OPTION_MEANINGS", EDGE_REGION_SUFFIXES, EDGE_OPTION_MEANINGS, "--aug-{region}");
export const allOptionsBlock = () =>
  optionTable("ALL_OPTION_MEANINGS", ALL_SUFFIXES, ALL_OPTION_MEANINGS, "--aug-all");

export function surfaceOptionsBlock(): string {
  sameKeys(
    "SURFACE_OPTION_MEANINGS",
    Object.keys(SURFACE_OPTION_MEANINGS),
    Object.keys(SURFACE_SUFFIXES),
  );
  return table(
    ["Option", "Type", "Border variable", "Inlay variable", "Meaning"],
    Object.entries(SURFACE_SUFFIXES).map(([key, suffix]) => [
      code(key),
      takesNumber(key) ? "string or number" : "string",
      code(`--aug-border${suffix}`),
      code(`--aug-inlay${suffix}`),
      SURFACE_OPTION_MEANINGS[key]!,
    ]),
  );
}

interface ComponentFile {
  name: string;
  file: string;
}

function exportedComponents(): ComponentFile[] {
  const index = read("src/index.ts");
  return [...index.matchAll(/export \{([^}]*)\} from "\.\/components\/([^"]+)";/g)].flatMap(
    (match) =>
      match[1]!
        .split(",")
        .map((item) => item.trim())
        .filter((item) => /^[A-Z]/.test(item) && !item.startsWith("type "))
        .map((name) => ({ name, file: `src/components/${match[2]!}` })),
  );
}

function rootTags(text: string): string[] {
  const tags: string[] = [];
  const marks = /\{\.\.\.styleAttributes\(|aug=\{props\.aug\}/g;
  for (const mark of text.matchAll(marks)) {
    const before = [...text.slice(0, mark.index).matchAll(/<([A-Za-z][\w.]*)(?=[\s>/])/g)].at(-1);
    if (before !== undefined && !tags.includes(before[1]!)) tags.push(before[1]!);
  }
  return tags;
}

export function componentsBlocks(): { components: string; skipped: string } {
  const all = exportedComponents();
  const withAug: { name: string; tags: string[] }[] = [];
  const without: string[] = [];
  for (const { name, file } of all) {
    const text = read(file);
    if (!text.includes("aug?: AugProps")) {
      without.push(name);
      continue;
    }
    if (!text.includes("theme?: ThemeProps")) throw new Error(`${name} takes aug but not theme`);
    const tags = rootTags(text);
    if (tags.length === 0) throw new Error(`${name}: no root element found`);
    withAug.push({ name, tags });
  }
  sameKeys("SKIPPED_REASONS", Object.keys(SKIPPED_REASONS), without);
  const augNames = new Set(withAug.map((entry) => entry.name));
  const staleNotes = Object.keys(COMPONENT_NOTES).filter((name) => !augNames.has(name));
  if (staleNotes.length > 0) {
    throw new Error(`COMPONENT_NOTES names components without aug: ${staleNotes.join(", ")}`);
  }
  const forwarding = withAug.filter((entry) => entry.tags.every((tag) => /^[A-Z]/.test(tag)));
  const rows = withAug.map(({ name, tags }) => {
    const elements = tags.filter((tag) => /^[a-z]/.test(tag)).map((tag) => `<${tag}>`);
    const forwards = tags.filter((tag) => /^[A-Z]/.test(tag));
    return [
      code(name),
      elements.length === 0 ? "none" : codeList(elements),
      forwards.length === 0 ? "none" : codeList(forwards),
      COMPONENT_NOTES[name] ?? "",
    ];
  });
  const skippedRows = without.map((name) => [code(name), SKIPPED_REASONS[name]!]);
  return {
    components: [
      `${withAug.length} exported components take \`aug\` and \`theme\`. ${forwarding.length} of them render no element with the attributes and pass both props to another component.`,
      table(["Component", "Element with the attributes", "Forwards to", "Note"], rows),
    ].join("\n\n"),
    skipped: [
      `${without.length} exported components take neither prop.`,
      table(["Component", "Reason"], skippedRows),
    ].join("\n\n"),
  };
}

export function stripBlock(): string {
  const rows = sourceFiles("src/components", /\.module\.css$/).flatMap((file) =>
    topLevelRules(read(file)).flatMap((rule) =>
      rule.selector.includes(":where([data-aug")
        ? [
            [
              code(basename(file).replace(".module.css", "")),
              code(rule.selector),
              code([...rule.declarations].map(([name, value]) => `${name}: ${value}`).join("; ")),
            ],
          ]
        : [],
    ),
  );
  const modules = new Set(rows.map((row) => row[0]));
  return [
    `${rows.length} rules in ${modules.size} modules.`,
    table(["Module", "Selector", "Declarations"], rows),
  ].join("\n\n");
}

function show(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (value === undefined || typeof value !== "object" || value === null) return String(value);
  const entries = Object.entries(value);
  if (entries.length === 0) return "{}";
  const parts = entries.map(([key, inner]) => {
    const name = /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
    return `${name}: ${show(inner)}`;
  });
  return `{ ${parts.join(", ")} }`;
}

export function emitsBlock(): string {
  return STYLE_CASES.map(({ input, style }) => {
    const args = style === undefined ? show(input) : `${show(input)}, ${show(style)}`;
    return `- ${code(`styleAttributes(${args})`)} returns ${code(show(styleAttributes(input, style)))}.`;
  }).join("\n");
}

const CSS_FILES = {
  global: "src/styles/global.css",
  holo: "src/themes/holo.css",
  acid: "src/themes/acid.css",
  redline: "src/themes/redline.css",
};

export const THEME_EXTRA_VARS: readonly string[] = ["--font-family-mono"];

function themeClasses(): { name: string; file: string }[] {
  return Object.values(CSS_FILES).flatMap((file) =>
    topLevelRules(read(file)).flatMap((rule) =>
      rule.selector.split(",").flatMap((selector) => {
        const match = /^body\.(theme-[a-z]+)$/.exec(selector.trim());
        return match === null ? [] : [{ name: match[1]!, file }];
      }),
    ),
  );
}

export function themesBlock(): string {
  const themes = themeClasses();
  sameKeys(
    "THEME_NOTES",
    Object.keys(THEME_NOTES),
    themes.map((theme) => theme.name),
  );
  return table(
    ["Body class", "Stylesheet", "Description"],
    themes.map(({ name, file }) => [
      code(name),
      code(
        file.startsWith("src/styles/")
          ? `sacred-solid/${basename(file)}`
          : `sacred-solid/themes/${basename(file)}`,
      ),
      THEME_NOTES[name]!,
    ]),
  );
}

export function tintsBlock(): string {
  const tints = topLevelRules(read(CSS_FILES.global)).flatMap((rule) => {
    const match = /^body\.(tint-[a-z]+)$/.exec(rule.selector);
    return match === null ? [] : [[code(match[1]!), code(rule.declarations.get("--tint")!)]];
  });
  return `${tints.length} tints.\n\n${table(["Body class", "Value of --tint"], tints)}`;
}

function themeValuesBlock(theme: "holo" | "acid" | "redline"): string {
  const block = topLevelRules(read(CSS_FILES[theme])).find(
    (rule) => rule.selector === `body.theme-${theme}`,
  )!;
  const known = new Set([
    ...themeTokens.map((token) => THEME_VAR(token.name)),
    ...THEME_EXTRA_VARS,
  ]);
  for (const name of block.declarations.keys()) {
    if (!known.has(name)) throw new Error(`${theme} sets ${name}, not in the token table`);
  }
  const rows = [
    ...themeTokens.flatMap((token) => {
      const value = block.declarations.get(THEME_VAR(token.name));
      return value === undefined ? [] : [[code(THEME_VAR(token.name)), token.scope, code(value)]];
    }),
    ...THEME_EXTRA_VARS.flatMap((name) => {
      const value = block.declarations.get(name);
      return value === undefined ? [] : [[code(name), "font", code(value)]];
    }),
  ];
  const overridden = rows.filter((row) => row[1] === "constant").length;
  const extras = rows.filter((row) => row[1] === "font").length;
  return [
    `\`body.theme-${theme}\` sets ${rows.length - overridden - extras} per-theme roles and overrides ${overridden} constants${extras === 0 ? "" : ` and ${extras} font variable`}.`,
    table(["Variable", "Scope", "Value"], rows),
  ].join("\n\n");
}

export const holoValuesBlock = () => themeValuesBlock("holo");
export const acidValuesBlock = () => themeValuesBlock("acid");
export const redlineValuesBlock = () => themeValuesBlock("redline");

function slotsOf(text: string): string[] {
  const match = /export type \w+Slot = ([^;]+);/.exec(text);
  return match === null ? [] : [...match[1]!.matchAll(/"([\w-]+)"/g)].map((name) => name[1]!);
}

function classTags(text: string): string[] {
  const tags: string[] = [];
  for (const mark of text.matchAll(/\bprops\.class\b|\{\.\.\.props\}/g)) {
    const before = [...text.slice(0, mark.index).matchAll(/<([A-Za-z][\w.]*)(?=[\s>/])/g)].at(-1);
    if (before !== undefined && !tags.includes(before[1]!)) tags.push(before[1]!);
  }
  return tags;
}

export function classTargetsBlocks(): { targets: string; exempt: string } {
  const files = sourceFiles("src/components", /\.tsx$/).filter(
    (file) => !file.endsWith("ModalContext.tsx"),
  );
  const rows: string[][] = [];
  for (const file of files) {
    const name = basename(file, ".tsx");
    if (name in NO_ELEMENT_REASONS) continue;
    const text = read(file);
    if (!new RegExp(`export function ${name}\\b`).test(text)) continue;
    const tags = classTags(text);
    if (tags.length === 0) throw new Error(`${name} never reads props.class`);
    const slots = slotsOf(text);
    rows.push([
      code(name),
      codeList(tags.map((tag) => `<${tag}>`)),
      slots.length === 0 ? "none" : codeList(slots),
      CLASS_NOTES[name] ?? "",
    ]);
  }
  const staleNotes = Object.keys(CLASS_NOTES).filter(
    (name) => !rows.some((row) => row[0] === code(name)),
  );
  if (staleNotes.length > 0)
    throw new Error(`CLASS_NOTES names unknown components: ${staleNotes.join(", ")}`);
  return {
    targets: [
      `${rows.length} components take \`class\`. An uppercase tag is a component that receives it and passes it on.`,
      table(["Component", "`class` goes on", "`classes` parts", "Note"], rows),
    ].join("\n\n"),
    exempt: [
      `${Object.keys(NO_ELEMENT_REASONS).length} exported components render no element, so they take no \`class\`.`,
      table(
        ["Component", "Reason"],
        Object.entries(NO_ELEMENT_REASONS).map(([name, reason]) => [code(name), reason]),
      ),
    ].join("\n\n"),
  };
}

export function allBlocks(): Record<string, Blocks> {
  const { components, skipped } = componentsBlocks();
  const { targets, exempt } = classTargetsBlocks();
  return {
    "docs/reference/theme-tokens.md": { tokens: tokensBlock() },
    "docs/reference/aug-props.md": {
      "region-mixins": regionMixinsBlock(),
      "all-mixins": allMixinsBlock(),
      "flag-mixins": flagMixinsBlock(),
      "corner-options": cornerOptionsBlock(),
      "edge-options": edgeOptionsBlock(),
      "all-options": allOptionsBlock(),
      "surface-options": surfaceOptionsBlock(),
    },
    "docs/reference/components-with-aug.md": { components, skipped, strip: stripBlock() },
    "docs/reference/style-attributes.md": { emits: emitsBlock() },
    "docs/reference/class-targets.md": { targets, exempt },
    "docs/how-to/switch-and-write-a-theme.md": { "theme-checklist": themeChecklistBlock() },
    "docs/reference/themes.md": {
      themes: themesBlock(),
      tints: tintsBlock(),
      "holo-values": holoValuesBlock(),
      "acid-values": acidValuesBlock(),
      "redline-values": redlineValuesBlock(),
    },
  };
}

export function generate(): Map<string, string> {
  const result = new Map<string, string>();
  for (const [path, blocks] of Object.entries(allBlocks())) {
    result.set(path, fill(read(path), blocks));
  }
  return result;
}
