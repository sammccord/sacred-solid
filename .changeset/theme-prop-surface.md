---
"sacred-solid": minor
---

Every component now takes a `theme` prop. It is an object keyed by the camelCase role token names, typed from the token table, and it writes inline `--theme-*` variables that re-theme the subtree below the component. `themeTokens`, `ThemeProps` and `styleAttributes` are exported.

`augAttributes` is gone. `styleAttributes(props, style)` takes an object with `aug` and `theme` and returns the attributes and merged style for a root element. A component with an aug border or inlay also gets `data-aug-border` and `data-aug-inlay`.

Breaking. `Button` renamed its `theme="PRIMARY" | "SECONDARY"` prop to `variant`, so `theme` can carry tokens.

An augmented element now drops its native chrome. With `aug.border` the native lines go, with `aug.inlay` the native fill goes, and with any `aug` the elevation shadow goes. Plain components nested inside keep their own chrome, and hover, focus and active states stay.

Add the `surface-chip` role for labels, bars, nav and scrollbar thumbs. `surface-float` now fills only overlay panels. Themes must set `--theme-surface-chip`, and every built-in theme sets it to the old `surface-float` value.

Add `sacred-solid/themes/holo.css`, a dark translucent theme with a cyan accent and glow shadows. Add the `Surface` component, a panel with an optional glow and backdrop blur.
