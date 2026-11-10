import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { expect, test } from "vite-plus/test";
import { topLevelRules } from "../scripts/docs/css.ts";
import { TOKEN_MEANINGS } from "../scripts/docs/descriptions.ts";
import { allBlocks } from "../scripts/docs/generate.ts";
import { anchors, blockNames, fences, links, proseLines } from "../scripts/docs/markdown.ts";
import { themeTokens } from "../src/theme/tokens.ts";

const ROOT = resolve(import.meta.dirname, "..");
const MIGRATION_PAGE = "docs/how-to/migrate-from-the-old-tokens.md";
const LEGACY_NAME_PAGES = [MIGRATION_PAGE, "docs/explanation/why-role-tokens.md"];
const MAX_NO_CHECK_BLOCKS = 2;

function markdownFiles(): string[] {
  const inDocs = readdirSync(join(ROOT, "docs"), { recursive: true, encoding: "utf8" })
    .filter((path) => path.endsWith(".md"))
    .map((path) => join("docs", path));
  return [...inDocs, "README.md"].toSorted();
}

const pages = markdownFiles().map((path) => ({
  path,
  text: readFileSync(join(ROOT, path), "utf8"),
}));

test("docs/README.md links to every other page in docs", () => {
  const index = pages.find((page) => page.path === "docs/README.md")!;
  const linked = new Set(
    links(index.text).map((link) => resolve(ROOT, "docs", link.target.split("#")[0]!)),
  );
  const unlinked = pages
    .filter((page) => page.path.startsWith("docs/") && page.path !== "docs/README.md")
    .filter((page) => !linked.has(join(ROOT, page.path)))
    .map((page) => page.path);
  expect(unlinked).toEqual([]);
});

test("scripts/gen-docs.ts --check finds no stale generated block", () => {
  const run = spawnSync(process.execPath, ["scripts/gen-docs.ts", "--check"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  expect(run.stderr).toBe("");
  expect(run.status).toBe(0);
});

test("every generated marker pair in the docs is filled by the generator", () => {
  const generated = allBlocks();
  for (const page of pages) {
    const found = blockNames(page.text).toSorted();
    const filled = Object.keys(generated[page.path] ?? {}).toSorted();
    expect(found, page.path).toEqual(filled);
    for (const name of found) {
      expect(page.text, `${page.path} ${name}`).toContain(`<!-- generated:end ${name} -->`);
    }
  }
});

test("every token has a meaning and every meaning has a token", () => {
  expect(Object.keys(TOKEN_MEANINGS).toSorted()).toEqual(
    themeTokens.map((token) => token.name).toSorted(),
  );
});

function linkProblems(): string[] {
  const problems: string[] = [];
  const anchorCache = new Map<string, Set<string>>();
  const anchorsOf = (path: string) => {
    const cached = anchorCache.get(path);
    if (cached !== undefined) return cached;
    const found = anchors(readFileSync(path, "utf8"));
    anchorCache.set(path, found);
    return found;
  };
  for (const page of pages) {
    for (const { target, line } of links(page.text)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
      const [file = "", anchor] = target.split("#");
      const resolved =
        file === "" ? join(ROOT, page.path) : resolve(ROOT, dirname(page.path), file);
      const where = `${page.path}:${line} ${target}`;
      if (!existsSync(resolved)) problems.push(`${where} points at a missing file`);
      else if (
        anchor !== undefined &&
        resolved.endsWith(".md") &&
        !anchorsOf(resolved).has(anchor)
      ) {
        problems.push(`${where} points at a missing heading`);
      }
    }
  }
  return problems;
}

test("every relative link and anchor resolves", () => {
  expect(linkProblems()).toEqual([]);
});

const NOT_CHECKED = "no-check";

function codeBlocks() {
  return pages.flatMap((page) =>
    fences(page.text)
      .filter((fence) => fence.lang === "ts" || fence.lang === "tsx")
      .map((fence) => ({
        ...fence,
        page: page.path,
        checked: !fence.info.split(/\s+/).includes(NOT_CHECKED),
      })),
  );
}

test("no-check blocks stay rare", () => {
  const skipped = codeBlocks().filter((block) => !block.checked);
  expect(skipped.length).toBeLessThanOrEqual(MAX_NO_CHECK_BLOCKS);
});

test("every ts and tsx block compiles under the repo settings", () => {
  const blocks = codeBlocks().filter((block) => block.checked);
  expect(blocks.length).toBeGreaterThan(20);
  const dir = mkdtempSync(join(ROOT, ".docs-check-"));
  try {
    const names = new Map<string, string>();
    for (const block of blocks) {
      const inComponents = block.code.includes('from "../');
      const folder = inComponents ? "components" : "pages";
      mkdirSync(join(dir, folder), { recursive: true });
      const slug = block.page.replace(/[^a-z0-9]+/gi, "-");
      const name = `${folder}/${slug}-L${block.line}.${block.lang}`;
      writeFileSync(join(dir, name), `${block.code}\n`);
      names.set(name, `${block.page}:${block.line}`);
    }
    writeFileSync(
      join(dir, "tsconfig.json"),
      JSON.stringify({
        extends: "../tsconfig.json",
        compilerOptions: {
          rootDirs: ["../src", "."],
          paths: { "sacred-solid": ["../src/index.ts"] },
        },
        include: ["./**/*.ts", "./**/*.tsx"],
      }),
    );
    const run = spawnSync(join(ROOT, "node_modules/.bin/tsc"), ["-p", dir, "--pretty", "false"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    const problems = run.stdout
      .split("\n")
      .filter((line) => line.includes("error TS"))
      .map((line) => {
        const match = /^(.*?)\((\d+),\d+\): (.*)$/.exec(line);
        if (match === null) return line;
        const file = relative(dir, resolve(ROOT, match[1]!));
        const origin = names.get(file) ?? file;
        const [path, start] = origin.split(":");
        return `${path}:${Number(start) + Number(match[2])} ${match[3]}`;
      });
    expect(problems).toEqual([]);
    expect(run.status).toBe(0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}, 120_000);

const BANNED_CHARACTERS = [0x2014, 0x2013, 0x2018, 0x2019, 0x201c, 0x201d].map((point) =>
  String.fromCodePoint(point),
);

test("docs and README use no long dash and no curly quote", () => {
  const found = pages.flatMap((page) =>
    page.text
      .split("\n")
      .flatMap((text, index) =>
        BANNED_CHARACTERS.filter((char) => text.includes(char)).map(
          (char) => `${page.path}:${index + 1} has U+${char.codePointAt(0)!.toString(16)}`,
        ),
      ),
  );
  expect(found).toEqual([]);
});

const BANNED_WORDS =
  /\b(simply|easy|easily|quickly|robust|seamless|seamlessly|leverage|utilize|powerful|comprehensive)\b/i;

test("docs and README prose avoid filler words", () => {
  const found = pages.flatMap((page) =>
    proseLines(page.text)
      .filter(({ text }) => BANNED_WORDS.test(text))
      .map(({ text, line }) => `${page.path}:${line} ${BANNED_WORDS.exec(text)![0]}`),
  );
  expect(found).toEqual([]);
});

test("every --theme-* name in the docs is in the token table", () => {
  const known = new Set([
    "--theme-line-height-base",
    ...themeTokens.map((token) => `--theme-${token.name}`),
  ]);
  const unknown = pages
    .filter((page) => !LEGACY_NAME_PAGES.includes(page.path))
    .flatMap((page) =>
      [...page.text.matchAll(/--theme-[a-z][a-z0-9-]*[a-z0-9](?!\*)/g)]
        .map((match) => match[0])
        .filter((name) => !known.has(name))
        .map((name) => `${page.path} uses ${name}`),
    );
  expect(unknown).toEqual([]);
});

test("css theme blocks in the docs set every per-theme role with a literal", () => {
  const roles = themeTokens
    .filter((token) => token.scope === "theme")
    .map((token) => `--theme-${token.name}`);
  const blocks = pages.flatMap((page) =>
    fences(page.text)
      .filter((fence) => fence.info === "css theme")
      .map((fence) => ({ where: `${page.path}:${fence.line}`, rules: topLevelRules(fence.code) })),
  );
  expect(blocks.length).toBeGreaterThan(0);
  for (const { where, rules } of blocks) {
    expect(rules, where).toHaveLength(1);
    const declarations = rules[0]!.declarations;
    expect(
      roles.filter((role) => !declarations.has(role)),
      where,
    ).toEqual([]);
    expect(
      [...declarations].filter(([, value]) => value.includes("var(--theme-")),
      where,
    ).toEqual([]);
  }
});

test("the migration page has a row for every renamed token in the audit log", () => {
  const current = new Set(themeTokens.map((token) => `--theme-${token.name}`));
  const log = readFileSync(join(ROOT, ".audit/theme-roles.tsv"), "utf8").split("\n").slice(1);
  const pairs = new Set<string>();
  for (const row of log) {
    const decision = row.split("\t")[2] ?? "";
    const match = /^(?:var\()?(--[a-z-]+)\)? -> (--theme-[a-z-]+)$/.exec(decision);
    if (match !== null && !current.has(match[1]!)) pairs.add(`${match[1]} ${match[2]}`);
  }
  expect(pairs.size).toBeGreaterThan(20);
  const page = pages.find((entry) => entry.path === MIGRATION_PAGE)!;
  const rows = page.text.split("\n").filter((line) => line.startsWith("|"));
  const missing = [...pairs].filter((pair) => {
    const [from, to] = pair.split(" ");
    return !rows.some((row) => row.includes(`\`${from}\``) && row.includes(`\`${to}\``));
  });
  expect(missing).toEqual([]);
});
