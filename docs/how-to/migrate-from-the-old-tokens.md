# Migrate from the old tokens

If your CSS, your theme blocks, or your components use the old `--theme-*` names, the `Button` `theme` prop, or `augAttributes`, change them as this page says. The old names are deleted, not aliased, so an old name resolves to nothing.

## Find the old names

To list every use of an old token in your source, run this command from your project root.

```sh
grep -rnE -e '--theme-(text|background|border|overlay|button|focused|window)|--card-double-border-width' src
```

## Replace each removed token

Look up each match in the table. A token with several rows was split into several roles. Pick the row that matches what the old token did at that place.

| Removed                              | Replacement                    | Use it when the old token                                                    |
| ------------------------------------ | ------------------------------ | ---------------------------------------------------------------------------- |
| `--theme-background`                 | `--theme-ink-inverse`          | drew text on an ink fill                                                     |
| `--theme-background`                 | `--theme-surface-page`         | filled the page, a scrollbar track, or an inlay that shows the page          |
| `--theme-background-input`           | `--theme-surface-input`        | filled an input field                                                        |
| `--theme-background-modal`           | `--theme-surface-panel`        | filled a modal panel                                                         |
| `--theme-background-modal-footer`    | `--theme-surface-panel-footer` | filled the footer of a panel                                                 |
| `--theme-border`                     | `--theme-line`                 | drew an edge line, a grid rule, or a fading divider                          |
| `--theme-border`                     | `--theme-surface-chip`         | filled a label, a bar, a navigation item, or a scrollbar thumb               |
| `--theme-border`                     | `--theme-surface-float`        | filled an overlay panel such as a dialog, menu, popover, tooltip, or message |
| `--theme-border-subdued`             | `--theme-line-subdued`         | drew a hairline divider                                                      |
| `--theme-border-subdued`             | `--theme-shadow-float-color`   | colored the shadow under a floating panel                                    |
| `--theme-border-subdued`             | `--theme-shadow-ring-color`    | colored the ring around a modal or popover                                   |
| `--theme-border-subdued`             | `--theme-shadow-tooltip-color` | colored the tooltip shadow                                                   |
| `--theme-border-subdued`             | `--theme-surface-subdued`      | filled a muted area such as a link, a code block, a slider track, or a menu  |
| `--theme-button`                     | `--theme-control`              | filled a primary button                                                      |
| `--theme-button-background`          | `--theme-control-background`   | filled the body of a control                                                 |
| `--theme-button-foreground`          | `--theme-control-foreground`   | gave the chrome of a control its fill, text, or outline                      |
| `--theme-button-text`                | `--theme-control-ink`          | drew text on a primary button fill                                           |
| `--theme-focused-foreground`         | `--theme-accent`               | marked hover, focus, or active with a fill or a line                         |
| `--theme-focused-foreground-subdued` | `--theme-accent-subdued`       | marked a state with a translucent fill                                       |
| `--theme-overlay`                    | `--theme-ink-subdued`          | colored placeholder text                                                     |
| `--theme-text`                       | `--theme-ink`                  | colored text                                                                 |
| `--theme-text`                       | `--theme-line-strong`          | drew an edge line or a rule in the ink color                                 |
| `--theme-text`                       | `--theme-surface-inverse`      | filled an area in the ink color                                              |
| `--theme-window-background`          | `--theme-surface-window`       | filled the body of a window                                                  |
| `--theme-window-shadow`              | `--theme-shadow-window-color`  | colored the window shadow                                                    |
| `--theme-window-shadow`              | `--theme-surface-sunken`       | filled a recessed area                                                       |
| `--card-double-border-width`         | `--theme-line-width-double`    | set the width of the `CardDouble` border                                     |

The old shadow tokens carried a color only, and the offsets were written into each stylesheet. The offsets now live in the `--theme-shadow-*-geometry` constants.

## Replace literal widths and offsets

Stylesheets wrote line widths and shadow offsets as literals. If you copied those literals, use the constants.

| Literal                                                             | Constant                          |
| ------------------------------------------------------------------- | --------------------------------- |
| `1px` line                                                          | `--theme-line-width`              |
| `2px` line                                                          | `--theme-line-width-strong`       |
| `6px` line                                                          | `--theme-line-width-double`       |
| `1ch calc(var(--theme-line-height-base) * 1rem) 0 0` shadow offsets | `--theme-shadow-window-geometry`  |
| `1ch 1ch 0 0` shadow offsets                                        | `--theme-shadow-float-geometry`   |
| `0.5ch 0.5ch 0 0` shadow offsets                                    | `--theme-shadow-tooltip-geometry` |
| `0 0 0 1ch` shadow spread                                           | `--theme-shadow-ring-geometry`    |

## Move chips off surface-float

If a rule used `--theme-surface-float` to fill a label, a bar, a navigation item, or a scrollbar thumb, switch it to `--theme-surface-chip`. `--theme-surface-float` now fills only overlay panels.

## Update a theme block

If you wrote a `body.theme-*` block, copy the old value into every replacement in the table, then delete the old declaration. Set `--theme-surface-chip` to the value the block gave `--theme-border`. Every built-in theme was migrated this way, so each one computes the same colors as before. See [Switch and write a theme](switch-and-write-a-theme.md) for the checklist of roles.

## Rename the Button prop

`Button` used `theme` for its look. `theme` now carries token overrides, so the look moved to `variant`.

```diff
-<Button theme="SECONDARY">Cancel</Button>
+<Button variant="SECONDARY">Cancel</Button>
```

## Replace augAttributes

`augAttributes` is removed. A custom component calls `styleAttributes(props, style)` with an object that has `aug` and `theme`. It returns the attributes and the merged style for the root element.

```tsx
import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { type AugProps, styleAttributes, type ThemeProps } from "sacred-solid";

export function Panel(props: { aug?: AugProps; theme?: ThemeProps; style?: JSX.CSSProperties }) {
  const rest = omit(props, "aug", "theme");
  return <div {...rest} {...styleAttributes(props, rest.style)} />;
}
```

A component with an aug border or inlay also gets `data-aug-border` and `data-aug-inlay`. See [styleAttributes](../reference/style-attributes.md).
