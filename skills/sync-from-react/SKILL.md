---
name: sync-from-react
description: Catch sacred-solid up to the latest www-sacred (React) commit. Use for "sync from react", "catch up to react head", "port the new react changes", or when `react-sync.json` is behind the React repo.
---

# Sync from React

`react-sync.json` pins the React commit this port is verified against. The sync moves that pin forward. The pin moves only through `mark`, and `mark` refuses until parity is clean.

The React repo is a sibling checkout at `../www-sacred`. Set `REACT_REPO` to point elsewhere. The script never writes there.

## Run

1. `vpx scripts/react-sync.ts status --fetch`. If it says up to date, stop.
2. `vpx scripts/react-sync.ts apply`. It prints the plan, saves one diff per file under `.react-sync/diffs/<sha>/`, and handles the mechanical kinds:
   - `diverged` (stylesheets): reported, never written. Solid owns its CSS and themes it with the `--theme-*` role tokens from `src/theme/tokens.ts`. Read the saved diff and carry the visual intent into the Solid stylesheet by hand, using role tokens. React's own `--theme-*` names never go into a Solid stylesheet, map each to a role (the audit in `.audit/theme-roles.tsv` shows how React's names were split); `tests/theme-roles.test.ts` fails if they do.
   - `copy` (`public/`): overwritten.
   - `meta` (`package.json`): rewrites `playground/meta.ts`.
3. `unmapped` files: decide where they go, then add a rule and a case to `scripts/react-sync/classify.ts` and `tests/react-sync-classify.test.ts`. Do not leave a path unclassified.
4. Hand port every `port` and `page` file. Follow `references/port-recipe.md`. Read the saved diff, not the whole React file, and carry the same change into the Solid file.
   - Added file: port the whole file. Deleted file: delete the Solid file and its test.
   - A changed `app/page.tsx` accordion goes into the `playground/section-N.tsx` the plan names. A new accordion goes where React puts it. Keep the order. Add a `section-N.tsx` and an `App.tsx` line only when a section grows past its neighbours.
   - A changed `common/*` file: the Solid copy is trimmed. If React now uses a helper that was cut, restore it from React. Otherwise port only the changed lines.
   - A changed `modules/hotkeys/*` file maps onto `createHotkeys`. The plan note names the Solid file.
   - A changed React `*.md` is `ignore`d. Skim `.react-sync/diffs/` for contract changes in `AGENTS.md` before moving on.
5. More than a handful of files: fan out one delegate per disjoint group of files, each reading `references/port-recipe.md`. You keep the barrel, `playground/App.tsx`, and the pin.
6. `vpx scripts/gen-index.ts`, then `vp check --fix`, `vp test`, `vp pack`.
7. Prove parity against a React build of the target commit, not the working tree of the React repo:
   - `vpx scripts/react-sync.ts prepare`. It prints the `next start` command. Run that and `vp build && vp preview --port 4173` in the background.
   - `vpx scripts/parity.ts baseline`, then `vpx scripts/parity.ts check`.
   - A React stylesheet change you did not carry over shows up as a FAIL in the scenarios it touches. Port the change by hand or ask the owner before `mark`.
   - Fix each FAIL in the component, not in the harness. A diff image is in `.parity/diff/`. If the gate itself is wrong, fix it in its own change.
   - New interactive behaviour in React needs a new scenario in `scripts/parity/scenarios.ts`. New accordions are covered by the section slices.
   - An INCONCLUSIVE scenario is not a pass. Name each one in the reply.
8. `vpx scripts/react-sync.ts mark`. It checks the served build, a clean `check.log`, and that nothing changed since the check. If only ignored files changed it skips the gate.
9. Append a row to `.audit/port.tsv` for each place Solid deliberately differs from React (see `show-me-your-work`).
10. Leave the changes uncommitted. The owner commits.

## Reply

The sha range and commit count, the files by kind (name every `diverged` stylesheet and what you did with it), what was hand ported, the parity result with every INCONCLUSIVE named, each deliberate divergence, and what is still open.
