# Surface

`Surface` is a panel for layered translucency. `sacred-solid` exports `Surface` and `SurfaceProps` from `src/components/Surface.tsx`.

## Props

`SurfaceProps` extends `JSX.HTMLAttributes<HTMLDivElement>` without `style`, and adds these.

| Prop       | Type                | Default | Meaning                                                           |
| ---------- | ------------------- | ------- | ----------------------------------------------------------------- |
| `glow`     | `string`            | none    | A CSS color. Sets a `drop-shadow` filter on the glow wrapper.     |
| `glowSize` | `string`            | `"6px"` | The blur radius of the glow. It has no effect without `glow`.     |
| `blur`     | `string`            | none    | A length. Sets `backdrop-filter: blur()` on the backdrop layer.   |
| `style`    | `JSX.CSSProperties` | none    | Merged with the aug and theme variables on the surface element.   |
| `aug`      | `AugProps`          | none    | Applied to the surface element. The backdrop layer gets its clip. |
| `theme`    | `ThemeProps`        | none    | Applied to the surface element and so to everything inside it.    |

`class`, `children`, and every other attribute go to the surface element too. `glow`, `glowSize`, and `blur` follow changes to the prop.

## Elements

`Surface` renders four elements.

| Element      | Position in the tree            | Receives                                                                                                                                                                                |
| ------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root         | The outermost `div`.            | `position: relative`, `display: block`. No inline style and no attributes.                                                                                                              |
| Backdrop     | First child of the root.        | `aria-hidden="true"`, `position: absolute`, `inset: 0`, `pointer-events: none`. When `blur` is set, `backdrop-filter` and `-webkit-backdrop-filter` set to `blur()`. The clip of `aug`. |
| Glow wrapper | Second child of the root.       | `display: block`. When `glow` is set, `filter: drop-shadow(0 0 <glowSize> <glow>)`.                                                                                                     |
| Surface      | Only child of the glow wrapper. | `class`, `children`, rest attributes, `aug`, `theme`, `style`. The fill `var(--theme-surface-float)`.                                                                                   |

The backdrop layer is empty. It takes the clip of `aug`, which is every key except `border` and `inlay`. If `aug` has only `border` or `inlay`, or no `aug` is set, the backdrop layer has no `data-augmented-ui` attribute.

## Behavior

- With no `glow` and no `blur`, none of the four elements has an inline style, a filter, or a backdrop filter. With no `aug` either, `Surface` creates no stacking context.
- The fill is `--theme-surface-float`. With `aug.inlay`, the rule `.surface:where([data-aug-inlay])` sets the background to `none`, so the inlay is the only fill.
- `theme` sets variables on the surface element only. The root, the backdrop layer, and the glow wrapper do not get them.
- The surface element has no `filter` of its own. The glow filter is on its parent.

## Source

`src/components/Surface.tsx` and `src/components/Surface.module.css`. `tests/surface.test.tsx` covers the structure and the props. See [Add glow and blur](../how-to/add-glow-and-blur.md) for use, and [How aug and the chrome strip work](../explanation/how-aug-and-chrome-strip-work.md) for why the structure has four elements.
