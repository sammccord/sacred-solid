import { createHash } from "node:crypto";
import solidRolldown from "rolldown-plugin-solid";
import solid from "vite-plugin-solid";
import { defineConfig } from "vite-plus";
import { sacredLayers } from "./scripts/css-layers.ts";
import { finishPackCss } from "./scripts/pack-css.ts";

export default defineConfig({
  plugins: [sacredLayers(), solid()],
  css: {
    modules: {
      generateScopedName: (local, filename) => {
        const hash = createHash("sha1").update(filename).digest("base64url").slice(0, 6);
        return `${/^[\d-]/.test(hash) ? `_${hash.slice(1)}` : hash}_${local}`;
      },
    },
  },
  build: {
    outDir: "playground-dist",
    rollupOptions: {
      input: {
        main: "index.html",
        "concept-1": "concept-1/index.html",
        "concept-2": "concept-2/index.html",
        aug: "aug/index.html",
        hacking: "hacking/index.html",
        journal: "journal/index.html",
        layers: "layers/index.html",
        "aug-strip": "aug/strip/index.html",
      },
    },
  },
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    entry: ["src/index.ts"],
    plugins: [sacredLayers(), solidRolldown()],
    deps: {
      alwaysBundle: ["augmented-ui/augmented-ui.min.css"],
      onlyBundle: ["augmented-ui"],
      resolveDepSubpath: true,
    },
    dts: {
      generator: "tsgo",
    },
    onSuccess: () => finishPackCss(),
    exports: {
      customExports: (exports) => ({
        ...exports,
        "./global.css": "./dist/styles/global.css",
        "./global-fonts.css": "./dist/styles/global-fonts.css",
        "./themes/holo.css": "./dist/themes/holo.css",
        "./themes/acid.css": "./dist/themes/acid.css",
        "./themes/redline.css": "./dist/themes/redline.css",
      }),
    },
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns: [
      "src/**/*.css",
      "src/aug/mixins.generated.ts",
      "CHANGELOG.md",
      ".changeset/*.md",
    ],
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
