# Retheme a subtree

To change colors, line widths, or shadows for one component and everything inside it, pass the `theme` prop. It sets `--theme-*` variables on the component's root element, and the variables inherit down.

## Override tokens on one component

Use the camelCase key of each token. [Theme tokens](../reference/theme-tokens.md) lists every key.

```tsx
import { Dialog, Window } from "sacred-solid";

<Window
  theme={{ inkInverse: "#021", surfaceInverse: "aquamarine", surfaceFloat: "rgb(0 30 40 / 0.85)" }}
>
  <Dialog title="CONFIRM">Delete everything?</Dialog>
</Window>;
```

The `Dialog` header takes the aquamarine fill and the dark ink, and the `Dialog` panel takes the translucent fill. Anything outside the `Window` keeps the page theme.

A key that is not in the token table fails to compile. A value can be any CSS value, including a translucent color or a length such as `"3px"`.

## Override a constant

To change a line width or a shadow geometry, use the same prop. Constants have keys too.

```tsx
import { Window } from "sacred-solid";

<Window theme={{ lineWidthStrong: "1px", shadowWindowGeometry: "0 0 24px 0" }}>Hairline.</Window>;
```

## Let a component style win

If the component also has a `style` prop that sets a `--theme-*` variable, the component's `style` wins over the `theme` prop.

```tsx
import { Badge } from "sacred-solid";

<Badge theme={{ ink: "blue" }} style={{ "--theme-ink": "red" }}>
  Red.
</Badge>;
```

## Theme a modal

To theme a modal, pass `theme` in its props. A modal renders under `<body>`, so a `theme` on an ancestor does not reach it. The modal hands `theme` to the card it renders.

```tsx
import { Button, ModalAlert, ModalTrigger } from "sacred-solid";

<ModalTrigger modal={ModalAlert} modalProps={{ message: "Saved", theme: { lineStrong: "gold" } }}>
  <Button>Open</Button>
</ModalTrigger>;
```

## Theme menus, popovers, and tooltips

To theme a menu, popover, or tooltip that a component opens, set the tokens on `<body>` with a theme block. Those elements render under `<body>`, outside your subtree. `DropdownMenuTrigger` and `HoverComponentTrigger` apply `theme` to their wrapper only. See [Switch and write a theme](switch-and-write-a-theme.md).

## Set each token directly

If a token value refers to another `--theme-*` variable, the reference resolves where you wrote it. Give every token you want to change its own value. See [Why role tokens](../explanation/why-role-tokens.md).
