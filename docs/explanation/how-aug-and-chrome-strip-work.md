# How aug and the chrome strip work

An `aug` shape is a `clip-path` plus two pseudo-elements. That choice explains why a glow needs `Surface`, why components remove their own lines and fills, and why a clipped corner can cut text.

## What augmented-ui does to an element

`styleAttributes` puts `data-augmented-ui` on the root element and sets `--aug-*` variables. The augmented-ui stylesheet reads them and does three things.

- It sets `clip-path: polygon(...)` on the element. The polygon is computed from the variables, so each mixin is a different polygon.
- It draws the border on `::after`. That pseudo-element covers the element with the border background and is itself clipped to remove its center.
- It draws the inlay on `::before`. That pseudo-element is clipped a set distance inside the border.

augmented-ui positions both pseudo-elements absolutely. `src/aug/aug.css` sets `position: relative` on any element with `data-augmented-ui`, through `:where()` so a component's own `position` still wins. Without it the border and inlay would anchor to some ancestor.

## Why box-shadow and filter vanish on the clipped element

`clip-path` clips everything the element paints. That includes its `box-shadow` outside the border box, its `outline`, and any child that overflows it. A `filter` does not escape either. The order of operations is filter first, then clip, so a `drop-shadow` filter draws its shadow and the clip then cuts the shadow off.

An elevation shadow on a clipped element is cut by the polygon and leaks a 1px edge along the clip. That is why an augmented element drops its elevation shadow instead of keeping a damaged one.

## Why glow needs the Surface wrapper

A filter on an ancestor applies to the already clipped result of the child. A `drop-shadow` follows the alpha of that result, so the glow hugs the cut corners. That is why `Surface` puts the glow filter on a wrapper and the aug on the element inside it.

The blur forces a second constraint. A `backdrop-filter` can only see what is painted inside its backdrop root, and an element with a `filter` is a backdrop root. If the blur sat on the clipped element inside the glow wrapper, it would see only the wrapper and not the page. This holds in Chromium 158. A translucent panel with `backdrop-filter: blur(8px)` inside a `drop-shadow` wrapper showed sharp stripes behind it, and the same panel outside the wrapper showed blurred ones.

So `Surface` has four elements.

1. The root is a positioned parent. It exists because the next two elements must be siblings.
2. The backdrop layer sits beneath the glow wrapper. It carries the blur and the clip of `aug`, and it is not inside the filter.
3. The glow wrapper carries the `drop-shadow` filter.
4. The surface element holds the fill, the border, the inlay, and the content.

The backdrop layer takes the clip and never the border or the inlay. The surface element draws those, and a second copy would double them. The clip matters because it keeps the blur from spilling past the shape.

With no `glow` and no `blur`, `Surface` adds no filter and no stacking context. The extra elements cost markup and nothing else.

## Why the chrome strip uses child combinators and data attributes

When `aug` takes over a job, the native version has to go or the two stack. A `border` or an inset `box-shadow` would draw a second line inside the aug border. A native background would show through the inlay. The rules that remove them are called the chrome strip, and each module has them at its end.

They are selectors, not variables, and that is the point. A custom property set on an augmented `Card` would inherit into every descendant. A plain `Card` or `Button` nested inside would lose its lines. A child combinator such as `.card:where([data-aug-border]) > .children` reaches only the parts of that one frame. A plain `Card` nested inside is not a direct child, and it keeps its own lines.

The rules select `data-aug-border` and `data-aug-inlay`, which `styleAttributes` adds next to `data-augmented-ui`. A match on `[data-augmented-ui~="border"]` would also work. The separate attributes keep the rules independent of how `styleAttributes` joins tokens into one string.

`:where()` removes the attribute from the specificity count. Take the secondary `Button`. The base rule `.secondary` has the specificity of one class. The strip rule `.secondary:where([data-aug-border])` has the same, and it comes later in the module, so it wins. The hover rule `.secondary:hover` carries a pseudo-class and has more, so it still wins over the strip. That is how hover, focus, and active states survive the strip.

`vpx scripts/chrome-strip.ts` measures this in a real browser. It loads `aug/strip/index.html`, renders each component plain, with a border, with an inlay, with both, and with a clip only, and reads computed borders, shadows, and fills. It passes 101 checks for `Card`, `CardDouble`, `Dialog`, `Input`, `Window`, `Button`, `Popover`, and `Tooltip`.

## What the approach costs

A corner clip cuts text. A surface with no padding, such as `Tooltip`, the `Input` label, or `Badge`, has its first letter under the clip. In Chromium 158, a 24px clip cuts the first letter of a `Badge`, and a 12px clip cuts the first letter of a `Tooltip`. Size the clip or add padding. The library leaves the padding to the caller, because a component that looks right without `aug` should not change when `aug` is absent.

The clip also hides overflow. A menu you render inside an augmented element is cut at the shape.

The border and inlay use `::after` and `::before`. A component whose own CSS uses those pseudo-elements on the same root can look different. `Avatar` uses `::before` for its hover and active highlight, with or without an image.

Support is the last cost. augmented-ui applies only where the browser supports `clip-path` and empty custom property values, and it falls back to an unshaped element elsewhere. The strip rules do not check for support. In a browser without it, an element with `aug.inlay` loses its native fill and gets no inlay. That follows from the CSS. No old browser was tested.

Nesting needs no wrapper element here. In Chromium 158 a `Card` with one clipped corner held a `Button` with a different clipped corner, and each drew its own shape. augmented-ui's own documentation describes a reset layer, `data-augmented-ui-reset`, that nested elements may need. Firefox and Safari were not tested.
