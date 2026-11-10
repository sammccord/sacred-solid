# Add aug to a new component

To make a component in `src/components/` take `aug` and `theme`, spread `styleAttributes` on its root element, strip its native chrome in its module, and add it to the tests. This guide is for contributors to this repo.

## Spread styleAttributes on the root

Declare both props, split them off, and spread the result after `rest`.

```tsx
import { type JSX, splitProps } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { classNames } from "../common/utilities.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Panel.module.css";

export interface PanelProps extends JSX.HTMLAttributes<HTMLDivElement> {
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Panel(props: PanelProps) {
  const [local, rest] = splitProps(props, ["class", "aug", "theme", "children"]);

  return (
    <div
      class={classNames(styles.root, local.class)}
      {...rest}
      {...styleAttributes(local, rest.style)}
    >
      {local.children}
    </div>
  );
}
```

Take `class` out of `rest` and merge it with the library class, because a `class` left in `rest` would replace yours. Spread `styleAttributes` after `{...rest}`. Its `style` is the merge of the aug variables, the theme variables, and `rest.style`, and it must replace the plain `style` in `rest`. The component's own style wins over both props.

If the component reads `props` whole and has no `rest`, pass the props object, as `Card` does.

```tsx
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import type { JSX } from "solid-js";

interface BoxProps {
  aug?: AugProps;
  theme?: ThemeProps;
  style?: JSX.CSSProperties;
}

export function Box(props: BoxProps) {
  return <article {...styleAttributes(props, props.style)} />;
}
```

Put the attributes on exactly one element, the one that has the box. If the component has several roots or no element, it cannot take `aug`. Add a reason for it to `SKIPPED_REASONS` in `scripts/docs/descriptions.ts` instead.

If the component renders another component as its root, pass both props down with `aug={props.aug} theme={props.theme}`, as the modals do with `Card`.

## Strip the native chrome in the module

Add rules at the end of `Panel.module.css`. They remove the native line, fill, and elevation from the element that has `aug`.

```css
.root {
  background: var(--theme-surface-float);
  box-shadow: var(--theme-shadow-float-geometry) var(--theme-shadow-float-color);
}

.root:where([data-augmented-ui]) {
  box-shadow: none;
}

.root:where([data-aug-inlay]) {
  background: none;
}
```

Use these selectors.

- `:where([data-aug-border])` removes a native line, such as a `border` or an inset `box-shadow`.
- `:where([data-aug-inlay])` removes the native fill, so the inlay is the only fill.
- `:where([data-augmented-ui])` removes the elevation shadow, because `clip-path` cuts it off.

If the frame has parts, such as the title bars and the body of `Card`, reach them with child combinators.

```css
.card:where([data-aug-border]) > .children {
  box-shadow: none;
}
```

Do not use a descendant selector, and do not implement the strip with an inherited custom property. Both reach a plain component nested inside, and its lines disappear. Leave the `:hover`, `:focus`, and `:active` rules alone. The `:where()` selector adds no specificity for the attribute, so those states still win. See [How aug and the chrome strip work](../explanation/how-aug-and-chrome-strip-work.md).

Read colors, widths, and shadows from `--theme-*` tokens only. `tests/theme-roles.test.ts` fails on an unknown `--theme-*` name.

## Register the component

1. If the file is new, run `vpx scripts/gen-index.ts` to export it from `src/index.ts`.
2. Run `vpx scripts/gen-docs.ts` to add it to the table in [components with aug](../reference/components-with-aug.md). If the root element needs a remark, add a line to `COMPONENT_NOTES` in `scripts/docs/descriptions.ts` first.

## Extend the tests

1. In `tests/aug-components.test.tsx`, import the component and add one entry to `cases`. The `describe.each` block then checks that no marks appear without props, that exactly one element carries the aug attributes and variables, that `theme` lands on one element, and that both land on the same element.

   ```tsx no-check
   ["Panel", (s) => <Panel {...s}>x</Panel>],
   ```

2. If the module fills with `--theme-surface-float`, add its file to `FLOAT_CONSUMERS` in `tests/theme-roles.test.ts`.
3. If the module has strip rules, add a probe for the component to `PROBES` in `scripts/chrome-strip.ts` and a case to `CASES` in `playground/strip.tsx`. Then run `vp build`, `vp preview --port 4173`, and `vpx scripts/chrome-strip.ts` in a second terminal.
4. Run `vp check`, `vp test`, and `vp pack`.
