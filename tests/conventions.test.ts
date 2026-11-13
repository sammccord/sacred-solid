import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vite-plus/test";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

const banned: Array<[string, RegExp]> = [
  ["React import", /from\s+["']react(-dom)?(\/[^"']*)?["']/],
  ["React namespace", /\bReact\.[A-Z]/],
  ["className attribute", /\bclassName=/],
  ["htmlFor attribute", /\bhtmlFor=/],
  ["React hook", /\buse(State|Effect|LayoutEffect|Ref|Callback|Memo|Reducer)\(/],
  ["dangerouslySetInnerHTML", /dangerouslySetInnerHTML/],
  ["camelCase style key", /style=\{\{[^}]*?\b[a-z]+[A-Z]\w*\s*:/s],
  [
    "numeric px style (React auto-px does not exist in Solid)",
    /style=\{\{[^}]*?\b(width|height|top|left|right|bottom|margin\w*|padding\w*|"(?:margin|padding)-\w+"|"(?:min|max)-(?:width|height)"|"font-size")\s*:\s*\d+\s*[,}]/s,
  ],
  ["ts-ignore", /@ts-(ignore|nocheck)/],
  ["use client directive", /["']use client["']/],
  ["key prop", /\skey=\{/],
  [
    "merge with a defaults literal (an explicit undefined wins, use mergeDefaults)",
    /\bmerge\(\s*\{/,
  ],
  [
    'aria boolean bound to a boolean (false removes the attribute, pass "true" or "false")',
    /aria-(?:expanded|selected|checked|pressed|hidden|disabled)=\{(?![^}]*\?\s*"true"\s*:\s*"false")[^}"]*\}/,
  ],
];

const files = sourceFiles("src");

test.each(banned)("src has no %s", (_name, pattern) => {
  const offenders = files.filter((file) => pattern.test(readFileSync(file, "utf8")));
  expect(offenders).toEqual([]);
});
