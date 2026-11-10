import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { LAYER_ORDER, layerFor, wrapInLayer } from "./css-layers.ts";

const SHIPPED = ["src/styles", "src/themes"];

export async function finishPackCss(outDir = "dist") {
  const bundlePath = join(outDir, "style.css");
  const bundle = await readFile(bundlePath, "utf8");
  const [, ...rest] = bundle.split(`${LAYER_ORDER}\n`);
  await writeFile(bundlePath, `${LAYER_ORDER}\n${rest.join("")}`);

  for (const dir of SHIPPED) {
    const target = join(outDir, dir.replace("src/", ""));
    await mkdir(target, { recursive: true });
    for (const name of await readdir(dir)) {
      const layer = layerFor(resolve(dir, name));
      if (layer === undefined) continue;
      const css = await readFile(join(dir, name), "utf8");
      await writeFile(join(target, name), wrapInLayer(css, layer));
    }
  }
}
