# React to Solid port recipe

How a React file from `www-sacred` becomes a Solid file in this repo. The initial port and every `sync-from-react` run follow it. Delegates read this file in full and do not edit it.

## Goal

Same DOM, same CSS classes, same behavior. A pixel diff between the React kitchen sink and the Solid kitchen sink must come out at zero. When the React original does something odd, reproduce it. When Solid forces a difference, say so in your report.

## Fences

- Write only the files in your batch (the Solid files plus your own test file `tests/<batch>.test.tsx`).
- Never edit: `.audit/`, `scripts/`, `vite.config.ts`, `package.json`, `tsconfig.json`, `react-sync.json`, `src/index.ts`, any `*.css`, any file owned by another batch. `playground/` and `src/common`, `src/modules`, `src/components/page/ModalContext.tsx` are editable only when your batch owns them.
- Stylesheets are owned by this port and `vpx scripts/react-sync.ts apply` never writes them. Do not touch them. If a class the TSX needs is missing, report it.
- Do not create a commit. Do not run `vp check --fix` or `vp fmt` on the whole tree, other agents are editing at the same time. Format only your files with `vp fmt <your files>`.
- The React repo is read-only. Read the originals and the saved diffs; never write there.
- If a shared file needs a change, report the change you want. Do not make it.

## File and export contract

Every module keeps its React filename. Exports are named, never default. The component is exported as `Foo`, its props type as `FooProps`. Exceptions are listed under "Name map".

Imports use relative paths with the real extension:

```ts
import { classNames } from "../common/utilities.ts";
import { ActionButton } from "./ActionButton.tsx";
import styles from "./Foo.module.css";
```

Name map (React default export to Solid named export):

- `BreadCrumbs.tsx` exports `BreadCrumbs`.
- `DOMSnake.tsx` exports `DOMSnake` (React default was `SnakeGame`).
- `DebugGrid.tsx` exports `DebugGrid` and `toggleDebugGrid`.
- `detectors/OutsideElementEvent.tsx` exports `OutsideElementEvent`.
- `examples/*`, `modals/*`, `svg/*`, `page/*` keep their folders.
- `DefaultMetaTags.tsx` is not ported.

Shared pieces that already exist:

- `src/common/utilities.ts` exports `classNames`, `isEmpty`, `leftPad`, `deepEqual`, `isFocusableElement`, `findNextFocusable`, `findFocusableDescendant`, `onHandleAppearanceChange`, `onHandleAppearanceModeChange`, `onHandleFontChange`. Other helpers from the React file were deleted because nothing used them.
- `src/common/constants.ts` exports `LANDSCAPES`, `SAMPLE_TABLE_DATA_CHANGE_ME`, `CHESSBOARD_*`.
- `src/common/position.ts` exports `calculate` and `Placement`.
- `src/modules/hotkeys/index.ts` exports `createHotkeys(keys, callback, options?)`, `HotkeysProvider`, `useHotkeysContext`, `createRecordHotkeys`, `isHotkeyPressed`. `keys` and `options` may be a value or an accessor. Call it once during component setup. It attaches to `document` and cleans up with the owner.
- `src/components/page/ModalContext.tsx` exports `ModalProvider` and `useModals()` which returns `{ modalStack: Accessor<ModalState[]>, open(component, props): string, close(key?) }`.
- `src/components/ModalTrigger.tsx`, `ModalStack.tsx`, `Providers.tsx`, `Button.tsx` exist.

Modules owned by other batches may not exist yet. Import them by the paths above anyway. Type errors for a missing sibling module are expected until the other batches land. Any other type error is yours.

## Conventions

State and effects:

- `useState` becomes `createSignal`. Read with `count()`, write with `setCount(...)`.
- Derived values are plain functions or `createMemo`. Do not copy props into signals unless the original did so to own the value (for example `defaultValue`).
- `useEffect(() => {}, [])` becomes `onMount`. Cleanup goes in `onCleanup`.
- `useEffect` with dependencies becomes `createEffect`. Solid tracks what you read. Use `on(...)` only to make tracking explicit.
- `useRef` for a DOM node becomes `let el: HTMLDivElement | undefined;` and `ref={(node) => (el = node)}`. The bare `ref={el}` form trips the `no-unassigned-vars` lint. For a mutable value that is not reactive, use a plain `let`.
- Every `addEventListener`, `setInterval`, `setTimeout`, `requestAnimationFrame` gets an `onCleanup`.
- `useId` becomes `createUniqueId`.

Props:

- Never destructure props. It kills reactivity. Read `props.x` where used.
- Use `splitProps` to separate local props from a rest spread. Use `mergeProps` for defaults.
- `children` is `JSX.Element`. Pass `props.children` straight through. Use the `children()` helper from `solid-js` only when you must inspect or reuse it.
- `React.cloneElement` and `React.Children` do not exist. Restructure to context or a prop.
- Where the React props extended `React.HTMLAttributes<T>`, extend `JSX.HTMLAttributes<T>` (or the specific `JSX.ButtonHTMLAttributes` etc.).
- `style` is typed `JSX.CSSProperties` (or string where the original allowed it).
- Where the original omitted `className` from props, do not accept `class`.

JSX differences that change output:

- `className` becomes `class`. `htmlFor` becomes `for`. `tabIndex` stays `tabIndex`. `dangerouslySetInnerHTML={{ __html }}` becomes `innerHTML={...}`. Drop every `key=`.
- Style object keys are CSS property names in kebab-case: `{ "margin-top": "8px" }`. camelCase keys are silently ignored by Solid.
- React appends `px` to bare numbers for most properties. Solid does not. Write `width: "100px"` or `` `${n}px` ``. Unitless properties (`opacity`, `z-index`, `flex`, `line-height`) stay numbers.
- React `onChange` on text inputs, textareas, and selects fires on every keystroke. Solid `onChange` fires on commit. Use `onInput` to keep the React behavior. Checkboxes and radios: `onChange` is fine.
- React `onFocus` and `onBlur` bubble. Solid's do not. Use `onFocusIn` and `onFocusOut` when the original relied on bubbling from children.
- Solid delegates most events to `document`. If the code needs `stopPropagation` to stop a native `document` listener, or the order versus a `document.addEventListener` matters, use `on:click` (native binding) instead of `onClick`.
- Conditional rendering: ternaries and `&&` work, but prefer `<Show when={...}>` for elements and `<For each={...}>` for lists of objects. Use `<Index each={...}>` when the React code keyed by index over primitives or when rows are rebuilt from fresh arrays each tick.
- Controlled inputs: bind `value={props.value}` or `checked={...}`. Solid does not revert a DOM value the way React does when state is not updated. Do not emulate it.
- A component function runs once. Anything that must react goes in a function, memo, effect, or JSX expression. Reading a signal in the component body outside those does not update.

TypeScript:

- `strict` is on. No implicit any, no `any`, no `@ts-ignore`, no non-null `!` to silence real optionality. Parse or narrow instead.
- Replace the original's loose types (`style?: any`, `children?: any`, `hotkey?: any`) with real ones.

Style:

- No `'use client'`. No narrating comments. Keep an original `//NOTE(jimmylee): ...` comment only if it explains a why that is still true in Solid.
- The formatter is oxfmt via `vp fmt`. Default settings.

## Traps the first port hit

- Overlays portal with `BodyPortal` (`src/components/BodyPortal.tsx`). Solid's `Portal` adds a wrapper `<div>` that React never rendered.
- A literal `{" "}` merges into neighboring text in Solid and moves layout by a sub-pixel. Where React kept the space as its own text node and the pixel diff shows it, use `SPACE` from `src/common/utilities.ts`.
- React batches state updates for you. Wrap multi-signal updates that must land together in `batch`.
- React effects run a task after commit, Solid effects run synchronously. Code that depended on the delay (focus after open, measuring after mount) needs `onMount` or an effect that reads the ref.
- `isEmpty` treats any object as empty, so a JSX element passed where the original guards with `isEmpty` is silently dropped in React. Reproduce the guard, type the prop honestly, and report the React-side bug.

## Behavior parity checklist

For each component, before you call it done, compare against the original line by line:

- Same element tree and element order. Same attributes and values. Same class lists (the order of module classes in the `class` string matters for the pixel diff only when specificity ties, but keep it identical anyway).
- Same default prop values.
- Same keyboard and pointer behavior, including `preventDefault` and `stopPropagation` calls.
- Same timing: intervals, delays, rAF loops, animation frame math.
- Same focus behavior (`autoFocus`, programmatic `.focus()` calls and when they run).

## Tests

Write `tests/<batch>.test.tsx` with `@solidjs/testing-library` (`render`, `fireEvent`, `screen`) and `vite-plus/test` (`describe`, `expect`, `test`, `vi`). The environment is jsdom. Each stateful or interactive component needs a test that drives the behavior (click, keydown, input) and asserts DOM, not just "renders". Pure layout components get one assertion on element and class output. jsdom has no canvas: stub `HTMLCanvasElement.prototype.getContext` with `vi.spyOn`. Use `vi.useFakeTimers()` for intervals. Tests do not need to import `src/index.ts`; import the module under test directly.

Do not write tests that restate the implementation. Assert on what a user could observe.

## Done means

1. `vp check` shows no errors or warnings in your files. Run `vp check 2>&1 | grep -A6 "<your path fragment>"`. Errors that name a sibling module outside your batch that does not exist yet are the only ones you may leave.
2. `vp test tests/<batch>.test.tsx` passes. `vp test tests/conventions.test.ts` passes (it greps `src/` for React leftovers and camelCase style keys).
3. Your final message lists: files created, each behavior or markup difference from the original with the reason, anything you could not port, and any change you want in a shared file.
