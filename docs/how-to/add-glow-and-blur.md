# Add glow and blur

To give a panel a colored glow, a blurred backdrop, or both, use `Surface`. It takes `aug` and `theme` like every other component, plus `glow`, `glowSize`, and `blur`. See [Surface](../reference/surface.md) for the full prop list.

## Add a glow

Pass any CSS color to `glow`.

```tsx
import { Surface } from "sacred-solid";

<Surface glow="cyan">Signal.</Surface>;
```

The glow blur radius is 6px by default. To change it, set `glowSize`.

```tsx
import { Surface } from "sacred-solid";

<Surface glow="rgb(0 255 255 / 0.5)" glowSize="14px">
  Signal.
</Surface>;
```

`glowSize` does nothing without `glow`.

## Blur the page behind the panel

To blur what shows through the panel, pass a length to `blur`. The panel needs a translucent fill, or the blur is hidden.

```tsx
import { Surface } from "sacred-solid";

<Surface blur="8px" theme={{ surfaceFloat: "rgb(0 20 40 / 0.2)" }}>
  Glass.
</Surface>;
```

The fill comes from `--theme-surface-float`, so `surfaceFloat` in the `theme` prop sets it for this panel only.

## Shape the panel

To clip the glow and the blur to a shape, pass `aug`. The glow follows the outline, and the blur takes the same clip.

```tsx
import { Surface } from "sacred-solid";

<Surface
  glow="cyan"
  blur="8px"
  aug={{ tl: { mixin: "clip", size: "24px" }, border: { all: "2px", bg: "cyan" } }}
  theme={{ surfaceFloat: "rgb(0 20 40 / 0.2)" }}
  style={{ padding: "2ch" }}
>
  Glass.
</Surface>;
```

With `aug.inlay`, the native fill goes and the inlay becomes the only fill.

## Pass attributes and styles

`Surface` accepts any `div` attribute, `class`, and `style`. They go on the innermost element, the one that carries `aug` and `theme`.

```tsx
import { Surface } from "sacred-solid";

<Surface id="status" class="panel" style={{ padding: "2ch" }} glow="cyan">
  Signal.
</Surface>;
```

## Avoid glow on the clipped element

To keep a glow visible, never put `box-shadow` or `filter` on an element that has `aug`. The clip cuts them off. Put the effect on a wrapper, which is what `Surface` does. See [How aug and the chrome strip work](../explanation/how-aug-and-chrome-strip-work.md).
