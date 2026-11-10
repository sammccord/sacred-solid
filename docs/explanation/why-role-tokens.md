# Why role tokens

The theme tokens used to name the color a value happened to have. They now name the job a value does, and a theme sets every role directly. That lets a theme make a surface translucent, a line a hairline, or a shadow a glow without touching component CSS. This page explains what was wrong with the old names, what that blocked, and the one rule that follows from how custom properties work.

## What the old tokens overloaded

Most old tokens did several jobs under one name. The migration log in `.audit/theme-roles.tsv` has one row for each declaration that changed, and it shows how far the names stretched.

- `--theme-text` colored text, drew edge lines in the ink color, and filled areas in the ink color. It has 71 rows, 23 for text, 38 for lines, and 10 for fills.
- `--theme-border` filled floating panels, filled labels and bars, and drew edge lines. It has 29 rows, 8 for panels, 13 for labels and bars, and 8 for lines.
- `--theme-border-subdued` filled muted areas, drew hairlines, and colored the shadows under three kinds of panel. It has 31 rows, 13 for fills, 3 for hairlines, and 15 for shadows.
- `--theme-background` filled the page and also colored text drawn on an ink fill. It has 17 rows, 10 for the page and 7 for text.
- `--theme-overlay` sounds like a scrim, and only placeholder text used it.

Line widths and shadow offsets were not tokens at all. Stylesheets wrote `2px` in 30 declarations, `1px` in 12, and `6px` in 4, with 14 more reading a local `--card-double-border-width`. Four shadow offset sets such as `1ch 1ch 0 0` were written into the stylesheets as well.

## What that blocked

A theme could only repaint, never reshape. Three examples show why.

A translucent panel was impossible without side effects. `--theme-border` was both the panel fill and a line color, so a see-through value for the panel made every edge line see-through too. `holo.css` needs four different alphas for what the old names merged. The ink is at 0.94, the strong line at 0.7, the standard line at 0.35, and the floating panel fill at 0.78.

A hairline theme meant editing about 60 declarations, because the widths were literals. The widths are now three constants, and `holo.css` sets two of them with two lines.

A glow was impossible because a shadow token carried a color only. A glow is a shadow with no offset and a blur radius, so the offsets had to become tokens too. Each shadow now has a `-geometry` constant and a `-color` role, and `holo.css` swaps four geometries to get glows.

`--theme-surface-chip` came from the same pressure. After the first split, `surface-float` still filled both overlay panels and labels, and holo wants the panels at 0.78 alpha and the labels at 0.5. The split gave each a role.

## Why a theme sets every token directly

A role is never computed from another role. This rule is the reason the checklist in [Switch and write a theme](../how-to/switch-and-write-a-theme.md) asks for 26 literal values.

A custom property that contains `var()` is resolved on the element that declares it. Descendants inherit the resolved value, not the formula. In this example the child reads red, but the derived property still reads blue.

```css
body {
  --base: blue;
  --derived: var(--base);
}

.child {
  --base: red;
  color: var(--derived);
}
```

In Chromium 158, a `span` inside an element with `--base: red` read `--base` as red and `--derived` as blue.

The `theme` prop works by setting `--theme-*` variables on the root of a subtree. Suppose a theme block derived `--theme-line` from `--theme-ink` on `body`. A component with `theme={{ ink: "red" }}` would change the text and leave the line at the page value. The subtree would be half themed. If each role is a literal on `body`, an override on the subtree reaches every reader.

The tint blocks follow the same logic. `body.theme-dark.tint-green` computes each role from `--tint` on `body`. Setting `--tint` on a subtree changes nothing below it. In Chromium 158, `--theme-ink` inside such a subtree equals the value on `body`. Use the `theme` prop to retheme a subtree.

The cost is repetition. Every built-in theme block has 26 declarations, and `surface-chip` equals `surface-float` in all of them. That cost is worth paying. A derived value that silently ignores overrides is worse than a duplicated value, and `tests/theme-roles.test.ts` fails the build when a theme block contains `var(--theme-`.

## Why the old names were deleted

The old names are not aliases of the new ones. There are three reasons.

An alias would break the rule above. `--theme-text: var(--theme-ink)` on `body` resolves to the page ink, so a `theme` override of `ink` would never reach the code that still reads `--theme-text`.

No alias would be right. `--theme-text` has three targets, and each of its 71 uses needs a human to pick one. An alias picks one for all of them, so edges would quietly come out in the wrong role.

Two vocabularies cost more than they save. `tests/theme-roles.test.ts` fails when a legacy name survives in `src`, the playground, the scripts, `README.md`, or `AGENTS.md`. That check only works if the old names are gone for good.

The package is at `0.0.0`, which `scripts/release.sh` treats as unreleased, so this is the cheap moment to break names. [Migrate from the old tokens](../how-to/migrate-from-the-old-tokens.md) maps every old name to its replacements.
