---
"sacred-solid": minor
---

Theming now uses a role token vocabulary, and the old token names are gone. Stylesheets in this package may now differ from the React originals.

Breaking renames. `--theme-text` is split into `--theme-ink` (text), `--theme-line-strong` (edges) and `--theme-surface-inverse` (fills). `--theme-background` is split into `--theme-surface-page` and `--theme-ink-inverse` (text on an ink fill). `--theme-border` is split into `--theme-surface-float` (fills) and `--theme-line` (edges). `--theme-border-subdued` is split into `--theme-line-subdued`, `--theme-surface-subdued` and the shadow colors. `--theme-overlay` becomes `--theme-ink-subdued`, because only placeholder text used it. `--theme-window-shadow` becomes `--theme-shadow-window-color` and `--theme-surface-sunken`.

The remaining renames are one to one. `--theme-background-input` is now `--theme-surface-input`, `--theme-background-modal` is `--theme-surface-panel`, `--theme-background-modal-footer` is `--theme-surface-panel-footer` and `--theme-window-background` is `--theme-surface-window`. `--theme-focused-foreground` is `--theme-accent` and `--theme-focused-foreground-subdued` is `--theme-accent-subdued`. `--theme-button`, `-button-text`, `-button-foreground` and `-button-background` are `--theme-control`, `-control-ink`, `-control-foreground` and `-control-background`.

New constants cover line widths (`--theme-line-width-strong`, `--theme-line-width`, `--theme-line-width-double`) and shadow geometry (`--theme-shadow-window-geometry`, `-float-`, `-tooltip-` and `-ring-`), each paired with a per-theme color. A theme can now set translucent surfaces, hairline lines or a glow instead of a hard offset shadow. Every default theme and tint computes to the same colors as before. The token names are exported as a typed table from `src/theme/tokens.ts`.
