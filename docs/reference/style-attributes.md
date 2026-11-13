# styleAttributes

`styleAttributes` turns the `aug` and `theme` props into the attributes and style of a root element. `sacred-solid` exports it from `src/style/index.ts`, with `ThemeProps`, `StyleProps`, and `StyleAttributes`.

## Signature

```ts
import type { JSX } from "@solidjs/web";
import type { AugProps, ThemeProps } from "sacred-solid";

interface StyleProps {
  aug?: AugProps;
  theme?: ThemeProps;
}

interface StyleAttributes {
  "data-augmented-ui"?: string;
  "data-aug-border"?: "";
  "data-aug-inlay"?: "";
  style?: JSX.CSSProperties | string;
}

declare function styleAttributes(
  props: StyleProps,
  style?: JSX.CSSProperties | string,
): StyleAttributes;
```

## Returned attributes

| Attribute           | Present when                                        | Value                        |
| ------------------- | --------------------------------------------------- | ---------------------------- |
| `data-augmented-ui` | The aug yields at least one token.                  | The tokens joined by spaces. |
| `data-aug-border`   | `props.aug.border` is not `undefined`.              | The empty string.            |
| `data-aug-inlay`    | `props.aug.inlay` is not `undefined`.               | The empty string.            |
| `style`             | There are variables, or `style` is not `undefined`. | The merged style.            |

An absent attribute is absent from the returned object. It is not set to `undefined`. With no `aug`, no `theme`, and no `style`, the result is an empty object, and a component's DOM output does not change.

## Merge rules

The variables come first. The aug variables are `--aug-*`, and the theme variables are `--theme-*`. A theme key that is not in the token table is ignored, and so is a value that is `undefined`.

- If there are no variables, `style` comes back unchanged. It is the same object or string, or `undefined`.
- If `style` is an object or `undefined`, the result is a new object with the variables first and then the entries of `style`. A key in `style` replaces a variable of the same name.
- If `style` is a string, the result is a string. The variables come first as `--name:value` declarations joined by `;`, then the string with trailing whitespace and semicolons removed. A later declaration in a style attribute replaces an earlier one, so the string wins on a conflict. If the string is empty after trimming, the result is the variables alone.

A `theme` with an `ink` key also sets `color: var(--theme-ink)` on the element, so the text of the element and of everything that inherits its color follows the override. `color` is inherited as a computed value, and only `body` reads `--theme-ink` otherwise, so without this a themed `ink` would change the variable and no text. A `color` in `style` replaces it.

## What it emits

Each line is a real call, rendered by `scripts/gen-docs.ts`.

<!-- generated:start emits -->

- `styleAttributes({})` returns `{}`.
- `styleAttributes({ aug: {} })` returns `{}`.
- `styleAttributes({}, { color: "red" })` returns `{ style: { color: "red" } }`.
- `styleAttributes({}, "color:red")` returns `{ style: "color:red" }`.
- `styleAttributes({ aug: { tl: "clip", br: "2-rect-xy" } })` returns `{ "data-augmented-ui": "tl-clip br-2-rect-xy" }`.
- `styleAttributes({ aug: { tl: { mixin: "clip", size: "24px" } } })` returns `{ "data-augmented-ui": "tl-clip", style: { "--aug-tl": "24px" } }`.
- `styleAttributes({ aug: { tr: { mixin: "2-clip-xy", clipmodX1: 0.5 } } })` returns `{ "data-augmented-ui": "tr-2-clip-xy", style: { "--aug-tr1-clipmod-x": "0.5" } }`.
- `styleAttributes({ aug: { inlay: true, border: true, l: "clip", tl: "clip" } })` returns `{ "data-augmented-ui": "tl-clip l-clip border inlay", "data-aug-border": "", "data-aug-inlay": "" }`.
- `styleAttributes({ aug: { border: "2px" } })` returns `{ "data-augmented-ui": "border", "data-aug-border": "", style: { "--aug-border-all": "2px" } }`.
- `styleAttributes({ aug: { border: { all: "2px", bg: "cyan" } } })` returns `{ "data-augmented-ui": "border", "data-aug-border": "", style: { "--aug-border-all": "2px", "--aug-border-bg": "cyan" } }`.
- `styleAttributes({ aug: { all: { mixin: "hex", width: "8px" }, inlay: true } })` returns `{ "data-augmented-ui": "all-hex inlay", "data-aug-inlay": "", style: { "--aug-all-width": "8px" } }`.
- `styleAttributes({ theme: { ink: "white", surfaceFloat: "rgb(0 0 0 / 0.5)" } })` returns `{ style: { "--theme-ink": "white", "--theme-surface-float": "rgb(0 0 0 / 0.5)", color: "var(--theme-ink)" } }`.
- `styleAttributes({ theme: { ink: "white" } }, { color: "red" })` returns `{ style: { "--theme-ink": "white", color: "red" } }`.
- `styleAttributes({ aug: { tl: "clip" }, theme: { line: "cyan" } }, { color: "red", "--theme-line": "pink" })` returns `{ "data-augmented-ui": "tl-clip", style: { "--theme-line": "pink", color: "red" } }`.
- `styleAttributes({ theme: { line: "cyan" } }, "color: red;")` returns `{ style: "--theme-line:cyan;color: red" }`.

<!-- generated:end emits -->

## Where components use it

A component spreads the result on its root element after the rest of its props, so the merged `style` replaces the plain one. Components that have no `rest` object pass the props object. See [Components with aug](components-with-aug.md) for the element each component uses, and [Add aug to a new component](../how-to/add-aug-to-a-new-component.md).
