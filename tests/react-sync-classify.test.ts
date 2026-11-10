import { expect, test } from "vite-plus/test";
import { classify } from "../scripts/react-sync/classify.ts";

test.each([
  ["components/Button.tsx", "port", "src/components/Button.tsx"],
  ["components/modals/ModalError.tsx", "port", "src/components/modals/ModalError.tsx"],
  ["components/Button.module.css", "diverged", "src/components/Button.module.css"],
  ["components/examples/AS400.module.css", "diverged", "src/components/examples/AS400.module.css"],
  ["global.css", "diverged", "src/styles/global.css"],
  ["global-fonts.css", "diverged", "src/styles/global-fonts.css"],
  ["common/utilities.ts", "port", "src/common/utilities.ts"],
  ["modules/hotkeys/use-hotkeys.ts", "port", "src/modules/hotkeys/create-hotkeys.ts"],
  ["modules/hotkeys/use-record-hotkeys.ts", "port", "src/modules/hotkeys/create-record-hotkeys.ts"],
  [
    "modules/hotkeys/bound-hotkeys-proxy-provider.tsx",
    "port",
    "src/modules/hotkeys/hotkeys-provider.tsx",
  ],
  ["modules/hotkeys/parse-hotkeys.ts", "port", "src/modules/hotkeys/parse-hotkeys.ts"],
  ["public/favicon.ico", "copy", "public/favicon.ico"],
  ["app/page.tsx", "page", "playground/section-*.tsx"],
  ["app/concept-2/page.tsx", "page", "playground/concept-2.tsx"],
  ["package.json", "meta", "playground/meta.ts"],
])("%s -> %s %s", (path, kind, target) => {
  expect(classify(path)).toMatchObject({ kind, target });
});

test.each([
  "components/__tests__/font_sync.test.mjs",
  "components/AGENTS.md",
  "components/DefaultMetaTags.tsx",
  "common/queries.ts",
  "modules/cors.ts",
  "app/llm/[...path]/route.ts",
  "app/layout.tsx",
  "scripts/cli/lib/app.ts",
  "skills/fast-typescript-check/SKILL.md",
  "README.md",
  "tsconfig.tsbuildinfo",
])("%s is ignored", (path) => {
  expect(classify(path).kind).toBe("ignore");
});

test("a path no rule covers is unmapped, never silently ignored", () => {
  expect(classify("widgets/New.tsx").kind).toBe("unmapped");
  expect(classify("components2/Thing.tsx").kind).toBe("unmapped");
});
