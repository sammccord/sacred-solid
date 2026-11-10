export type Kind = "diverged" | "copy" | "port" | "page" | "meta" | "ignore" | "unmapped";

export interface Classified {
  kind: Kind;
  target: string | null;
  note?: string;
}

interface Rule {
  test: RegExp;
  kind: Kind;
  target?: (match: RegExpMatchArray) => string;
  note?: string;
}

const HOTKEY_RENAMES: Record<string, { file: string; note?: string }> = {
  "use-hotkeys.ts": { file: "create-hotkeys.ts" },
  "use-record-hotkeys.ts": { file: "create-record-hotkeys.ts" },
  "use-deep-equal-memo.ts": {
    file: "create-hotkeys.ts",
    note: "no file of its own in Solid, it became the createMemo equals option",
  },
  "bound-hotkeys-proxy-provider.tsx": {
    file: "hotkeys-provider.tsx",
    note: "merged into the single hotkeys context",
  },
};

const STYLESHEET_NOTE =
  "stylesheets are owned here and use the --theme-* role tokens; read the diff, carry the intent over by hand, never overwrite";

const RULES: Rule[] = [
  { test: /^components\/__tests__\//, kind: "ignore", note: "React catalog sync guards" },
  { test: /^components\/AGENTS\.md$/, kind: "ignore" },
  {
    test: /^components\/DefaultMetaTags\.tsx$/,
    kind: "ignore",
    note: "tags live in the playground index.html files",
  },
  {
    test: /^components\/(.+\.module\.css)$/,
    kind: "diverged",
    target: (m) => `src/components/${m[1]}`,
    note: STYLESHEET_NOTE,
  },
  {
    test: /^components\/(.+\.tsx)$/,
    kind: "port",
    target: (m) => `src/components/${m[1]}`,
  },
  {
    test: /^common\/queries\.ts$/,
    kind: "ignore",
    note: "API client, no component uses it",
  },
  {
    test: /^common\/(utilities|constants|position)\.ts$/,
    kind: "port",
    target: (m) => `src/common/${m[1]}.ts`,
    note: "the Solid copy is trimmed to what components use; check whether the React change touches a deleted helper",
  },
  {
    test: /^modules\/hotkeys\/([^/]+)$/,
    kind: "port",
    target: (m) => `src/modules/hotkeys/${HOTKEY_RENAMES[m[1]!]?.file ?? m[1]}`,
    note: "createHotkeys port, not a line-for-line copy",
  },
  {
    test: /^modules\/(cors|vary|object-assign)\.ts$/,
    kind: "ignore",
    note: "Node helpers for the Next routes",
  },
  {
    test: /^global\.css$/,
    kind: "diverged",
    target: () => "src/styles/global.css",
    note: STYLESHEET_NOTE,
  },
  {
    test: /^global-fonts\.css$/,
    kind: "diverged",
    target: () => "src/styles/global-fonts.css",
    note: STYLESHEET_NOTE,
  },
  { test: /^public\/(.+)$/, kind: "copy", target: (m) => `public/${m[1]}` },
  {
    test: /^app\/page\.tsx$/,
    kind: "page",
    target: () => "playground/section-*.tsx",
    note: "the kitchen sink, split by accordion across playground/section-N.tsx",
  },
  {
    test: /^app\/concept-([12])\/page\.tsx$/,
    kind: "page",
    target: (m) => `playground/concept-${m[1]}.tsx`,
  },
  {
    test: /^package\.json$/,
    kind: "meta",
    target: () => "playground/meta.ts",
    note: "name, version, description only",
  },
  {
    test: /^app\/layout\.tsx$/,
    kind: "ignore",
    note: "Providers wiring, already in playground/main.tsx",
  },
  { test: /^app\/concept-[12]\/(layout|head)\.tsx$/, kind: "ignore" },
  {
    test: /^app\/(head\.tsx|robots\.ts|sitemap\.ts|manifest\.ts|llms.*|llm\/.*|_lib\/.*)$/,
    kind: "ignore",
    note: "Next routes and doc serving",
  },
  {
    test: /^(scripts|skills)\//,
    kind: "ignore",
    note: "Simulacrum CLI, Python mirror and React-side skills",
  },
  { test: /(^|\/)[^/]*\.md$/, kind: "ignore" },
  {
    test: /^(\.gitignore|\.prettierrc|LICENSE\.md|next-env\.d\.ts|next\.config\.ts|tsconfig\.json|tsconfig\.tsbuildinfo|vitest\.config\.mjs|package-lock\.json)$/,
    kind: "ignore",
    note: "React toolchain config",
  },
];

export function classify(path: string): Classified {
  for (const rule of RULES) {
    const match = path.match(rule.test);
    if (!match) continue;
    const hotkeyNote =
      rule.kind === "port" && path.startsWith("modules/hotkeys/")
        ? HOTKEY_RENAMES[path.split("/").pop()!]?.note
        : undefined;
    return {
      kind: rule.kind,
      target: rule.target ? rule.target(match) : null,
      note: hotkeyNote ?? rule.note,
    };
  }
  return {
    kind: "unmapped",
    target: null,
    note: "no rule matches; decide, then add a rule to scripts/react-sync/classify.ts",
  };
}
