export interface Rule {
  selector: string;
  declarations: Map<string, string>;
}

export function topLevelRules(css: string): Rule[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: Rule[] = [];
  let depth = 0;
  let selector = "";
  let body = "";
  for (const char of text) {
    if (char === "{") depth++;
    else if (char === "}") depth--;
    if (depth === 0 && char === "}") {
      const declarations = new Map<string, string>();
      for (const part of body.split(";")) {
        const colon = part.indexOf(":");
        if (colon > 0 && !part.includes("{") && !part.includes("}")) {
          declarations.set(part.slice(0, colon).trim(), part.slice(colon + 1).trim());
        }
      }
      rules.push({ selector: selector.replace(/\s+/g, " ").trim(), declarations });
      selector = "";
      body = "";
    } else if (depth === 0) selector += char;
    else if (!(depth === 1 && char === "{")) body += char;
  }
  return rules;
}
