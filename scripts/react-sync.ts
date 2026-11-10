import { execFileSync, execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { classify, type Classified } from "./react-sync/classify.ts";

const ROOT = process.cwd();
const TRACKING_FILE = join(ROOT, "react-sync.json");
const WORK_DIR = join(ROOT, ".react-sync");
const SERVED_FILE = join(WORK_DIR, "served.json");
const REACT_REPO = resolve(process.env.REACT_REPO ?? join(ROOT, "../www-sacred"));

interface Tracking {
  repo: string;
  sha: string;
  version: string;
  syncedAt: string;
}

interface Change {
  status: "A" | "M" | "D" | "R";
  path: string;
  oldPath: string;
  info: Classified;
}

function run(args: string[]): Buffer {
  try {
    return execFileSync("git", ["-C", REACT_REPO, ...args], {
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const stderr = (error as { stderr?: Buffer }).stderr?.toString().trim();
    throw new Error(`git ${args.join(" ")} failed in ${REACT_REPO}${stderr ? `: ${stderr}` : ""}`);
  }
}

function git(args: string[]): string {
  return run(args).toString("utf8");
}

function gitOrNull(args: string[]): string | null {
  try {
    return git(args);
  } catch {
    return null;
  }
}

function readTracking(): Tracking {
  if (!existsSync(TRACKING_FILE)) throw new Error("react-sync.json is missing");
  return JSON.parse(readFileSync(TRACKING_FILE, "utf8")) as Tracking;
}

function resolveSha(ref: string): string {
  const sha = gitOrNull(["rev-parse", "--verify", `${ref}^{commit}`]);
  if (!sha) {
    throw new Error(
      `${ref} is not in ${REACT_REPO}. Run \`vpx scripts/react-sync.ts status --fetch\` first.`,
    );
  }
  return sha.trim();
}

function defaultTarget(): string {
  return gitOrNull(["rev-parse", "--verify", "origin/main"]) ? "origin/main" : "HEAD";
}

function packageAt(sha: string): { name: string; version: string; description: string } {
  return JSON.parse(git(["show", `${sha}:package.json`]));
}

function showBuffer(sha: string, path: string): Buffer {
  return run(["show", `${sha}:${path}`]);
}

function changesBetween(base: string, target: string): Change[] {
  const raw = git(["diff", "--name-status", "-M", base, target]).trim();
  if (!raw) return [];
  return raw.split("\n").map((line) => {
    const [code, first, second] = line.split("\t") as [string, string, string | undefined];
    const status = code[0] as Change["status"];
    const path = status === "R" ? second! : first;
    return { status, path, oldPath: first, info: classify(path) };
  });
}

function acknowledgeFetch(flags: Set<string>) {
  if (flags.has("--fetch")) git(["fetch", "origin"]);
}

function accordionTitles(sha: string, path: string, hunks: Array<{ start: number }>): string[] {
  const lines = git(["show", `${sha}:${path}`]).split("\n");
  const titles = new Set<string>();
  for (const { start } of hunks) {
    for (let i = Math.min(start, lines.length) - 1; i >= 0; i--) {
      const match = lines[i]!.match(/<Accordion\b[^>]*\btitle="([^"]+)"/);
      if (match) {
        titles.add(match[1]!);
        break;
      }
    }
  }
  return [...titles];
}

function pageHunks(base: string, target: string, path: string) {
  const diff = git(["diff", "-U0", base, target, "--", path]);
  const newSide = [...diff.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/gm)].map((m) => ({
    start: Number(m[1]),
  }));
  const oldSide = [...diff.matchAll(/^@@ -(\d+)(?:,\d+)? \+\d+(?:,\d+)? @@/gm)].map((m) => ({
    start: Number(m[1]),
  }));
  return { newSide, oldSide };
}

function sectionFileFor(title: string): string | null {
  const dir = join(ROOT, "playground");
  for (const name of readdirSync(dir)) {
    if (!/^section-\d+\.tsx$/.test(name)) continue;
    if (readFileSync(join(dir, name), "utf8").includes(`title="${title}"`))
      return `playground/${name}`;
  }
  return null;
}

function slug(path: string): string {
  return path.replaceAll("/", "__");
}

function status(flags: Set<string>, targetRef: string | undefined) {
  acknowledgeFetch(flags);
  const tracking = readTracking();
  const target = resolveSha(targetRef ?? defaultTarget());
  console.log(`react repo   ${REACT_REPO}`);
  console.log(
    `tracked      ${tracking.sha.slice(0, 12)} (version ${tracking.version}, synced ${tracking.syncedAt})`,
  );
  console.log(`target       ${target.slice(0, 12)} (version ${packageAt(target).version})`);
  if (target === tracking.sha) {
    console.log("up to date");
    return;
  }
  const ancestor = gitOrNull(["merge-base", "--is-ancestor", tracking.sha, target]) !== null;
  if (!ancestor)
    console.log(
      "WARNING: tracked sha is not an ancestor of target. History was rewritten; plan against a merge-base by hand.",
    );
  const log = git(["log", "--oneline", `${tracking.sha}..${target}`])
    .trim()
    .split("\n");
  console.log(`\n${log.length} commit(s) behind:`);
  console.log(log.slice(0, 40).join("\n"));
  if (log.length > 40) console.log(`... and ${log.length - 40} more`);
}

function plan(
  flags: Set<string>,
  targetRef: string | undefined,
): { tracking: Tracking; target: string; changes: Change[] } {
  acknowledgeFetch(flags);
  const tracking = readTracking();
  const target = resolveSha(targetRef ?? defaultTarget());
  const changes = changesBetween(tracking.sha, target);
  const diffDir = join(WORK_DIR, "diffs", target.slice(0, 12));
  rmSync(diffDir, { recursive: true, force: true });
  mkdirSync(diffDir, { recursive: true });

  const lines: string[] = [`# React ${tracking.sha.slice(0, 12)} -> ${target.slice(0, 12)}`, ""];
  const order = ["unmapped", "port", "page", "meta", "diverged", "copy", "ignore"] as const;
  for (const kind of order) {
    const group = changes.filter((c) => c.info.kind === kind);
    if (group.length === 0) continue;
    lines.push(`## ${kind} (${group.length})`);
    for (const change of group) {
      const arrow = change.status === "R" ? `${change.oldPath} -> ${change.path}` : change.path;
      const target_ = change.info.target ? ` => ${change.info.target}` : "";
      const note = change.info.note && kind !== "ignore" ? `  (${change.info.note})` : "";
      lines.push(`- ${change.status} ${arrow}${target_}${note}`);
      if (kind !== "ignore") {
        const diff = git(["diff", tracking.sha, target, "--", change.oldPath, change.path]);
        writeFileSync(join(diffDir, `${slug(change.path)}.diff`), diff);
      }
      if (change.path === "app/page.tsx" && change.status !== "D") {
        const { newSide, oldSide } = pageHunks(tracking.sha, target, change.path);
        const titles = new Set([
          ...accordionTitles(target, change.path, newSide),
          ...accordionTitles(tracking.sha, change.path, oldSide),
        ]);
        for (const title of titles) {
          lines.push(
            `    accordion "${title}" in ${sectionFileFor(title) ?? "no section yet (new accordion)"}`,
          );
        }
      }
    }
    lines.push("");
  }
  if (changes.length === 0) lines.push("No changes.");
  lines.push(`Diffs: ${diffDir}`);
  const text = lines.join("\n");
  writeFileSync(join(WORK_DIR, "plan.md"), text + "\n");
  console.log(text);
  return { tracking, target, changes };
}

function writeMeta(sha: string) {
  const pkg = packageAt(sha);
  const path = join(ROOT, "playground/meta.ts");
  const source = `export const PACKAGE = {
  name: ${JSON.stringify(pkg.name)},
  version: ${JSON.stringify(pkg.version)},
  description: ${JSON.stringify(pkg.description)},
} as const;
`;
  writeFileSync(path, source);
  execFileSync("vp", ["fmt", path], { stdio: "ignore" });
}

function apply(flags: Set<string>, targetRef: string | undefined) {
  const { target, changes } = plan(flags, targetRef);
  console.log("\n--- apply ---");

  for (const change of changes) {
    const { kind, target: dest } = change.info;
    if (kind !== "copy" || !dest) continue;
    const destPath = join(ROOT, dest);
    if (change.status === "D") {
      rmSync(destPath, { force: true });
      console.log(`deleted  ${dest}`);
      continue;
    }
    const oldDest = change.status === "R" ? classify(change.oldPath).target : null;
    if (oldDest && oldDest !== dest) rmSync(join(ROOT, oldDest), { force: true });
    mkdirSync(dirname(destPath), { recursive: true });
    writeFileSync(destPath, showBuffer(target, change.path));
    console.log(`wrote    ${dest}`);
  }

  if (changes.some((c) => c.info.kind === "meta")) {
    writeMeta(target);
    console.log("updated  playground/meta.ts");
  }

  const diverged = changes.filter((c) => c.info.kind === "diverged");
  for (const change of diverged) {
    console.log(`diverged ${change.info.target} (not written, diff saved)`);
  }
  const manual = changes.filter((c) => ["port", "page", "unmapped"].includes(c.info.kind));
  console.log(
    `\n${manual.length} file(s) still need a hand port. ${diverged.length} stylesheet(s) left alone because Solid owns them.`,
  );
}

function prepare(flags: Set<string>, targetRef: string | undefined) {
  acknowledgeFetch(flags);
  const target = resolveSha(targetRef ?? defaultTarget());
  const dir = join(tmpdir(), `sacred-react-${target.slice(0, 12)}`);
  if (!existsSync(join(dir, "package.json"))) {
    mkdirSync(dir, { recursive: true });
    execSync(
      `git -C ${JSON.stringify(REACT_REPO)} archive ${target} | tar -x -C ${JSON.stringify(dir)}`,
      {
        stdio: "inherit",
      },
    );
  }
  execSync("npm install", { cwd: dir, stdio: "inherit" });
  execSync("npx next build", { cwd: dir, stdio: "inherit" });
  mkdirSync(WORK_DIR, { recursive: true });
  writeFileSync(
    SERVED_FILE,
    JSON.stringify({ sha: target, dir, preparedAt: new Date().toISOString() }, null, 2),
  );
  console.log(
    `\nReact build of ${target.slice(0, 12)} is ready. Serve it with:\n  cd ${dir} && npx next start -p 10000`,
  );
}

function writeTracking(sha: string) {
  const next: Tracking = {
    repo: readTracking().repo,
    sha,
    version: packageAt(sha).version,
    syncedAt: new Date().toISOString().slice(0, 10),
  };
  writeFileSync(TRACKING_FILE, JSON.stringify(next, null, 2) + "\n");
  console.log(`react-sync.json now tracks ${sha.slice(0, 12)} (version ${next.version})`);
}

function newestMtime(dirs: string[]): number {
  let newest = 0;
  const walk = (path: string) => {
    const stat = statSync(path);
    if (stat.isDirectory()) {
      for (const name of readdirSync(path)) walk(join(path, name));
    } else {
      newest = Math.max(newest, stat.mtimeMs);
    }
  };
  for (const dir of dirs) if (existsSync(dir)) walk(dir);
  return newest;
}

function mark(flags: Set<string>, targetRef: string | undefined) {
  acknowledgeFetch(flags);
  const target = resolveSha(targetRef ?? defaultTarget());
  const tracking = readTracking();
  if (
    changesBetween(tracking.sha, target).every(
      (change) => change.info.kind === "ignore" || change.info.kind === "diverged",
    )
  ) {
    console.log("Only ignored or diverged files changed; nothing to verify.");
    writeTracking(target);
    return;
  }
  const problems: string[] = [];

  const served = existsSync(SERVED_FILE)
    ? (JSON.parse(readFileSync(SERVED_FILE, "utf8")) as { sha: string })
    : null;
  if (served?.sha !== target)
    problems.push(
      `.react-sync/served.json is not ${target.slice(0, 12)}; run \`prepare\` for that sha and capture the baseline from it`,
    );

  const baselineDir = join(ROOT, ".parity/baseline");
  const checkLog = join(ROOT, ".parity/check.log");
  if (!existsSync(checkLog) || !existsSync(baselineDir)) {
    problems.push(
      "no .parity baseline or check.log; run `vpx scripts/parity.ts baseline` then `check`",
    );
  } else {
    const lastLine = readFileSync(checkLog, "utf8").trim().split("\n").at(-1) ?? "";
    const summary = lastLine.match(/^parity: (\d+)\/(\d+) identical/);
    if (!summary || summary[1] !== summary[2]) problems.push(`parity is not clean: "${lastLine}"`);
    const logTime = statSync(checkLog).mtimeMs;
    if (
      logTime <
      newestMtime([join(ROOT, "src"), join(ROOT, "playground"), join(ROOT, "scripts/parity")])
    ) {
      problems.push(
        "check.log is older than the newest source change; rerun `vpx scripts/parity.ts check`",
      );
    }
    if (
      served &&
      statSync(baselineDir).mtimeMs <
        Date.parse(
          (JSON.parse(readFileSync(SERVED_FILE, "utf8")) as { preparedAt: string }).preparedAt,
        )
    ) {
      problems.push("the parity baseline predates the prepared React build; recapture it");
    }
  }

  if (problems.length > 0) {
    console.error(`refusing to move the tracked sha:\n- ${problems.join("\n- ")}`);
    process.exitCode = 1;
    return;
  }
  writeTracking(target);
}

const [command, ...rest] = process.argv.slice(2);
const flags = new Set(rest.filter((arg) => arg.startsWith("--")));
const targetRef = rest.find((arg) => !arg.startsWith("--"));

try {
  switch (command) {
    case "status":
      status(flags, targetRef);
      break;
    case "plan":
      plan(flags, targetRef);
      break;
    case "apply":
      apply(flags, targetRef);
      break;
    case "prepare":
      prepare(flags, targetRef);
      break;
    case "mark":
      mark(flags, targetRef);
      break;
    default:
      console.error(
        "usage: vpx scripts/react-sync.ts <status|plan|apply|prepare|mark> [ref] [--fetch]",
      );
      process.exitCode = 2;
  }
} catch (error) {
  console.error((error as Error).message);
  process.exitCode = 1;
}
