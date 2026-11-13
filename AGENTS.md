<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## sacred-solid

SolidJS port of `www-sacred` (SRCL). Read `README.md` first.

- `src/components/` mirrors `www-sacred/components/` file for file. Keep the look identical to the React original, which pixel parity checks. Interactive behavior (keyboard, focus, ARIA, popups, form values) comes from ui-sdk parts, so markup and behavior follow ui-sdk where a part exists and may differ from React. Never hand-write an interactive `role`. `tests/conventions.test.ts` enforces it. To make a caller's element a trigger, `spread` the part's props onto it in the part's `render`, as `DropdownMenuTrigger` does. The stylesheets are this port's own.
- Solid 2 (`solid-js` and `@solidjs/web`). Read `node_modules/solid-js/skills/solid-2.0/SKILL.md` before writing Solid code.
- Never destructure props. Use `omit` for rest spreads and `mergeDefaults` from `common/utilities.ts` for default props. Solid's `merge` lets an explicit `undefined` replace a default, React's default parameters do not. Style objects use kebab-case keys and explicit units. `tests/conventions.test.ts` enforces the silent ones.
- `src/index.ts` is generated: `vpx scripts/gen-index.ts`.
- `skills/sync-from-react/` is the skill that catches this port up to React head. `react-sync.json` pins the React commit the port matches. `.audit/port.tsv` is the decision log of the first port.
- CSS is owned here and may diverge from React. The `--theme-*` role tokens in `src/theme/tokens.ts` are the theming API. Stylesheets read only those names, `global.css` sets every per-theme role directly in each theme block, and line widths and shadow geometry are constants on `html, body`. `tests/theme-roles.test.ts` enforces it. Add or rename a role in the table first, then in `global.css`, `src/themes/holo.css`, `src/themes/acid.css` and `src/themes/redline.css`, then in the consumers, and delete the old name in the same change. Every component that renders an element takes `class`, merged with its own by `classNames` on the element that visually owns it (`tests/class-merge.test.tsx` and `docs/reference/class-targets.md` enforce it), and takes `classes` (a `SlotClasses` object) for its named parts. Every component takes `aug` and `theme` and spreads `styleAttributes(local, rest.style)` on its root. An element carrying `data-aug-border`, `data-aug-inlay` or `data-augmented-ui` loses its native line, fill or elevation through `:where()` rules at the end of its module, never through inherited variables. `vpx scripts/chrome-strip.ts` checks it in a browser. Every lib stylesheet lands in a `sacred.*` cascade layer, by `scripts/css-layers.ts` in the dev server, build and pack and by `scripts/pack-css.ts` for the shipped `global`, `global-fonts` and theme files. Write lib CSS flat and never add a layer or `!important` by hand, caller CSS is unlayered and wins. `vpx scripts/check-layers.ts` checks it in a browser.
- Pixel parity against the React baseline (`vpx scripts/parity.ts check`) is the regression gate for refactors that must not change anything visible. A visual change to CSS is allowed on purpose, so say so and recapture the affected baseline slices.
- `scripts/react-sync.ts apply` reports React stylesheet changes as `diverged` and never writes them. Carry the intent over by hand with role tokens.
- Use `BodyPortal` for overlays. It is Solid's `Portal` on `document.body`, which registers the body for delegated events. Content inserted into `body` by hand gets no event handlers.
- Documentation lives in `docs/`, start at `docs/README.md`.
- A change to the behavior of `aug`, the theme tokens or `Surface` must update the matching docs page in the same change. `vpx scripts/gen-docs.ts` rewrites the generated tables, and `tests/docs.test.ts` fails on stale tables, broken links and code blocks that do not compile.
- A literal `{" "}` in Solid JSX merges into neighboring text and shifts layout by a sub-pixel. Use `SPACE` from `common/utilities.ts` where React's separate text node matters.

## ui-sdk

Before using ui-sdk, follow the ui-sdk skill if it is installed, and read `node_modules/@ui-sdk/solid/docs/llms.txt`. To build a new component, also search `node_modules/@ui-sdk/solid/docs/core.md` by heading, and read `node_modules/@ui-sdk/solid/docs/rendering.md`.
