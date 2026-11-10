import { readFileSync, writeFileSync } from "node:fs";
import { generate } from "./aug/generate.ts";

const css = readFileSync("node_modules/augmented-ui/augmented-ui.css", "utf8");
writeFileSync("src/aug/mixins.generated.ts", generate(css));
