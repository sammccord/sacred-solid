# Class targets

Every exported component that renders an element takes `class`, and it is merged with the library class by `classNames`. This page lists the element that receives it, the parts that take a class through `classes`, and the components that render no element. `scripts/gen-docs.ts` builds both tables from `src/components`, and it fails when a component never reads `props.class` or `local.class`.

Where a component has several sibling roots, `class` goes on the one that visually owns it. The note column says which. When no `class` is passed the markup is the same as before. See [Restyle a component from outside](../how-to/restyle-a-component-from-outside.md).

## Where class goes

<!-- generated:start targets -->

91 components take `class`. An uppercase tag is a component that receives it and passes it on.

| Component               | `class` goes on       | `classes` parts                           | Note                                                                                                                            |
| ----------------------- | --------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `ASCIICanvas`           | `<pre>`               | none                                      |                                                                                                                                 |
| `Accordion`             | `<Row>`               | `header`, `icon`, `title`, `body`         | Two sibling rows with no wrapper. `class` goes on the header row, which is always present. `classes.body` styles the other row. |
| `ActionBar`             | `<div>`               | none                                      |                                                                                                                                 |
| `ActionButton`          | `<div>`               | none                                      |                                                                                                                                 |
| `ActionListItem`        | `<div>`, `<a>`        | none                                      | A `div`, or an `a` when `href` is set.                                                                                          |
| `AlertBanner`           | `<div>`               | none                                      |                                                                                                                                 |
| `Avatar`                | `<Show>`, `<div>`     | none                                      | With children, on the wrapping `div`. Without, on the `figure` or `a`.                                                          |
| `Badge`                 | `<span>`              | none                                      |                                                                                                                                 |
| `BarLoader`             | `<div>`               | none                                      |                                                                                                                                 |
| `BarProgress`           | `<div>`               | none                                      |                                                                                                                                 |
| `Block`                 | `<span>`              | none                                      |                                                                                                                                 |
| `BlockLoader`           | `<span>`              | none                                      |                                                                                                                                 |
| `BreadCrumbs`           | `<nav>`               | none                                      |                                                                                                                                 |
| `Button`                | `<HTMLButtonElement>` | none                                      | Also set on the `div` a disabled Button renders.                                                                                |
| `ButtonGroup`           | `<div>`               | none                                      |                                                                                                                                 |
| `CanvasPlatformer`      | `<div>`               | none                                      | Several sibling roots. `class` goes on the `div` around the canvas, not on the buttons.                                         |
| `CanvasSnake`           | `<div>`               | none                                      | Several sibling roots. `class` goes on the `div` around the canvas, not on the buttons.                                         |
| `Card`                  | `<article>`           | none                                      |                                                                                                                                 |
| `CardDouble`            | `<article>`           | none                                      |                                                                                                                                 |
| `Checkbox`              | `<div>`               | none                                      |                                                                                                                                 |
| `Chessboard`            | `<table>`             | none                                      |                                                                                                                                 |
| `CodeBlock`             | `<pre>`               | none                                      |                                                                                                                                 |
| `ComboBox`              | `<div>`               | none                                      | Several sibling roots. `class` goes on the `div` that holds the input.                                                          |
| `ContentFluid`          | `<div>`               | none                                      |                                                                                                                                 |
| `DOMSnake`              | `<div>`               | none                                      |                                                                                                                                 |
| `DataTable`             | `<table>`             | none                                      |                                                                                                                                 |
| `DatePicker`            | `<div>`               | none                                      |                                                                                                                                 |
| `Dialog`                | `<div>`               | none                                      |                                                                                                                                 |
| `Divider`               | `<div>`               | none                                      |                                                                                                                                 |
| `Drawer`                | `<div>`               | none                                      |                                                                                                                                 |
| `DropdownMenu`          | `<div>`               | none                                      |                                                                                                                                 |
| `DropdownMenuTrigger`   | `<div>`               | none                                      | On the wrapper around the trigger. The menu opens in a portal and gets none.                                                    |
| `Grid`                  | `<div>`               | none                                      |                                                                                                                                 |
| `HoverComponentTrigger` | `<div>`               | none                                      | On the wrapper around the trigger. The popover opens in a portal and gets none.                                                 |
| `Indent`                | `<div>`               | none                                      |                                                                                                                                 |
| `Input`                 | `<HTMLInputElement>`  | none                                      | On the outer `div`, not on the hidden `input`. Other props go on the hidden `input`.                                            |
| `KeyHint`               | `<div>`               | `cap`, `label`                            |                                                                                                                                 |
| `ListItem`              | `<li>`                | none                                      |                                                                                                                                 |
| `MatrixLoader`          | `<div>`               | none                                      |                                                                                                                                 |
| `Message`               | `<div>`               | none                                      |                                                                                                                                 |
| `MessageViewer`         | `<div>`               | none                                      |                                                                                                                                 |
| `ModalStack`            | `<div>`               | none                                      | On the positioning wrapper. Each open modal renders its own class on its card.                                                  |
| `ModalTrigger`          | `<span>`              | none                                      | On the `span` with `display: contents`, which has no box of its own.                                                            |
| `Navigation`            | `<nav>`               | none                                      |                                                                                                                                 |
| `NumberRangeSlider`     | `<div>`               | none                                      |                                                                                                                                 |
| `Panel`                 | `<section>`           | `header`, `icon`, `title`, `meta`, `body` |                                                                                                                                 |
| `Popover`               | `<div>`               | none                                      |                                                                                                                                 |
| `RadioButton`           | `<div>`               | none                                      |                                                                                                                                 |
| `RadioButtonGroup`      | `<RadioButton>`       | none                                      | No wrapper. `class` goes on every `RadioButton` it renders.                                                                     |
| `Row`                   | `<section>`           | none                                      |                                                                                                                                 |
| `RowEllipsis`           | `<section>`           | none                                      |                                                                                                                                 |
| `RowSpaceBetween`       | `<section>`           | none                                      |                                                                                                                                 |
| `ScrollArea`            | `<div>`               | `viewport`, `content`, `rail`, `thumb`    | On the outer wrapper, which also carries `aug` and `theme`. `classes.viewport` styles the scrolling element.                    |
| `Select`                | `<section>`           | none                                      | Several sibling roots. `class` goes on the `section` that holds the control and the menu.                                       |
| `SidebarLayout`         | `<div>`               | none                                      |                                                                                                                                 |
| `SimpleTable`           | `<div>`               | none                                      | On the scroll wrapper `div`, which also carries `aug` and `theme`.                                                              |
| `Surface`               | `<div>`               | none                                      | On the innermost element, with `aug` and `theme`. The backdrop layer gets none.                                                 |
| `Table`                 | `<table>`             | `body`                                    |                                                                                                                                 |
| `TableColumn`           | `<td>`                | none                                      |                                                                                                                                 |
| `TableRow`              | `<tr>`                | none                                      |                                                                                                                                 |
| `Tabs`                  | `<div>`               | `tab`, `icon`, `label`, `panel`           |                                                                                                                                 |
| `Text`                  | `<p>`                 | none                                      |                                                                                                                                 |
| `TextArea`              | `<div>`               | none                                      | On the outer `div`, not on the hidden `textarea`. Other props go on the hidden `textarea`.                                      |
| `Tooltip`               | `<div>`               | none                                      |                                                                                                                                 |
| `TreeView`              | `<div>`               | none                                      |                                                                                                                                 |
| `Window`                | `<section>`           | none                                      |                                                                                                                                 |
| `OutsideElementEvent`   | `<div>`               | none                                      | The detector `div`. It has no library class.                                                                                    |
| `AS400`                 | `<Window>`            | none                                      | A page template. `class` goes on the `Window` it renders.                                                                       |
| `CLITemplate`           | `<Window>`            | none                                      | A page template. `class` goes on the `Window` it renders.                                                                       |
| `DashboardRadar`        | `<Window>`            | none                                      | A page template. `class` goes on the `Window` it renders.                                                                       |
| `Denabase`              | `<Window>`            | none                                      | A page template. `class` goes on the `Window` it renders.                                                                       |
| `InvoiceTemplate`       | `<Window>`            | none                                      | A page template. `class` goes on the `Window` it renders.                                                                       |
| `MessagesInterface`     | `<Window>`            | none                                      | A page template. `class` goes on the `Window` it renders.                                                                       |
| `OneLineLoaders`        | `<Card>`              | none                                      | A page template. `class` goes on the `Card` it renders.                                                                         |
| `PageConceptOne`        | `<div>`               | none                                      | A page template. `class` goes on its root `div`.                                                                                |
| `PageConceptTwo`        | `<div>`               | none                                      | A page template. `class` goes on its root `div`.                                                                                |
| `ResultsList`           | `<Window>`            | none                                      | A page template. `class` goes on the `Window` it renders.                                                                       |
| `UpdatingDataTable`     | `<DataTable>`         | none                                      | Forwarded to the `DataTable` it renders.                                                                                        |
| `ModalAlert`            | `<Card>`              | none                                      | Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.                                               |
| `ModalCanvasPlatformer` | `<Card>`              | none                                      | Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.                                               |
| `ModalCanvasSnake`      | `<Card>`              | none                                      | Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.                                               |
| `ModalChess`            | `<CardDouble>`        | none                                      | Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.                                               |
| `ModalCreateAccount`    | `<CardDouble>`        | none                                      | Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.                                               |
| `ModalDOMSnake`         | `<Card>`              | none                                      | Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.                                               |
| `ModalError`            | `<CardDouble>`        | none                                      | Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.                                               |
| `ModalMatrixModes`      | `<Card>`              | none                                      | Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.                                               |
| `DefaultActionBar`      | `<div>`               | none                                      |                                                                                                                                 |
| `DefaultLayout`         | `<div>`               | none                                      |                                                                                                                                 |
| `IntDevLogo`            | `<svg>`               | none                                      |                                                                                                                                 |
| `MouseIcon`             | `<svg>`               | none                                      |                                                                                                                                 |
| `Sphere`                | `<svg>`               | none                                      |                                                                                                                                 |

<!-- generated:end targets -->

## No element, no class

<!-- generated:start exempt -->

4 exported components render no element, so they take no `class`.

| Component       | Reason                                                                        |
| --------------- | ----------------------------------------------------------------------------- |
| `BodyPortal`    | Renders no element. It moves its children into `document.body`.               |
| `DebugGrid`     | Renders no element. It appends an overlay `div` to `document.body` on demand. |
| `ModalProvider` | Renders no element. It provides the modal context.                            |
| `Providers`     | Renders no element. It mounts the hotkey and modal providers.                 |

<!-- generated:end exempt -->

`tests/no-element.test.tsx` renders each of these and fails if one starts to render an element of its own.
