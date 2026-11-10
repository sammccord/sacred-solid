# Apply an aug shape

To clip, outline, or fill a component with an augmented-ui shape, pass it the `aug` prop. The stylesheet ships in `sacred-solid/style.css`, so you import nothing extra. Check [components with aug](../reference/components-with-aug.md) first, because a few components have no `aug` prop.

## Clip a corner

To cut a corner at 45 degrees, name the region and the mixin.

```tsx
import { Button } from "sacred-solid";

<Button aug={{ tl: "clip", br: "clip" }}>Save</Button>;
```

The regions are `tl`, `t`, `tr`, `r`, `br`, `b`, `bl`, and `l`. If a mixin does not exist for a region, the code does not compile. See [aug props](../reference/aug-props.md) for the mixins each region accepts.

## Set the size of a shape

To change the size, pass an object with `mixin` and `size`.

```tsx
import { Card } from "sacred-solid";

<Card
  title="STATUS"
  aug={{
    tl: { mixin: "clip", size: "24px" },
    br: { mixin: "scoop", size: "16px" },
  }}
>
  Systems nominal.
</Card>;
```

## Draw a border

To draw a border that follows the shape, set `border`. Use `true` for the default width, a string for the width, or an object for the width and the paint.

```tsx
import { Card } from "sacred-solid";

<Card
  title="STATUS"
  aug={{
    tl: { mixin: "clip", size: "24px" },
    border: { all: "2px", bg: "var(--theme-line-strong)" },
  }}
>
  Systems nominal.
</Card>;
```

`border: true` draws a line in `--theme-line-strong` as wide as `--theme-line-width`, so it follows the theme. Set `bg` or a width only when you want something else. The component loses its native line when it has `aug.border`. Hover, focus, and active states stay.

## Fill with an inlay

To replace the native fill with one that follows the shape, set `inlay`. It takes the same forms as `border`. For an inlay, the width options are distances from the border. `inlay: true` fills with `--theme-surface-float`, and the distance from the border is `--theme-line-width`.

```tsx
import { Block } from "sacred-solid";

<Block aug={{ tl: "clip", inlay: { all: "3px", bg: "rgb(0 255 255 / 0.3)" } }}>READY</Block>;
```

## Draw a whole shape

To draw a hexagon or a triangle, use `all`. The shape sets the size of the element, so give the element a layout that centers its content.

```tsx
import { Badge } from "sacred-solid";

<Badge
  aug={{ all: { mixin: "hex", width: "12ch" }, border: "2px" }}
  style={{ display: "inline-flex", "align-items": "center", "justify-content": "center" }}
>
  v1
</Badge>;
```

## Keep a clipped corner from cutting text

If a clip cuts the first letter of a label, add padding. `Tooltip`, the `Input` label, and `Badge` have no padding, so a large clip reaches the text.

```tsx
import { Badge } from "sacred-solid";

<Badge aug={{ tl: { mixin: "clip", size: "24px" } }} style={{ padding: "0 2ch" }}>
  v1 label
</Badge>;
```

## Nest augmented components

To put an augmented component inside another, nest them. No wrapper element is needed.

```tsx
import { Button, Card } from "sacred-solid";

<Card title="OUTER" aug={{ tl: { mixin: "clip", size: "24px" }, border: "2px" }}>
  <Button variant="SECONDARY" aug={{ br: { mixin: "clip", size: "12px" }, border: "2px" }}>
    Save
  </Button>
</Card>;
```

A plain `Card` or `Button` inside an augmented one keeps its own lines.

## Shape a modal

To shape a modal, pass `aug` in its props. The modal hands it to the card it renders, not to the positioning wrapper.

```tsx
import { Button, ModalAlert, ModalTrigger } from "sacred-solid";

<ModalTrigger
  modal={ModalAlert}
  modalProps={{ message: "Saved", aug: { tl: "clip", border: "2px" } }}
>
  <Button>Open</Button>
</ModalTrigger>;
```

## Add glow or shadow

To put a glow around an augmented element, wrap it in a `Surface`. A shadow or filter on the clipped element is cut off. See [Add glow and blur](add-glow-and-blur.md).
