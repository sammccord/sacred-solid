---
"sacred-solid": minor
---

`aug.border` and `aug.inlay` now default to theme colors and widths. Before, `border: true` drew a 4px border in `currentColor` and `inlay: true` drew a 3px inset in translucent grey, so every call site repeated a color. Now the border is `--theme-line-strong` at `--theme-line-width`, and the inlay is `--theme-surface-float` at `--theme-line-width` from the border. This is a deliberate visual change for any caller that passed `border: true`, `inlay: true`, or a width without a `bg`. Pass `bg`, `all` or the other options to keep the old look. Explicit options still win.
