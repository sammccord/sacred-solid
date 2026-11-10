import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return tsxFiles(path);
    return entry.name.endsWith(".tsx") ? [path] : [];
  });
}

const lines = tsxFiles("src/components")
  .sort()
  .map((file) => {
    const source = readFileSync(file, "utf8");
    const values = [...source.matchAll(/^export (?:function|const) (\w+)/gm)].map((m) => m[1]);
    const types = [...source.matchAll(/^export (?:interface|type) (\w+)/gm)].map(
      (m) => `type ${m[1]}`,
    );
    const names = [...values, ...types].sort((a, b) =>
      a.replace("type ", "").localeCompare(b.replace("type ", "")),
    );
    return `export { ${names.join(", ")} } from "./${relative("src", file)}";`;
  });

lines.push(
  'export type * from "./aug/index.ts";',
  'export * from "./style/index.ts";',
  'export * from "./theme/tokens.ts";',
  'export * from "./modules/hotkeys/index.ts";',
  'export * as Utilities from "./common/utilities.ts";',
  'export * as Constants from "./common/constants.ts";',
);

writeFileSync("src/index.ts", lines.join("\n") + "\n");
