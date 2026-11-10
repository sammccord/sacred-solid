import { resolve } from "node:path";
import { expect, test } from "vite-plus/test";
import {
  APP_LAYER_ORDER,
  LAYER_ORDER,
  LAYERS,
  layerFor,
  wrapInLayer,
} from "../scripts/css-layers.ts";

const at = (path: string) => resolve(import.meta.dirname, "..", path);

test("every lib stylesheet maps to one layer", () => {
  expect(layerFor(at("node_modules/augmented-ui/augmented-ui.min.css"))).toBe("sacred.vendor");
  expect(layerFor(at("src/aug/aug.css"))).toBe("sacred.aug");
  expect(layerFor(at("src/styles/global.css"))).toBe("sacred.base");
  expect(layerFor(at("src/styles/global-fonts.css"))).toBe("sacred.base");
  expect(layerFor(at("src/themes/holo.css"))).toBe("sacred.themes");
  expect(layerFor(at("src/components/Panel.module.css"))).toBe("sacred.components");
  expect(layerFor(at("src/components/modals/ModalAlert.module.css"))).toBe("sacred.components");
});

test("playground css sits in app layers, page after hud", () => {
  expect(layerFor(at("playground/hud/hud.module.css"))).toBe("app.hud");
  expect(layerFor(at("playground/hacking/hacking.module.css"))).toBe("app.page");
  expect(layerFor(at("playground/journal/journal.module.css"))).toBe("app.page");
});

test("caller css stays unlayered", () => {
  expect(layerFor(at("layers/index.html"))).toBeUndefined();
  expect(layerFor(at("src/components/Panel.tsx"))).toBeUndefined();
});

test("the order puts themes after base and the vendor sheet first", () => {
  expect(LAYERS[0]).toBe("sacred.vendor");
  expect(LAYERS.indexOf("sacred.themes")).toBeGreaterThan(LAYERS.indexOf("sacred.base"));
  expect(LAYERS.indexOf("sacred.components")).toBeGreaterThan(LAYERS.indexOf("sacred.aug"));
});

test("wrapInLayer states the order first and keeps the source inside one block", () => {
  const wrapped = wrapInLayer(".a { color: red; }", "sacred.components");
  expect(wrapped.startsWith(`${LAYER_ORDER}\n@layer sacred.components {\n`)).toBe(true);
  expect(wrapped).toContain(".a { color: red; }");
  expect(wrapped.trimEnd().endsWith("}")).toBe(true);
});

test("an app layer states sacred first so import order cannot put app before the lib", () => {
  const wrapped = wrapInLayer(".a { color: red; }", "app.page");
  expect(APP_LAYER_ORDER).toBe("@layer sacred, app.hud, app.page;");
  expect(wrapped.startsWith(`${APP_LAYER_ORDER}\n@layer app.page {\n`)).toBe(true);
});
