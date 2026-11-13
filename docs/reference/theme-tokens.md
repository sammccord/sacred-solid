# Theme tokens

`src/theme/tokens.ts` holds the token table. `sacred-solid` exports it as `themeTokens`, an array of objects with `group`, `name`, `key`, and `scope`.

| Field   | Meaning                                                                                |
| ------- | -------------------------------------------------------------------------------------- |
| `group` | `ink`, `surface`, `line`, `accent`, `control`, or `shadow`.                            |
| `name`  | The token name. The CSS variable is `--theme-` and the name.                           |
| `key`   | The camelCase form of the name. It is the key in the `theme` prop.                     |
| `scope` | `theme` for a per-theme role, or `constant` for a value set once and open to override. |

A per-theme role is set in every theme block. A constant is set once on `html, body` in `sacred-solid/global.css`, and a theme block may override it. "Token" means either kind.

The module also exports these types.

| Type               | Meaning                                        |
| ------------------ | ---------------------------------------------- |
| `ThemeToken`       | One entry of the table.                        |
| `ThemeGroup`       | The union of the group names.                  |
| `ThemeTokenName`   | The union of the token names.                  |
| `ThemeTokenKey`    | The union of the camelCase keys.               |
| `ThemeTokenScope`  | `"theme"` or `"constant"`.                     |
| `ThemeTokensIn<G>` | The entries in group `G`.                      |
| `ThemeCssVar<N>`   | The variable name `--theme-` and the name `N`. |

`ThemeProps` is `{ [K in ThemeTokenKey]?: string }`. It comes from `src/style/index.ts`.

`--theme-line-height-base`, `--font-size`, and the `--z-index-*` variables are layout metrics. They are not tokens, and the `theme` prop has no key for them.

In the lists below, a component is a file in `src/components`, and `global.css` is `src/styles/global.css`. A file reads a token when it uses it in `var()` or in `getPropertyValue`.

<!-- generated:start tokens -->

The table has 33 tokens. 26 are per-theme roles and 7 are constants.

## Ink tokens

Text colors.

| Variable              | Key          | Scope | Default           | Meaning                    |
| --------------------- | ------------ | ----- | ----------------- | -------------------------- |
| `--theme-ink`         | `ink`        | theme | set by each theme | Text color.                |
| `--theme-ink-inverse` | `inkInverse` | theme | set by each theme | Text drawn on an ink fill. |
| `--theme-ink-subdued` | `inkSubdued` | theme | set by each theme | Placeholder text.          |

- `--theme-ink` is read by `ActionButton`, `ActionListItem`, `BreadCrumbs`, `Button`, `CanvasPlatformer`, `CanvasSnake`, `Checkbox`, `DatePicker`, `Drawer`, `DropdownMenu`, `KeyHint`, `MatrixLoader`, `Navigation`, `RadioButton`, `Select`, `Tabs`, `global.css`.
- `--theme-ink-inverse` is read by `Dialog`, `Input`, `NumberRangeSlider`, `Panel`, `RadioButton`, `Select`.
- `--theme-ink-subdued` is read by `Input`.

## Surface tokens

Fills for pages, panels, inputs and chips.

| Variable                       | Key                  | Scope | Default           | Meaning                                                                                  |
| ------------------------------ | -------------------- | ----- | ----------------- | ---------------------------------------------------------------------------------------- |
| `--theme-surface-page`         | `surfacePage`        | theme | set by each theme | Page background and scrollbar track.                                                     |
| `--theme-surface-input`        | `surfaceInput`       | theme | set by each theme | Fill of input fields.                                                                    |
| `--theme-surface-panel`        | `surfacePanel`       | theme | set by each theme | Fill of modal panels.                                                                    |
| `--theme-surface-panel-footer` | `surfacePanelFooter` | theme | set by each theme | Fill of the dropdown menu footer.                                                        |
| `--theme-surface-window`       | `surfaceWindow`      | theme | set by each theme | Fill of the window body.                                                                 |
| `--theme-surface-float`        | `surfaceFloat`       | theme | set by each theme | Fill of overlay panels such as dialogs, menus, popovers, tooltips, messages and Surface. |
| `--theme-surface-chip`         | `surfaceChip`        | theme | set by each theme | Fill of labels, bars, navigation items and the scrollbar thumb.                          |
| `--theme-surface-inverse`      | `surfaceInverse`     | theme | set by each theme | Fill drawn in the ink color, such as selected controls and block cursors.                |
| `--theme-surface-subdued`      | `surfaceSubdued`     | theme | set by each theme | Muted fill for links, code blocks, slider tracks and select menus.                       |
| `--theme-surface-sunken`       | `surfaceSunken`      | theme | set by each theme | Recessed fill, used by the Avatar placeholder.                                           |

- `--theme-surface-page` is read by `ActionBar`, `Button`, `CodeBlock`, `Denabase`, `SimpleTable`, `global.css`.
- `--theme-surface-input` is read by `Drawer`, `Input`.
- `--theme-surface-panel` is read by `ModalAlert`, `ModalCanvasPlatformer`, `ModalCanvasSnake`, `ModalChess`, `ModalCreateAccount`, `ModalError`, `ModalMatrixModes`.
- `--theme-surface-panel-footer` is read by `DropdownMenu`.
- `--theme-surface-window` is read by `Window`.
- `--theme-surface-float` is read by `AlertBanner`, `Dialog`, `DropdownMenu`, `Message`, `Panel`, `Popover`, `Select`, `Surface`, `Tooltip`.
- `--theme-surface-chip` is read by `Badge`, `BarLoader`, `BreadCrumbs`, `DatePicker`, `Input`, `Navigation`, `Select`, `SimpleTable`, `global.css`.
- `--theme-surface-inverse` is read by `BarLoader`, `BarProgress`, `Block`, `DOMSnake`, `Dialog`, `Input`, `NumberRangeSlider`, `Panel`, `RadioButton`, `Select`, `TextArea`.
- `--theme-surface-subdued` is read by `BarProgress`, `Chessboard`, `CodeBlock`, `DatePicker`, `NumberRangeSlider`, `ScrollArea`, `global.css`.
- `--theme-surface-sunken` is read by `Avatar`.

## Line tokens

Edge colors and line widths.

| Variable                    | Key               | Scope    | Default           | Meaning                                                                         |
| --------------------------- | ----------------- | -------- | ----------------- | ------------------------------------------------------------------------------- |
| `--theme-line-strong`       | `lineStrong`      | theme    | set by each theme | Edge line drawn in the ink tone, such as Card borders and Divider rules.        |
| `--theme-line`              | `line`            | theme    | set by each theme | Standard edge line, such as the Input field edge and the secondary Button line. |
| `--theme-line-subdued`      | `lineSubdued`     | theme    | set by each theme | Hairline divider inside checkboxes and radio buttons.                           |
| `--theme-line-width-strong` | `lineWidthStrong` | constant | `2px`             | Thickness of strong lines.                                                      |
| `--theme-line-width`        | `lineWidth`       | constant | `1px`             | Thickness of standard lines and focus rings.                                    |
| `--theme-line-width-double` | `lineWidthDouble` | constant | `6px`             | Thickness of the CardDouble border.                                             |

- `--theme-line-strong` is read by `Card`, `CardDouble`, `DashboardRadar`, `Denabase`, `Divider`, `Panel`, `ScrollArea`, `SidebarLayout`.
- `--theme-line` is read by `ActionBar`, `Button`, `CanvasPlatformer`, `DebugGrid`, `Divider`, `Input`, `Panel`.
- `--theme-line-subdued` is read by `Checkbox`, `RadioButton`.
- `--theme-line-width-strong` is read by `ActionButton`, `Card`, `DashboardRadar`, `Denabase`, `Divider`, `Input`, `KeyHint`, `SidebarLayout`.
- `--theme-line-width` is read by `ActionBar`, `Button`, `CanvasPlatformer`, `CanvasSnake`, `Checkbox`, `DOMSnake`, `DebugGrid`, `Panel`, `RadioButton`.
- `--theme-line-width-double` is read by `CardDouble`.

## Accent tokens

The emphasis color for hover, focus and active states.

| Variable                 | Key             | Scope | Default           | Meaning                                                                            |
| ------------------------ | --------------- | ----- | ----------------- | ---------------------------------------------------------------------------------- |
| `--theme-accent`         | `accent`        | theme | set by each theme | Emphasis fill and focus line for hover, focus and active states.                   |
| `--theme-accent-subdued` | `accentSubdued` | theme | set by each theme | Translucent emphasis fill, such as the DataTable flash and light chessboard cells. |

- `--theme-accent` is read by `Accordion`, `ActionButton`, `ActionListItem`, `Avatar`, `BreadCrumbs`, `Button`, `CanvasPlatformer`, `CanvasSnake`, `Checkbox`, `Chessboard`, `DOMSnake`, `DataTable`, `DatePicker`, `Drawer`, `Input`, `ListItem`, `MessageViewer`, `Navigation`, `NumberRangeSlider`, `RadioButton`, `Row`, `RowEllipsis`, `Select`, `SidebarLayout`, `SimpleTable`, `TableRow`, `Tabs`, `TextArea`, `TreeView`, `global.css`.
- `--theme-accent-subdued` is read by `Chessboard`, `DataTable`.

## Control tokens

Chrome of buttons, checkboxes, radio buttons and sliders.

| Variable                     | Key                 | Scope | Default           | Meaning                                                  |
| ---------------------------- | ------------------- | ----- | ----------------- | -------------------------------------------------------- |
| `--theme-control`            | `control`           | theme | set by each theme | Fill of a primary Button.                                |
| `--theme-control-ink`        | `controlInk`        | theme | set by each theme | Text on a primary Button fill.                           |
| `--theme-control-foreground` | `controlForeground` | theme | set by each theme | Chrome tone of controls, used as fill, text and outline. |
| `--theme-control-background` | `controlBackground` | theme | set by each theme | Body fill of controls.                                   |

- `--theme-control` is read by `Button`.
- `--theme-control-ink` is read by `Button`.
- `--theme-control-foreground` is read by `ActionButton`, `ActionListItem`, `Button`, `Checkbox`, `Drawer`, `KeyHint`, `NumberRangeSlider`, `RadioButton`, `Select`, `Tabs`.
- `--theme-control-background` is read by `ActionButton`, `ActionListItem`, `Button`, `Checkbox`, `RadioButton`.

## Shadow tokens

Elevation of windows, floating panels, tooltips and modal rings, as a geometry and a color.

| Variable                          | Key                     | Scope    | Default                                              | Meaning                                                       |
| --------------------------------- | ----------------------- | -------- | ---------------------------------------------------- | ------------------------------------------------------------- |
| `--theme-shadow-window-geometry`  | `shadowWindowGeometry`  | constant | `1ch calc(var(--theme-line-height-base) * 1rem) 0 0` | Offsets, blur and spread of the Window shadow.                |
| `--theme-shadow-window-color`     | `shadowWindowColor`     | theme    | set by each theme                                    | Color of the Window shadow.                                   |
| `--theme-shadow-float-geometry`   | `shadowFloatGeometry`   | constant | `1ch 1ch 0 0`                                        | Offsets, blur and spread of the shadow under floating panels. |
| `--theme-shadow-float-color`      | `shadowFloatColor`      | theme    | set by each theme                                    | Color of the shadow under floating panels.                    |
| `--theme-shadow-tooltip-geometry` | `shadowTooltipGeometry` | constant | `0.5ch 0.5ch 0 0`                                    | Offsets, blur and spread of the Tooltip shadow.               |
| `--theme-shadow-tooltip-color`    | `shadowTooltipColor`    | theme    | set by each theme                                    | Color of the Tooltip shadow.                                  |
| `--theme-shadow-ring-geometry`    | `shadowRingGeometry`    | constant | `0 0 0 1ch`                                          | Spread of the ring around modals and popovers.                |
| `--theme-shadow-ring-color`       | `shadowRingColor`       | theme    | set by each theme                                    | Color of the ring around modals and popovers.                 |

- `--theme-shadow-window-geometry` is read by `Window`.
- `--theme-shadow-window-color` is read by `Window`.
- `--theme-shadow-float-geometry` is read by `AlertBanner`, `Dialog`, `Message`, `Panel`.
- `--theme-shadow-float-color` is read by `AlertBanner`, `Dialog`, `Message`, `Panel`.
- `--theme-shadow-tooltip-geometry` is read by `Tooltip`.
- `--theme-shadow-tooltip-color` is read by `Tooltip`.
- `--theme-shadow-ring-geometry` is read by `ModalAlert`, `ModalCanvasPlatformer`, `ModalCanvasSnake`, `ModalChess`, `ModalCreateAccount`, `ModalError`, `ModalMatrixModes`, `Popover`.
- `--theme-shadow-ring-color` is read by `ModalAlert`, `ModalCanvasPlatformer`, `ModalCanvasSnake`, `ModalChess`, `ModalCreateAccount`, `ModalError`, `ModalMatrixModes`, `Popover`.

<!-- generated:end tokens -->

`tests/theme-roles.test.ts` checks that the table, `global.css`, `src/themes/holo.css`, and `src/themes/acid.css`, and `src/themes/redline.css` agree.
