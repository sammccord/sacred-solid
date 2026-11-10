export interface Fence {
  info: string;
  lang: string;
  code: string;
  line: number;
}

export interface Link {
  target: string;
  line: number;
}

const FENCE = /^(\s*)(`{3,})(.*)$/;

export function table(headers: string[], rows: string[][]): string {
  const cells = rows.map((row) => row.map(escapeCell));
  const widths = headers.map((header, column) =>
    Math.max(3, header.length, ...cells.map((row) => row[column]!.length)),
  );
  const line = (row: string[]) =>
    `| ${row.map((cell, column) => cell.padEnd(widths[column]!)).join(" | ")} |`;
  return [
    line(headers),
    `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`,
    ...cells.map(line),
  ].join("\n");
}

function escapeCell(cell: string): string {
  return cell.replaceAll("|", "\\|");
}

export function code(text: string): string {
  return `\`${text}\``;
}

export function codeList(items: readonly string[]): string {
  return items.map(code).join(", ");
}

export function fences(markdown: string): Fence[] {
  const found: Fence[] = [];
  const lines = markdown.split("\n");
  for (let index = 0; index < lines.length; index++) {
    const open = FENCE.exec(lines[index]!);
    if (open === null) continue;
    const indent = open[1]!.length;
    const ticks = open[2]!;
    const info = open[3]!.trim();
    const body: string[] = [];
    let end = index + 1;
    const margin = new RegExp(`^\\s{0,${indent}}`);
    while (end < lines.length && !lines[end]!.trimStart().startsWith(ticks)) {
      body.push(lines[end++]!.replace(margin, ""));
    }
    found.push({ info, lang: info.split(/\s+/)[0] ?? "", code: body.join("\n"), line: index + 1 });
    index = end;
  }
  return found;
}

export function proseLines(markdown: string): { text: string; line: number }[] {
  const result: { text: string; line: number }[] = [];
  let fence: string | undefined;
  for (const [index, text] of markdown.split("\n").entries()) {
    const open = FENCE.exec(text);
    if (fence === undefined && open !== null) fence = open[2];
    else if (fence !== undefined && text.trimStart().startsWith(fence)) fence = undefined;
    else if (fence === undefined) result.push({ text, line: index + 1 });
  }
  return result;
}

export function links(markdown: string): Link[] {
  return proseLines(markdown).flatMap(({ text, line }) =>
    [...text.replace(/`[^`]*`/g, "").matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map((match) => ({
      target: match[1]!,
      line,
    })),
  );
}

export function slug(heading: string): string {
  return heading
    .replace(/`/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 _-]/g, "")
    .replace(/ /g, "-");
}

export function anchors(markdown: string): Set<string> {
  const seen = new Map<string, number>();
  const found = new Set<string>();
  for (const { text } of proseLines(markdown)) {
    const heading = /^#{1,6}\s+(.*?)\s*#*$/.exec(text);
    if (heading === null) continue;
    const base = slug(heading[1]!);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    found.add(count === 0 ? base : `${base}-${count}`);
  }
  return found;
}

export type Blocks = Record<string, string>;

const MARKER = /<!-- generated:(start|end) ([a-z0-9-]+) -->/g;

export function blockNames(markdown: string): string[] {
  return [...markdown.matchAll(MARKER)].filter((m) => m[1] === "start").map((m) => m[2]!);
}

export function fill(markdown: string, blocks: Blocks): string {
  let result = markdown;
  for (const [name, body] of Object.entries(blocks)) {
    const start = `<!-- generated:start ${name} -->`;
    const end = `<!-- generated:end ${name} -->`;
    const from = result.indexOf(start);
    const to = result.indexOf(end);
    if (from < 0 || to < from) throw new Error(`block ${name} has no start and end marker`);
    result = `${result.slice(0, from + start.length)}\n\n${body.trim()}\n\n${result.slice(to)}`;
  }
  return result;
}
