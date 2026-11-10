# aug props

`AugProps` is the type of the `aug` prop. `sacred-solid` exports it and the types below. The prop turns on [augmented-ui](https://augmented-ui.com) for the root element of a component. [Components with aug](components-with-aug.md) lists the components that take it.

## Keys

| Key                                        | Value                                                           |
| ------------------------------------------ | --------------------------------------------------------------- |
| `tl`, `t`, `tr`, `r`, `br`, `b`, `bl`, `l` | A region mixin name, or an object with `mixin` and options      |
| `all`                                      | A whole-shape mixin name, or an object with `mixin` and options |
| `border`                                   | `true`, a width string, or an object of options                 |
| `inlay`                                    | `true`, a width string, or an object of options                 |

Every key is optional. An empty object emits nothing.

## Exported types

| Type                  | Meaning                                                         |
| --------------------- | --------------------------------------------------------------- |
| `AugProps`            | The whole prop.                                                 |
| `AugRegion`           | A region key, one of the eight.                                 |
| `AugCornerRegion`     | `"tl"`, `"tr"`, `"br"`, or `"bl"`.                              |
| `AugEdgeRegion`       | The regions that are not corners.                               |
| `AugRegionMixin<R>`   | The mixin names valid for region `R`.                           |
| `AugRegionOptions<R>` | An object with `mixin` and the options for region `R`.          |
| `AugRegionValue<R>`   | `AugRegionMixin<R>` or `AugRegionOptions<R>`.                   |
| `AugCornerOptions`    | The options of a corner region, without `mixin`.                |
| `AugEdgeOptions`      | The options of an edge region, without `mixin`.                 |
| `AugAllMixin`         | The whole-shape mixin names.                                    |
| `AugAllValue`         | `AugAllMixin` or an object with `mixin`, `width`, and `height`. |
| `AugSurfaceOptions`   | The options of `border` and `inlay`.                            |
| `AugBorderOptions`    | `AugSurfaceOptions`.                                            |
| `AugInlayOptions`     | `AugSurfaceOptions`.                                            |
| `AugBorderValue`      | `true`, `string`, or `AugBorderOptions`.                        |
| `AugInlayValue`       | `true`, `string`, or `AugInlayOptions`.                         |

## Regions and mixins

A region is a corner or an edge. The corners are `tl`, `tr`, `br`, and `bl`. The edges are `t`, `r`, `b`, and `l`. A region value is a mixin name, or an object with `mixin` and options. The mixin name is the suffix after the region. The attribute token is the region, a hyphen, and the mixin, so `tl` with `"clip"` emits `tl-clip`.

<!-- generated:start region-mixins -->

| Regions                | Kind   | Count | Mixins                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------- | ------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tl`, `tr`, `br`, `bl` | corner | 35    | `2-clip-x`, `2-clip-xy`, `2-clip-y`, `2-rect`, `2-rect-inset`, `2-rect-x`, `2-rect-xy`, `2-rect-y`, `2-round`, `2-round-inset`, `2-round-x`, `2-round-xy`, `2-round-y`, `2-scoop`, `2-scoop-inset`, `2-scoop-x`, `2-scoop-xy`, `2-scoop-y`, `2-step-inset`, `clip`, `clip-inset`, `clip-x`, `clip-y`, `rect`, `rect-x`, `rect-y`, `round`, `round-inset`, `round-x`, `round-y`, `scoop`, `scoop-inset`, `scoop-x`, `scoop-y`, `step-inset` |
| `t`, `b`               | edge   | 15    | `clip`, `clip-x`, `clip-xy`, `clip-y`, `rect`, `rect-x`, `rect-xy`, `rect-y`, `round-x`, `round-xy`, `scoop`, `scoop-x`, `scoop-xy`, `scoop-y`, `step-xy`                                                                                                                                                                                                                                                                                  |
| `r`, `l`               | edge   | 15    | `clip`, `clip-x`, `clip-xy`, `clip-y`, `rect`, `rect-x`, `rect-xy`, `rect-y`, `round-xy`, `round-y`, `scoop`, `scoop-x`, `scoop-xy`, `scoop-y`, `step-xy`                                                                                                                                                                                                                                                                                  |

<!-- generated:end region-mixins -->

The type of `mixin` is the union of the names in the row for that region, so a name that is not in the row fails to compile.

```ts
import type { AugProps } from "sacred-solid";

export const valid: AugProps = {
  t: { mixin: "clip", center: "50%" },
  tl: { mixin: "2-clip-x", inset2: "4px" },
};

// @ts-expect-error
export const noSuchMixin: AugProps = { t: "2-clip-x" };

// @ts-expect-error
export const cornerHasNoCenter: AugProps = { tl: { mixin: "clip", center: "50%" } };
```

## Corner options

A corner region object takes these options next to `mixin`. In the CSS variable column, `{region}` stands for the region key.

<!-- generated:start corner-options -->

| Option      | Type             | CSS variable                | Meaning                                                              |
| ----------- | ---------------- | --------------------------- | -------------------------------------------------------------------- |
| `size`      | string           | `--aug-{region}`            | Size of the shape in the region. The augmented-ui default is 15px.   |
| `size1`     | string           | `--aug-{region}1`           | Size of the first shape in the region.                               |
| `size2`     | string           | `--aug-{region}2`           | Size of the second shape in the region.                              |
| `width1`    | string           | `--aug-{region}1-width`     | Width of the first shape in the region.                              |
| `height1`   | string           | `--aug-{region}1-height`    | Height of the first shape in the region.                             |
| `width2`    | string           | `--aug-{region}2-width`     | Width of the second shape in the region.                             |
| `height2`   | string           | `--aug-{region}2-height`    | Height of the second shape in the region.                            |
| `inset1`    | string           | `--aug-{region}-inset1`     | Distance of the first shape from the start of the region, clockwise. |
| `extend1`   | string           | `--aug-{region}-extend1`    | Distance after the first shape, parallel to the starting edge.       |
| `clipmodX1` | string or number | `--aug-{region}1-clipmod-x` | Horizontal clip ratio of the first shape, from 0 to 1.               |
| `clipmodY1` | string or number | `--aug-{region}1-clipmod-y` | Vertical clip ratio of the first shape, from 0 to 1.                 |
| `clipmodX2` | string or number | `--aug-{region}2-clipmod-x` | Horizontal clip ratio of the second shape, from 0 to 1.              |
| `clipmodY2` | string or number | `--aug-{region}2-clipmod-y` | Vertical clip ratio of the second shape, from 0 to 1.                |
| `inset2`    | string           | `--aug-{region}-inset2`     | Distance of the second shape from the end of the region, clockwise.  |
| `extend2`   | string           | `--aug-{region}-extend2`    | Distance before the second shape, parallel to the ending edge.       |

<!-- generated:end corner-options -->

## Edge options

An edge region object takes these options next to `mixin`.

<!-- generated:start edge-options -->

| Option      | Type             | CSS variable                | Meaning                                                                         |
| ----------- | ---------------- | --------------------------- | ------------------------------------------------------------------------------- |
| `size`      | string           | `--aug-{region}`            | Size of the shape in the region. The augmented-ui default is 15px.              |
| `size1`     | string           | `--aug-{region}1`           | Size of the first shape in the region.                                          |
| `size2`     | string           | `--aug-{region}2`           | Size of the second shape in the region.                                         |
| `width1`    | string           | `--aug-{region}1-width`     | Width of the first shape in the region.                                         |
| `height1`   | string           | `--aug-{region}1-height`    | Height of the first shape in the region.                                        |
| `width2`    | string           | `--aug-{region}2-width`     | Width of the second shape in the region.                                        |
| `height2`   | string           | `--aug-{region}2-height`    | Height of the second shape in the region.                                       |
| `inset1`    | string           | `--aug-{region}-inset1`     | Distance of the first shape from the start of the region, clockwise.            |
| `extend1`   | string           | `--aug-{region}-extend1`    | Distance after the first shape, parallel to the starting edge.                  |
| `clipmodX1` | string or number | `--aug-{region}1-clipmod-x` | Horizontal clip ratio of the first shape, from 0 to 1.                          |
| `clipmodY1` | string or number | `--aug-{region}1-clipmod-y` | Vertical clip ratio of the first shape, from 0 to 1.                            |
| `clipmodX2` | string or number | `--aug-{region}2-clipmod-x` | Horizontal clip ratio of the second shape, from 0 to 1.                         |
| `clipmodY2` | string or number | `--aug-{region}2-clipmod-y` | Vertical clip ratio of the second shape, from 0 to 1.                           |
| `center`    | string           | `--aug-{region}-center`     | Center of the edge region. The default centers it between the corner regions.   |
| `offset`    | string           | `--aug-{region}-offset`     | Shift of the edge region from its center. A negative value moves it left or up. |

<!-- generated:end edge-options -->

An option with the value `undefined` emits nothing. Every other value goes through `String`, so `0.5` becomes `"0.5"`.

## All shapes

`all` takes a whole-shape mixin that configures every region at once. The attribute token is `all-` and the mixin, so `"hex"` emits `all-hex`.

<!-- generated:start all-mixins -->

12 shapes. `hex`, `hex-alt`, `hexangle-bottom`, `hexangle-down`, `hexangle-left`, `hexangle-right`, `hexangle-top`, `hexangle-up`, `triangle-down`, `triangle-left`, `triangle-right`, `triangle-up`.

<!-- generated:end all-mixins -->

The object form takes these options. A whole shape sizes the element, so use `width` or `height` and not the standard CSS size properties.

<!-- generated:start all-options -->

| Option   | Type   | CSS variable       | Meaning                                             |
| -------- | ------ | ------------------ | --------------------------------------------------- |
| `width`  | string | `--aug-all-width`  | Width of the shape. Set width or height, not both.  |
| `height` | string | `--aug-all-height` | Height of the shape. Set width or height, not both. |

<!-- generated:end all-options -->

## Border and inlay

`border` and `inlay` take the same three forms.

| Form      | Attribute token     | Variables                               |
| --------- | ------------------- | --------------------------------------- |
| `true`    | `border` or `inlay` | none                                    |
| A string  | `border` or `inlay` | `--aug-border-all` or `--aug-inlay-all` |
| An object | `border` or `inlay` | One variable for each option set        |

Both also add the attribute `data-aug-border` or `data-aug-inlay` to the element. The strip rules in the component modules select those attributes. See [styleAttributes](style-attributes.md).

<!-- generated:start surface-options -->

| Option    | Type             | Border variable        | Inlay variable        | Meaning                                                                 |
| --------- | ---------------- | ---------------------- | --------------------- | ----------------------------------------------------------------------- |
| `all`     | string           | `--aug-border-all`     | `--aug-inlay-all`     | Border width on all sides. Inlay distance from the border on all sides. |
| `x`       | string           | `--aug-border-x`       | `--aug-inlay-x`       | Border width left and right. Inlay distance left and right.             |
| `y`       | string           | `--aug-border-y`       | `--aug-inlay-y`       | Border width top and bottom. Inlay distance top and bottom.             |
| `top`     | string           | `--aug-border-top`     | `--aug-inlay-top`     | Border width on top. Inlay distance on top.                             |
| `right`   | string           | `--aug-border-right`   | `--aug-inlay-right`   | Border width on the right. Inlay distance on the right.                 |
| `bottom`  | string           | `--aug-border-bottom`  | `--aug-inlay-bottom`  | Border width on the bottom. Inlay distance on the bottom.               |
| `left`    | string           | `--aug-border-left`    | `--aug-inlay-left`    | Border width on the left. Inlay distance on the left.                   |
| `bg`      | string           | `--aug-border-bg`      | `--aug-inlay-bg`      | CSS background of the border or the inlay.                              |
| `opacity` | string or number | `--aug-border-opacity` | `--aug-inlay-opacity` | Opacity of the border or the inlay.                                     |

<!-- generated:end surface-options -->

## Border and inlay defaults

An element with `aug.border` or `aug.inlay` has theme-aware defaults, so `border: true` and `inlay: true` already look right in every theme. An explicit option, which `styleAttributes` writes as an inline variable, always wins.

| Variable           | Default                      | augmented-ui default       |
| ------------------ | ---------------------------- | -------------------------- |
| `--aug-border-bg`  | `var(--theme-line-strong)`   | `currentColor`             |
| `--aug-border-all` | `var(--theme-line-width)`    | `4px`                      |
| `--aug-inlay-bg`   | `var(--theme-surface-float)` | `rgba(128, 128, 128, 0.5)` |
| `--aug-inlay-all`  | `var(--theme-line-width)`    | `3px`                      |

The defaults resolve on the element that carries `data-augmented-ui`, so a `theme` prop on that element changes them. A nested augmented element does not inherit the defaults or the explicit options of its parent, because augmented-ui declares these variables again on every element.

## Emitted order

`styleAttributes` joins the tokens into the `data-augmented-ui` value in this order. First `all`, then the regions in the order `tl`, `t`, `tr`, `r`, `br`, `b`, `bl`, `l`, then `border`, then `inlay`.

## Flag mixins

<!-- generated:start flag-mixins -->

augmented-ui declares 5 flag mixins. `border`, `both`, `delegated-border`, `delegated-inlay`, `inlay`. `AugProps` emits only `border` and `inlay`.

<!-- generated:end flag-mixins -->

Delegated borders and inlays, the elements marked `data-augmented-ui-border`, are not supported.

## Source

`src/aug/index.ts` defines the types. `src/aug/suffixes.ts` maps each option to the end of its CSS variable name. `src/aug/collect.ts` turns an `AugProps` into tokens and variables. `src/aug/mixins.generated.ts` holds the mixin tables, and `scripts/gen-aug.ts` generates it from `node_modules/augmented-ui/augmented-ui.css`. `tests/aug-generated.test.ts` fails when the file is out of date with the stylesheet. `src/aug/aug.css` sets `position: relative` on any element with `data-augmented-ui`, through `:where()`, so the border and inlay pseudo-elements have an anchor. It also sets the four border and inlay defaults above. They win over the defaults of augmented-ui because `aug.css` is in `sacred.aug`, a layer after the `sacred.vendor` layer that holds the augmented-ui stylesheet. See [Why CSS layers](../explanation/why-css-layers.md).

The tables on this page are generated by `scripts/gen-docs.ts` from those files.
