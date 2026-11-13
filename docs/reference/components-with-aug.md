# Components with aug

This page lists the exported components that take `aug` and `theme`, the element that receives the attributes, and the components that do not take them. `scripts/gen-docs.ts` builds both tables from `src/index.ts` and from the files in `src/components`. A component takes the props when its file declares `aug?: AugProps`.

The element column lists the tags that receive the output of `styleAttributes`, in source order. A row with two tags means the component renders one of them depending on its props. The forwards column lists the components that receive `aug` and `theme` instead, as the modals do with `Card` and `CardDouble`. Modals pass both props to the card they render, not to the positioning wrapper.

<!-- generated:start components -->

69 exported components take `aug` and `theme`. 21 of them render no element with the attributes and pass both props to another component.

| Component               | Element with the attributes | Forwards to                           | Note                                                                                                                            |
| ----------------------- | --------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `ASCIICanvas`           | `<pre>`                     | none                                  | The component sets `height` on the same style.                                                                                  |
| `Accordion`             | none                        | `Row`                                 | The attributes go on the header row through `Row`. The body row gets none.                                                      |
| `ActionBar`             | `<div>`                     | none                                  |                                                                                                                                 |
| `ActionButton`          | none                        | `Button`                              | The root takes `rootStyle`. The `style` prop goes on the inner `span`.                                                          |
| `ActionListItem`        | none                        | `HTMLDivElement`, `HTMLAnchorElement` | A `div`, or an `a` when `href` is set.                                                                                          |
| `AlertBanner`           | `<div>`                     | none                                  |                                                                                                                                 |
| `Avatar`                | `<figure>`, `<a>`, `<div>`  | none                                  | With children, the attributes go on the wrapping `div`. The `figure` or `a` inside gets none.                                   |
| `Badge`                 | `<span>`                    | none                                  |                                                                                                                                 |
| `BarLoader`             | none                        | `Progress`                            |                                                                                                                                 |
| `BarProgress`           | none                        | `Progress`                            |                                                                                                                                 |
| `Block`                 | `<span>`                    | none                                  |                                                                                                                                 |
| `BlockLoader`           | `<span>`                    | none                                  |                                                                                                                                 |
| `BreadCrumbs`           | `<nav>`                     | none                                  |                                                                                                                                 |
| `Button`                | none                        | `ButtonRoot`                          | An enabled Button renders a `button`. A disabled one renders a `div`.                                                           |
| `ButtonGroup`           | none                        | `Toolbar`                             |                                                                                                                                 |
| `Card`                  | `<article>`                 | none                                  |                                                                                                                                 |
| `CardDouble`            | `<article>`                 | none                                  |                                                                                                                                 |
| `Checkbox`              | `<div>`                     | none                                  |                                                                                                                                 |
| `Chessboard`            | `<table>`                   | none                                  |                                                                                                                                 |
| `CodeBlock`             | `<pre>`                     | none                                  |                                                                                                                                 |
| `ContentFluid`          | `<div>`                     | none                                  |                                                                                                                                 |
| `DOMSnake`              | `<div>`                     | none                                  |                                                                                                                                 |
| `DataTable`             | `<table>`                   | none                                  |                                                                                                                                 |
| `DatePicker`            | none                        | `Calendar`                            |                                                                                                                                 |
| `Dialog`                | `<div>`                     | `AlertDialogContent`                  |                                                                                                                                 |
| `Divider`               | `<div>`                     | none                                  | The element depends on `type`.                                                                                                  |
| `Drawer`                | none                        | `Collapsible`                         |                                                                                                                                 |
| `DropdownMenu`          | none                        | `MenuContent`                         |                                                                                                                                 |
| `DropdownMenuTrigger`   | `<div>`                     | none                                  | The attributes go on the wrapper around the trigger. The menu opens in a portal on `document.body` and gets none.               |
| `Grid`                  | `<div>`                     | none                                  |                                                                                                                                 |
| `HoverComponentTrigger` | `<div>`                     | none                                  | The attributes go on the wrapper around the trigger. The popover or tooltip opens in a portal on `document.body` and gets none. |
| `Indent`                | `<div>`                     | none                                  |                                                                                                                                 |
| `Input`                 | `<div>`                     | none                                  | The attributes go on the outer `div`. Other props go on the hidden `input`.                                                     |
| `KeyHint`               | `<div>`                     | none                                  | The attributes go on the wrapper. The keycaps and the label get none.                                                           |
| `ListItem`              | `<li>`                      | none                                  |                                                                                                                                 |
| `MatrixLoader`          | `<div>`                     | none                                  |                                                                                                                                 |
| `Message`               | `<div>`                     | none                                  |                                                                                                                                 |
| `MessageViewer`         | `<div>`                     | none                                  |                                                                                                                                 |
| `Navigation`            | `<nav>`                     | none                                  |                                                                                                                                 |
| `NumberRangeSlider`     | none                        | `Slider`                              |                                                                                                                                 |
| `Panel`                 | `<section>`                 | none                                  | The attributes go on the root `section`. The header and the body get none. The body has no padding unless you pass `padding`.   |
| `Popover`               | `<div>`                     | none                                  |                                                                                                                                 |
| `RadioButton`           | `<div>`                     | none                                  |                                                                                                                                 |
| `Row`                   | `<section>`                 | none                                  |                                                                                                                                 |
| `RowEllipsis`           | `<section>`                 | none                                  |                                                                                                                                 |
| `RowSpaceBetween`       | `<section>`                 | none                                  |                                                                                                                                 |
| `ScrollArea`            | `<div>`                     | none                                  | The attributes go on the outer wrapper. The scrolling viewport gets none.                                                       |
| `SidebarLayout`         | `<div>`                     | none                                  |                                                                                                                                 |
| `SimpleTable`           | `<div>`                     | none                                  |                                                                                                                                 |
| `Surface`               | `<div>`                     | none                                  | The attributes go on the innermost element. The backdrop layer gets the clip of `aug`. See [Surface](surface.md).               |
| `Table`                 | `<table>`                   | none                                  |                                                                                                                                 |
| `TableColumn`           | `<td>`                      | none                                  |                                                                                                                                 |
| `TableRow`              | `<tr>`                      | none                                  |                                                                                                                                 |
| `Tabs`                  | none                        | `TabsList`                            |                                                                                                                                 |
| `Text`                  | `<p>`                       | none                                  |                                                                                                                                 |
| `TextArea`              | `<div>`                     | none                                  | The attributes go on the outer `div`. Other props go on the hidden `textarea`.                                                  |
| `Tooltip`               | `<div>`                     | none                                  |                                                                                                                                 |
| `TreeView`              | none                        | `TreeItem`                            |                                                                                                                                 |
| `Window`                | `<section>`                 | none                                  |                                                                                                                                 |
| `ModalAlert`            | none                        | `Card`                                |                                                                                                                                 |
| `ModalCanvasPlatformer` | none                        | `Card`                                |                                                                                                                                 |
| `ModalCanvasSnake`      | none                        | `Card`                                |                                                                                                                                 |
| `ModalChess`            | none                        | `CardDouble`                          |                                                                                                                                 |
| `ModalCreateAccount`    | none                        | `CardDouble`                          |                                                                                                                                 |
| `ModalDOMSnake`         | none                        | `Card`                                |                                                                                                                                 |
| `ModalError`            | none                        | `CardDouble`                          |                                                                                                                                 |
| `ModalMatrixModes`      | none                        | `Card`                                |                                                                                                                                 |
| `DefaultActionBar`      | `<div>`                     | none                                  |                                                                                                                                 |
| `DefaultLayout`         | `<div>`                     | none                                  |                                                                                                                                 |

<!-- generated:end components -->

## Components without aug

These exported components have no `aug` or `theme` prop.

<!-- generated:start skipped -->

26 exported components take neither prop.

| Component             | Reason                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `BodyPortal`          | Renders no element. It moves its children into `document.body`.                          |
| `CanvasPlatformer`    | Renders several sibling roots.                                                           |
| `CanvasSnake`         | Renders several sibling roots.                                                           |
| `ComboBox`            | Renders several sibling roots.                                                           |
| `DebugGrid`           | Renders no element. It appends an overlay `div` to `document.body`.                      |
| `ModalStack`          | Renders the wrapper that positions open modals. Pass `aug` to the modal instead.         |
| `ModalTrigger`        | Renders a `span` with `display: contents`, which has no box to clip.                     |
| `Providers`           | Renders no element. It mounts the hotkey and modal providers.                            |
| `RadioButtonGroup`    | Renders a list of `RadioButton` elements with no shared root.                            |
| `Select`              | Renders several sibling roots.                                                           |
| `OutsideElementEvent` | Detects events outside its box. It renders one `div` and takes only `class` and `style`. |
| `AS400`               | Page template built from other components.                                               |
| `CLITemplate`         | Page template built from other components.                                               |
| `DashboardRadar`      | Page template built from other components.                                               |
| `Denabase`            | Page template built from other components.                                               |
| `InvoiceTemplate`     | Page template built from other components.                                               |
| `MessagesInterface`   | Page template built from other components.                                               |
| `OneLineLoaders`      | Page template built from other components.                                               |
| `PageConceptOne`      | Page template built from other components.                                               |
| `PageConceptTwo`      | Page template built from other components.                                               |
| `ResultsList`         | Page template built from other components.                                               |
| `UpdatingDataTable`   | Returns a `DataTable`. Pass `aug` and `theme` to a `DataTable` instead.                  |
| `ModalProvider`       | Renders no element. It provides the modal context.                                       |
| `IntDevLogo`          | Renders an `svg` and takes SVG attributes only.                                          |
| `MouseIcon`           | Renders an `svg` and takes `button`, `size` and `style` only.                            |
| `Sphere`              | Renders an `svg` and takes `size`, `segments` and `style` only.                          |

<!-- generated:end skipped -->

## Chrome strip rules

An element that has `aug` loses the native line, fill, or elevation that the aug replaces. The rules sit at the end of each component module, and each one selects a data attribute that `styleAttributes` sets on the root element.

- `data-aug-border` removes the native line, such as a `border` or an inset `box-shadow`. The `Card` and `CardDouble` rules, the `Input` field line, and the secondary `Button` line are of this kind.
- `data-aug-inlay` removes the native fill, so the inlay is the only fill. A primary `Button` then writes its text in `--theme-ink`.
- `data-augmented-ui` removes the elevation shadow, because `clip-path` clips it and leaks a 1px edge.

Each rule matches the element that carries the attribute and the parts of it that form its frame. A rule never reaches a component nested inside, so a plain `Card` or `Button` inside an augmented `Card` keeps its own lines. Hover, focus, and active rules are not stripped.

<!-- generated:start strip -->

44 rules in 26 modules.

| Module         | Selector                                                                                   | Declarations                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `ActionBar`    | `.root:where([data-aug-border])`                                                           | `box-shadow: none`                                                                                                |
| `ActionBar`    | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `ActionButton` | `.root:where([data-aug-border]) > .content`                                                | `box-shadow: none`                                                                                                |
| `ActionButton` | `.root:where([data-aug-inlay]) > .content`                                                 | `background: none`                                                                                                |
| `AlertBanner`  | `.root:where([data-augmented-ui])`                                                         | `box-shadow: none`                                                                                                |
| `AlertBanner`  | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `Avatar`       | `.placeholder:where([data-aug-inlay])`                                                     | `background: none`                                                                                                |
| `Badge`        | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `BarLoader`    | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `BarProgress`  | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `Block`        | `.block:where([data-aug-inlay])`                                                           | `background: none`                                                                                                |
| `Button`       | `.primary:where([data-aug-inlay])`                                                         | `background: none; color: var(--theme-ink)`                                                                       |
| `Button`       | `.disabled:where([data-aug-inlay])`                                                        | `background: none`                                                                                                |
| `Button`       | `.secondary:where([data-aug-inlay])`                                                       | `background: none`                                                                                                |
| `Button`       | `.secondary:where([data-aug-border])`                                                      | `box-shadow: none`                                                                                                |
| `Card`         | `.card:where([data-aug-border]) > .children`                                               | `box-shadow: none`                                                                                                |
| `Card`         | `.card:where([data-aug-border]) > .action > :is(.left, .leftCorner, .right, .rightCorner)` | `box-shadow: none`                                                                                                |
| `CardDouble`   | `.card:where([data-aug-border]) > .children`                                               | `border: none; padding-left: 2ch; padding-right: 2ch; padding-bottom: calc(var(--theme-line-height-base) * 1rem)` |
| `CardDouble`   | `.card:where([data-aug-border]) > .action > :is(.left, .leftCorner, .right, .rightCorner)` | `border-top: none; border-left: none; border-right: none`                                                         |
| `Checkbox`     | `.section:where([data-aug-border]) > .right`                                               | `box-shadow: none`                                                                                                |
| `CodeBlock`    | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `Dialog`       | `.root:where([data-augmented-ui])`                                                         | `box-shadow: none`                                                                                                |
| `Dialog`       | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `Divider`      | `.divider:where([data-aug-border]) > .line`                                                | `background: none`                                                                                                |
| `Divider`      | `.gradient:where([data-aug-border])`                                                       | `background: none`                                                                                                |
| `DropdownMenu` | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `Input`        | `.root:where([data-aug-border]) > .inputContainer > .displayed`                            | `box-shadow: none`                                                                                                |
| `Input`        | `.root:where([data-aug-inlay]) > .inputContainer > .displayed`                             | `background: none`                                                                                                |
| `ListItem`     | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `Message`      | `.message:where([data-augmented-ui]) > .right > .bubble`                                   | `box-shadow: none`                                                                                                |
| `Message`      | `.message:where([data-aug-inlay]) > .right > .bubble`                                      | `background: none`                                                                                                |
| `Message`      | `.message:where([data-aug-inlay]) > .left > .triangle`                                     | `border-right-color: transparent`                                                                                 |
| `Navigation`   | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `Panel`        | `.root:where([data-aug-border])`                                                           | `border: none`                                                                                                    |
| `Panel`        | `.root:where([data-aug-inlay]) > .body`                                                    | `background: none`                                                                                                |
| `Panel`        | `.root:where([data-augmented-ui])`                                                         | `box-shadow: none`                                                                                                |
| `Popover`      | `.root:where([data-augmented-ui])`                                                         | `box-shadow: none`                                                                                                |
| `Popover`      | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `RadioButton`  | `.section:where([data-aug-border]) > .right`                                               | `box-shadow: none`                                                                                                |
| `Surface`      | `.surface:where([data-aug-inlay])`                                                         | `background: none`                                                                                                |
| `Tooltip`      | `.root:where([data-augmented-ui])`                                                         | `box-shadow: none`                                                                                                |
| `Tooltip`      | `.root:where([data-aug-inlay])`                                                            | `background: none`                                                                                                |
| `Window`       | `.window:where([data-augmented-ui])`                                                       | `box-shadow: none`                                                                                                |
| `Window`       | `.window:where([data-aug-inlay])`                                                          | `background: none`                                                                                                |

<!-- generated:end strip -->

`vp build`, `vp preview --port 4173`, and then `vpx scripts/chrome-strip.ts` check these rules in a browser for `Card`, `CardDouble`, `Dialog`, `Input`, `Window`, `Button`, `Popover`, and `Tooltip`.
