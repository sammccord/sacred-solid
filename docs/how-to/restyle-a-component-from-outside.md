# Restyle a component from outside

To restyle a component without a descendant selector, pass `class` for its root and `classes` for its parts. This page also shows the parts built for HUD screens, which are selected rows, tabs, a collapsible section header, and key hints with icons.

## Add a class to the root

Every exported component that renders an element takes `class` and merges it with its own. Library CSS sits in the `sacred` cascade layers, so a plain rule of yours beats a library rule on the same property in any load order. See [Why CSS layers](../explanation/why-css-layers.md).

```tsx
import { Badge, Text } from "sacred-solid";

<Badge class="tag">NEW</Badge>;
<Text class="lead" theme={{ ink: "#4de1e0" }}>
  Cyan text.
</Text>;
```

[Class targets](../reference/class-targets.md) lists the element that gets the class for each component. Where a component has several sibling roots, such as `Select`, `ComboBox` and `Accordion`, the class goes on the one that visually owns it. A modal forwards `class` to the card it renders, the same way it forwards `aug` and `theme`. Four components render no element, `Providers`, `ModalProvider`, `BodyPortal` and `DebugGrid`, and take no class. `tests/no-element.test.tsx` fails if one of them starts to render an element.

## Put your CSS in a layer

Plain CSS already wins. If you organize your own CSS in layers, state the order before the library loads, with `sacred` between your layers.

```css
@layer reset, sacred, app;

@layer app {
  .lead {
    padding: 0;
  }
}
```

A rule in `app` beats the library and a rule in `reset` loses to it. Unlayered rules beat both. See [Why CSS layers](../explanation/why-css-layers.md).

## Restyle the parts with classes

A component with inner parts takes `classes`, an object that maps a part name to a class. The type is `SlotClasses`, and each component exports its part names.

```tsx
import { Panel } from "sacred-solid";

<Panel title="CODE MATRIX" classes={{ header: "matrix-header", body: "matrix-body" }}>
  Rows.
</Panel>;
```

| Component   | Parts                                     |
| ----------- | ----------------------------------------- |
| `Panel`     | `header`, `icon`, `title`, `meta`, `body` |
| `KeyHint`   | `cap`, `label`                            |
| `Tabs`      | `tab`, `icon`, `label`                    |
| `Accordion` | `header`, `icon`, `title`, `body`         |
| `Table`     | `body`                                    |

`Panel` also takes `padding`, a CSS shorthand string for the body. It defaults to none, so the body stays flush.

```tsx
import { Panel } from "sacred-solid";

<Panel title="CODE MATRIX" padding="1ch 2ch">
  Rows.
</Panel>;
```

A part keeps its library class and gains yours. Do not add a prop for each CSS property. Pass a class.

## Tint text with the theme prop

`theme={{ ink: "..." }}` sets `--theme-ink` and also sets `color: var(--theme-ink)` on the element. Text color is inherited as a computed value, so without that declaration a changed `--theme-ink` would recolor nothing. A `color` in `style` replaces it. Use this for a cyan title or an amber warning instead of a new role.

## Mark a row selected

`ListItem` takes `selected`. It fills with `--theme-accent`. With an `aug.inlay`, the inlay takes `--theme-accent`, so a selected row keeps its clipped shape. `ListItem` forwards the other attributes, so `onClick`, `onFocus` and `class` work.

```tsx
import { ListItem } from "sacred-solid";

<ul>
  <ListItem selected aug={{ br: "clip", border: true, inlay: true }}>
    Selected row
  </ListItem>
</ul>;
```

`ArrowUp` and `ArrowDown` move focus between list items. Select on `onFocus` to make the keys move the selection.

## Show tabs

`Tabs` renders a `tablist`. The selected tab uses `--theme-control-foreground`. `ArrowLeft` and `ArrowRight` call `onChange` and move focus.

```tsx
import { createSignal } from "solid-js";
import { Tabs } from "sacred-solid";

const items = [
  { id: "map", label: "MAP" },
  { id: "journal", label: "JOURNAL" },
];

export function Menu() {
  const [value, setValue] = createSignal("journal");
  return <Tabs items={items} value={value()} onChange={setValue} />;
}
```

## Give tabs panels

An item may carry a `panel`. `Tabs` renders the selected panel after the tab list in an element with `role="tabpanel"`, and wires `aria-controls` and `aria-labelledby` between the tab and the panel. Without `value`, `Tabs` keeps the selection itself, starting at `defaultValue` or the first item. With `value`, you control it and `onChange` reports each change.

To build a panel only while its tab is selected, define it with a getter. A plain element is created up front.

```tsx
import { Tabs } from "sacred-solid";

const items = [
  { id: "map", label: "MAP", panel: <p>Map.</p> },
  {
    id: "journal",
    label: "JOURNAL",
    get panel() {
      return <p>Built when the tab opens.</p>;
    },
  },
];

<Tabs items={items} defaultValue="journal" classes={{ panel: "tab-panel" }} />;
```

## Scroll with a fade and a rail

`ScrollArea` scrolls its children vertically. Give its root a height, with `class` or `style`. `fade` fades the top edge only while there is content above, and the bottom edge only while there is content below. `scrollbar` is `native`, `hidden`, or `rail`. A rail is a thin track with a thumb that follows the scroll position. It never shows when nothing scrolls.

```tsx
import { ScrollArea } from "sacred-solid";

<ScrollArea
  class="quests"
  fade
  scrollbar="rail"
  classes={{ rail: "quests-rail", thumb: "quests-thumb" }}
>
  Rows.
</ScrollArea>;
```

Set the size of each fade in your CSS, on the root or any ancestor. The default is `2rem`.

```css
.quests {
  height: 400px;
  --scroll-fade-top: 16px;
  --scroll-fade-bottom: 70px;
}
```

`viewportRef` hands you the scrolling element, to set `scrollTop` or to read it.

## Put aug on an accordion

`Accordion` takes `aug` and `theme`. They go on the header row, through `Row`. The body row is a plain row with a left padding of `1ch`, set in CSS, so `classes.body` can change it.

```tsx
import { Accordion } from "sacred-solid";

<Accordion
  title="SIDE JOBS"
  defaultValue
  aug={{ br: { mixin: "clip", size: "16px" }, border: true }}
>
  Rows.
</Accordion>;
```

## Resize a solid progress bar

`BarProgress` with `variant="solid"` is 0.5rem tall by default. The fill is always the full height of the root. Set the height with `class` or `style`.

```tsx
import { BarProgress } from "sacred-solid";

<BarProgress variant="solid" progress={40} style={{ height: "4px", width: "60px" }} />;
```

## Leave out the navigation logo

`Navigation` renders a logo button. Pass `logo={false}` to render none, and the bar starts with `left`.

```tsx
import { Navigation } from "sacred-solid";

<Navigation logo={false} left="FILE" right="12:00">
  Title
</Navigation>;
```

## Replace the accordion chevron

`Accordion` takes `icon`, a function of the open state, and `classes`.

```tsx
import { Accordion } from "sacred-solid";

<Accordion title="SIDE JOBS" defaultValue icon={(open) => (open ? "-" : "+")}>
  Rows.
</Accordion>;
```

## Put icons in key hints

`KeyHint` keys can be any element. A string draws a boxed cap, and an element draws bare, so an icon keeps its own outline. `MouseIcon` draws a mouse with one button filled.

```tsx
import { KeyHint, MouseIcon } from "sacred-solid";

<KeyHint keys={[<MouseIcon button="left" />]}>Select</KeyHint>;
<KeyHint keys={["ESC"]}>Close</KeyHint>;
<KeyHint keys={[<MouseIcon button="left" />, "F"]}>Select code</KeyHint>;
```
