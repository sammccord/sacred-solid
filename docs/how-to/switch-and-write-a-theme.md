# Switch and write a theme

To change the whole page theme, put a `theme-*` class on `<body>`. This page covers the built-in themes, switching at runtime, and writing your own theme.

## Use a built-in theme

`theme-light` and `theme-dark` are in `sacred-solid/global.css`, so no extra import is needed. Put one on `<body>`.

```html
<body class="theme-dark"></body>
```

`theme-holo`, `theme-acid` and `theme-redline` are separate stylesheets. Import the ones you use after `global.css`.

```tsx
import "sacred-solid/global.css";
import "sacred-solid/themes/holo.css";
import "sacred-solid/themes/acid.css";
import "sacred-solid/themes/redline.css";
```

See [Themes](../reference/themes.md) for the built-in themes and tints.

## Switch the theme at runtime

To switch, call `Utilities.onHandleAppearanceChange` with the class name.

```tsx
import { Button, Utilities } from "sacred-solid";

<Button onClick={() => Utilities.onHandleAppearanceChange("theme-holo")}>Holo</Button>;
```

The function removes every `theme-*` class from `<body>` and adds the one you pass. It leaves `tint-*` and `font-*` classes alone. Called with no argument or an empty string, it adds `theme-light`.

## Add a tint

If you want a tint on `theme-light` or `theme-dark`, call `Utilities.onHandleAppearanceModeChange` with a `tint-*` class. It replaces any existing `tint-*` class.

```tsx
import { Button, Utilities } from "sacred-solid";

<Button onClick={() => Utilities.onHandleAppearanceModeChange("tint-green")}>Green</Button>;
```

`theme-holo`, `theme-acid`, `theme-redline` and your own themes ignore tint classes.

## Write a theme

To write a theme, follow these steps.

1. Create a stylesheet with one block whose selector is `body.theme-` and your name.
2. Set every per-theme role in that block. The checklist below lists them.
3. Set a constant in the same block only if you want to change it. A theme may also set `--font-family-mono` to change the font stack, as `theme-acid` and `theme-redline` do. The font file itself is not loaded by the theme, so load it in your page.
4. Import the stylesheet after `sacred-solid/global.css`.
5. Call `Utilities.onHandleAppearanceChange` with your class name.

Set each role to a literal value. A role may be translucent.

<!-- generated:start theme-checklist -->

Set all 26 per-theme roles.

- The ink group has 3. `--theme-ink`, `--theme-ink-inverse`, `--theme-ink-subdued`.
- The surface group has 10. `--theme-surface-page`, `--theme-surface-input`, `--theme-surface-panel`, `--theme-surface-panel-footer`, `--theme-surface-window`, `--theme-surface-float`, `--theme-surface-chip`, `--theme-surface-inverse`, `--theme-surface-subdued`, `--theme-surface-sunken`.
- The line group has 3. `--theme-line-strong`, `--theme-line`, `--theme-line-subdued`.
- The accent group has 2. `--theme-accent`, `--theme-accent-subdued`.
- The control group has 4. `--theme-control`, `--theme-control-ink`, `--theme-control-foreground`, `--theme-control-background`.
- The shadow group has 4. `--theme-shadow-window-color`, `--theme-shadow-float-color`, `--theme-shadow-tooltip-color`, `--theme-shadow-ring-color`.

A theme may also override the 7 constants. `--theme-line-width-strong`, `--theme-line-width`, `--theme-line-width-double`, `--theme-shadow-window-geometry`, `--theme-shadow-float-geometry`, `--theme-shadow-tooltip-geometry`, `--theme-shadow-ring-geometry`.

<!-- generated:end theme-checklist -->

Do not write `var(--theme-surface-page)` or any other `--theme-*` reference as a role value. A reference resolves where you write it, so the role stops following overrides made lower in the tree. See [Why role tokens](../explanation/why-role-tokens.md).

This theme is complete. It turns hard offset shadows into glows by overriding one constant.

```css theme
body.theme-mine {
  --theme-ink: #e8fff4;
  --theme-ink-inverse: #04120c;
  --theme-ink-subdued: rgb(232 255 244 / 0.5);

  --theme-surface-page: #04120c;
  --theme-surface-input: #0b2a1d;
  --theme-surface-panel: #0b2a1d;
  --theme-surface-panel-footer: #11402c;
  --theme-surface-window: #0b2a1d;
  --theme-surface-float: rgb(10 40 28 / 0.8);
  --theme-surface-chip: #11402c;
  --theme-surface-inverse: #7dffc0;
  --theme-surface-subdued: rgb(125 255 192 / 0.12);
  --theme-surface-sunken: #020a06;

  --theme-line-strong: #7dffc0;
  --theme-line: rgb(125 255 192 / 0.35);
  --theme-line-subdued: rgb(125 255 192 / 0.15);

  --theme-accent: #1fb97a;
  --theme-accent-subdued: rgb(31 185 122 / 0.4);

  --theme-control: #7dffc0;
  --theme-control-ink: #04120c;
  --theme-control-foreground: #2b6b50;
  --theme-control-background: #0b2a1d;

  --theme-shadow-window-color: rgb(125 255 192 / 0.25);
  --theme-shadow-float-color: rgb(125 255 192 / 0.35);
  --theme-shadow-tooltip-color: rgb(125 255 192 / 0.3);
  --theme-shadow-ring-color: rgb(125 255 192 / 0.3);

  --theme-shadow-float-geometry: 0 0 16px 0;
}
```

Switch to it with `Utilities.onHandleAppearanceChange("theme-mine")`.

## Find a missing role

If a role is missing, every declaration that reads it is invalid at computed-value time, and the property falls back to its inherited or initial value. To list the roles the active theme leaves unset, read them from `<body>`.

```tsx
import { themeTokens } from "sacred-solid";

const style = getComputedStyle(document.body);

const missing = themeTokens
  .filter((token) => style.getPropertyValue(`--theme-${token.name}`).trim() === "")
  .map((token) => `--theme-${token.name}`);

console.log(missing);
```

The array is empty when the theme sets every token.
