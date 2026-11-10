# Themes

A theme is a block of `--theme-*` values on a `body` class. `sacred-solid/global.css` defines `theme-light`, `theme-dark`, and the tints. `sacred-solid/themes/holo.css` defines `theme-holo`, `sacred-solid/themes/acid.css` defines `theme-acid`, and `sacred-solid/themes/redline.css` defines `theme-redline`. Put exactly one `theme-*` class on `<body>`.

## Built-in themes

<!-- generated:start themes -->

| Body class      | Stylesheet                        | Description                                                                                                                      |
| --------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `theme-light`   | `sacred-solid/global.css`         | Default. Black on white with a bright green accent.                                                                              |
| `theme-dark`    | `sacred-solid/global.css`         | White on black with a fuchsia accent.                                                                                            |
| `theme-holo`    | `sacred-solid/themes/holo.css`    | Dark translucent set with a cyan accent, hairline lines and glow shadows.                                                        |
| `theme-acid`    | `sacred-solid/themes/acid.css`    | Near-black page with acid lime ink and lines, slate highlights, cyan keycaps and a Rajdhani font stack.                          |
| `theme-redline` | `sacred-solid/themes/redline.css` | Deep maroon-black page with red ink and lines, a saturated red accent for selected rows, cyan keycaps and a Rajdhani font stack. |

<!-- generated:end themes -->

Import `sacred-solid/themes/holo.css`, `sacred-solid/themes/acid.css` or `sacred-solid/themes/redline.css` after `sacred-solid/global.css`.

## Tints

A tint class sets `--tint` on `<body>`. On `body.theme-light` and on `body.theme-dark`, the tint blocks derive every per-theme role from `--tint` with `oklch(from var(--tint) L C H)`. `theme-holo`, `theme-acid` and `theme-redline` have no tint blocks, so they ignore tint classes.

<!-- generated:start tints -->

7 tints.

| Body class    | Value of --tint          |
| ------------- | ------------------------ |
| `tint-green`  | `#39ff44`                |
| `tint-blue`   | `#0047ff`                |
| `tint-red`    | `#ff0000`                |
| `tint-yellow` | `var(--ansi-true-brand)` |
| `tint-purple` | `#8000ff`                |
| `tint-orange` | `#ffac1c`                |
| `tint-pink`   | `#ff00ff`                |

<!-- generated:end tints -->

## Class switching functions

`Utilities` is exported from `sacred-solid`. It has three functions that change a body class.

| Function                                           | Behavior                                                                                                                     |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `onHandleAppearanceChange(className?: string)`     | Removes every class that starts with `theme-`, then adds `className`, or `theme-light` when `className` is missing or empty. |
| `onHandleAppearanceModeChange(className?: string)` | Removes every class that starts with `tint-`, then adds `className` when it is not empty.                                    |
| `onHandleFontChange(className?: string)`           | Removes every class that starts with `font-`, then adds `className` when it is not empty.                                    |

Each function leaves the other prefixes alone.

## The holo values

`sacred-solid/themes/holo.css` has one block, `body.theme-holo`. It sets every per-theme role, and it overrides the constants that shape lines and shadows. The constants it does not set keep the value from `global.css`.

<!-- generated:start holo-values -->

`body.theme-holo` sets 26 per-theme roles and overrides 6 constants.

| Variable                          | Scope    | Value                         |
| --------------------------------- | -------- | ----------------------------- |
| `--theme-ink`                     | theme    | `oklch(0.95 0.03 205 / 0.94)` |
| `--theme-ink-inverse`             | theme    | `oklch(0.14 0.03 220)`        |
| `--theme-ink-subdued`             | theme    | `oklch(0.8 0.05 205 / 0.55)`  |
| `--theme-surface-page`            | theme    | `oklch(0.15 0.04 230 / 0.28)` |
| `--theme-surface-input`           | theme    | `oklch(0.18 0.05 225 / 0.35)` |
| `--theme-surface-panel`           | theme    | `oklch(0.2 0.05 225 / 0.6)`   |
| `--theme-surface-panel-footer`    | theme    | `oklch(0.26 0.06 215 / 0.7)`  |
| `--theme-surface-window`          | theme    | `oklch(0.2 0.05 225 / 0.38)`  |
| `--theme-surface-float`           | theme    | `oklch(0.18 0.05 225 / 0.78)` |
| `--theme-surface-chip`            | theme    | `oklch(0.3 0.07 210 / 0.5)`   |
| `--theme-surface-inverse`         | theme    | `oklch(0.86 0.13 200 / 0.92)` |
| `--theme-surface-subdued`         | theme    | `oklch(0.8 0.1 205 / 0.12)`   |
| `--theme-surface-sunken`          | theme    | `oklch(0.1 0.03 230 / 0.5)`   |
| `--theme-line-strong`             | theme    | `oklch(0.85 0.14 200 / 0.7)`  |
| `--theme-line`                    | theme    | `oklch(0.82 0.12 205 / 0.35)` |
| `--theme-line-subdued`            | theme    | `oklch(0.82 0.12 205 / 0.16)` |
| `--theme-line-width-strong`       | constant | `1px`                         |
| `--theme-line-width-double`       | constant | `3px`                         |
| `--theme-accent`                  | theme    | `oklch(0.55 0.12 205 / 0.9)`  |
| `--theme-accent-subdued`          | theme    | `oklch(0.55 0.12 205 / 0.4)`  |
| `--theme-control`                 | theme    | `oklch(0.85 0.12 200 / 0.9)`  |
| `--theme-control-ink`             | theme    | `oklch(0.14 0.03 220)`        |
| `--theme-control-foreground`      | theme    | `oklch(0.45 0.08 210 / 0.6)`  |
| `--theme-control-background`      | theme    | `oklch(0.28 0.06 215 / 0.4)`  |
| `--theme-shadow-window-geometry`  | constant | `0 0 24px 0`                  |
| `--theme-shadow-window-color`     | theme    | `oklch(0.8 0.12 205 / 0.25)`  |
| `--theme-shadow-float-geometry`   | constant | `0 0 16px 0`                  |
| `--theme-shadow-float-color`      | theme    | `oklch(0.82 0.13 205 / 0.35)` |
| `--theme-shadow-tooltip-geometry` | constant | `0 0 8px 0`                   |
| `--theme-shadow-tooltip-color`    | theme    | `oklch(0.82 0.13 205 / 0.3)`  |
| `--theme-shadow-ring-geometry`    | constant | `0 0 18px 2px`                |
| `--theme-shadow-ring-color`       | theme    | `oklch(0.8 0.13 205 / 0.3)`   |

<!-- generated:end holo-values -->

## The acid values

`sacred-solid/themes/acid.css` has one block, `body.theme-acid`. It is a near-black page with lime ink and lines, slate for chips and highlights, and cyan for `--theme-control-foreground`, which `KeyHint` caps use. It overrides the same line and glow constants as holo. It also sets `--font-family-mono` to a Rajdhani stack that falls back to the default mono stack, so load Rajdhani in your page for the intended look.

<!-- generated:start acid-values -->

`body.theme-acid` sets 26 per-theme roles and overrides 5 constants and 1 font variable.

| Variable                          | Scope    | Value                                                         |
| --------------------------------- | -------- | ------------------------------------------------------------- |
| `--theme-ink`                     | theme    | `#dfff5e`                                                     |
| `--theme-ink-inverse`             | theme    | `#0b0a10`                                                     |
| `--theme-ink-subdued`             | theme    | `rgb(223 255 94 / 0.5)`                                       |
| `--theme-surface-page`            | theme    | `#120f16`                                                     |
| `--theme-surface-input`           | theme    | `#17141d`                                                     |
| `--theme-surface-panel`           | theme    | `#120f16`                                                     |
| `--theme-surface-panel-footer`    | theme    | `#1c1923`                                                     |
| `--theme-surface-window`          | theme    | `#120f16`                                                     |
| `--theme-surface-float`           | theme    | `rgb(18 15 22 / 0.85)`                                        |
| `--theme-surface-chip`            | theme    | `#292d39`                                                     |
| `--theme-surface-inverse`         | theme    | `#dfff5e`                                                     |
| `--theme-surface-subdued`         | theme    | `rgb(223 255 94 / 0.12)`                                      |
| `--theme-surface-sunken`          | theme    | `#0b0a10`                                                     |
| `--theme-line-strong`             | theme    | `#dfff5e`                                                     |
| `--theme-line`                    | theme    | `rgb(223 255 94 / 0.55)`                                      |
| `--theme-line-subdued`            | theme    | `rgb(223 255 94 / 0.2)`                                       |
| `--theme-line-width-double`       | constant | `3px`                                                         |
| `--theme-accent`                  | theme    | `#3a4157`                                                     |
| `--theme-accent-subdued`          | theme    | `rgb(58 65 87 / 0.5)`                                         |
| `--theme-control`                 | theme    | `#dfff5e`                                                     |
| `--theme-control-ink`             | theme    | `#0b0a10`                                                     |
| `--theme-control-foreground`      | theme    | `#5edde3`                                                     |
| `--theme-control-background`      | theme    | `rgb(94 221 227 / 0.12)`                                      |
| `--theme-shadow-window-geometry`  | constant | `0 0 24px 0`                                                  |
| `--theme-shadow-window-color`     | theme    | `rgb(223 255 94 / 0.25)`                                      |
| `--theme-shadow-float-geometry`   | constant | `0 0 14px 0`                                                  |
| `--theme-shadow-float-color`      | theme    | `rgb(223 255 94 / 0.3)`                                       |
| `--theme-shadow-tooltip-geometry` | constant | `0 0 8px 0`                                                   |
| `--theme-shadow-tooltip-color`    | theme    | `rgb(223 255 94 / 0.3)`                                       |
| `--theme-shadow-ring-geometry`    | constant | `0 0 16px 2px`                                                |
| `--theme-shadow-ring-color`       | theme    | `rgb(223 255 94 / 0.3)`                                       |
| `--font-family-mono`              | font     | `'Rajdhani', 'FiraCode-Regular', Consolas, monaco, monospace` |

<!-- generated:end acid-values -->

## The redline values

`sacred-solid/themes/redline.css` has one block, `body.theme-redline`. It is red ink and lines on a maroon-black page. `--theme-accent` is a saturated red, which `ListItem` uses for a selected row, and `--theme-control-foreground` is cyan, which `KeyHint` and the selected `Tabs` tab use. A text color that is not a role, such as a cyan title or an amber warning, goes through the `theme` prop of the element that draws the text. It overrides the constants like acid does, and it sets the same Rajdhani font stack.

<!-- generated:start redline-values -->

`body.theme-redline` sets 26 per-theme roles and overrides 5 constants and 1 font variable.

| Variable                          | Scope    | Value                                                         |
| --------------------------------- | -------- | ------------------------------------------------------------- |
| `--theme-ink`                     | theme    | `#ff5a53`                                                     |
| `--theme-ink-inverse`             | theme    | `#0b0e13`                                                     |
| `--theme-ink-subdued`             | theme    | `rgb(255 90 83 / 0.5)`                                        |
| `--theme-surface-page`            | theme    | `#0b0e13`                                                     |
| `--theme-surface-input`           | theme    | `#170d12`                                                     |
| `--theme-surface-panel`           | theme    | `#1a0d12`                                                     |
| `--theme-surface-panel-footer`    | theme    | `#240f15`                                                     |
| `--theme-surface-window`          | theme    | `#14090e`                                                     |
| `--theme-surface-float`           | theme    | `rgb(18 10 16 / 0.85)`                                        |
| `--theme-surface-chip`            | theme    | `#3a1218`                                                     |
| `--theme-surface-inverse`         | theme    | `#ff5a53`                                                     |
| `--theme-surface-subdued`         | theme    | `rgb(255 90 83 / 0.12)`                                       |
| `--theme-surface-sunken`          | theme    | `#070a0e`                                                     |
| `--theme-line-strong`             | theme    | `#ff5a53`                                                     |
| `--theme-line`                    | theme    | `rgb(255 90 83 / 0.55)`                                       |
| `--theme-line-subdued`            | theme    | `rgb(255 90 83 / 0.22)`                                       |
| `--theme-line-width-double`       | constant | `3px`                                                         |
| `--theme-accent`                  | theme    | `#7b2526`                                                     |
| `--theme-accent-subdued`          | theme    | `rgb(123 37 38 / 0.5)`                                        |
| `--theme-control`                 | theme    | `#ff5a53`                                                     |
| `--theme-control-ink`             | theme    | `#0b0e13`                                                     |
| `--theme-control-foreground`      | theme    | `#4de1e0`                                                     |
| `--theme-control-background`      | theme    | `rgb(77 225 224 / 0.12)`                                      |
| `--theme-shadow-window-geometry`  | constant | `0 0 24px 0`                                                  |
| `--theme-shadow-window-color`     | theme    | `rgb(255 90 83 / 0.25)`                                       |
| `--theme-shadow-float-geometry`   | constant | `0 0 14px 0`                                                  |
| `--theme-shadow-float-color`      | theme    | `rgb(255 90 83 / 0.3)`                                        |
| `--theme-shadow-tooltip-geometry` | constant | `0 0 8px 0`                                                   |
| `--theme-shadow-tooltip-color`    | theme    | `rgb(255 90 83 / 0.3)`                                        |
| `--theme-shadow-ring-geometry`    | constant | `0 0 16px 2px`                                                |
| `--theme-shadow-ring-color`       | theme    | `rgb(255 90 83 / 0.3)`                                        |
| `--font-family-mono`              | font     | `'Rajdhani', 'FiraCode-Regular', Consolas, monaco, monospace` |

<!-- generated:end redline-values -->

## Source

`src/styles/global.css` holds the light and dark blocks and the tint blocks. `src/themes/holo.css` holds the holo block `src/themes/acid.css` holds the acid block, and `src/themes/redline.css` holds the redline block. `tests/theme-roles.test.ts` checks that every theme block sets every per-theme role, sets only names in the token table, and derives no role from another `--theme-*` variable. See [Theme tokens](theme-tokens.md) for the roles and constants.
