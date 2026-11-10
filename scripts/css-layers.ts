import { relative, resolve, sep } from "node:path";
import type { Plugin } from "vite-plus";

export const LAYERS = [
  "sacred.vendor",
  "sacred.base",
  "sacred.aug",
  "sacred.components",
  "sacred.themes",
] as const;

export const APP_LAYERS = ["app.hud", "app.page"] as const;

export type Layer = (typeof LAYERS)[number] | (typeof APP_LAYERS)[number];

export const LAYER_ORDER = `@layer ${LAYERS.join(", ")};`;
export const APP_LAYER_ORDER = `@layer sacred, ${APP_LAYERS.join(", ")};`;

const ROOT = resolve(import.meta.dirname, "..");

export function layerFor(file: string): Layer | undefined {
  const path = file.split("?")[0]!;
  if (!path.endsWith(".css")) return undefined;
  if (path.includes(`${sep}node_modules${sep}augmented-ui${sep}`)) return "sacred.vendor";
  const from = relative(ROOT, path);
  if (from.startsWith("..")) return undefined;
  if (from.startsWith(`playground${sep}hud${sep}`)) return "app.hud";
  if (from.startsWith(`playground${sep}`)) return "app.page";
  if (from === `src${sep}aug${sep}aug.css`) return "sacred.aug";
  if (from.startsWith(`src${sep}styles${sep}`)) return "sacred.base";
  if (from.startsWith(`src${sep}themes${sep}`)) return "sacred.themes";
  if (from.startsWith(`src${sep}components${sep}`) && path.endsWith(".module.css")) {
    return "sacred.components";
  }
  return undefined;
}

export function wrapInLayer(css: string, layer: Layer): string {
  const order = layer.startsWith("app.") ? APP_LAYER_ORDER : LAYER_ORDER;
  return `${order}\n@layer ${layer} {\n${css}\n}\n`;
}

export function sacredLayers(): Plugin {
  return {
    name: "sacred-layers",
    enforce: "pre",
    transform(code, id) {
      const layer = layerFor(id);
      return layer === undefined ? undefined : { code: wrapInLayer(code, layer), map: null };
    },
  };
}
