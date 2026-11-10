# Why CSS layers

Every stylesheet in sacred-solid sits in a cascade layer, so your plain CSS beats the library without a specificity fight and without caring which stylesheet loads first.

## The problem layers solve

A component class and a caller class have the same specificity, one class each. Before layers, the winner was whichever stylesheet came later in the document. In a bundled app that order follows the import graph, so a rule that worked in dev could lose in production, and the fix was a doubled selector such as `.card.card` or an import moved to the bottom of a file. A rule that sets a property the library also sets, on an element the library styles, is the common case. `class` on `Badge`, `Panel` or `Row` is exactly that.

## The layer set

All five layers are sublayers of one layer named `sacred`. The order statement is the first thing in every stylesheet the package ships.

```css
@layer sacred.vendor, sacred.base, sacred.aug, sacred.components, sacred.themes;
```

| Layer               | Content                                                     | Why it sits there                                                                                                                           |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `sacred.vendor`     | The augmented-ui stylesheet.                                | It declares defaults on `[data-augmented-ui]`. It must lose to our defaults, so it is first. Unlayered it would beat every layered rule.    |
| `sacred.base`       | `global.css` and `global-fonts.css`.                        | Page reset, the `--theme-*` and `--ansi-*` blocks of `theme-light` and `theme-dark`, the tints, and the constants on `html, body`.          |
| `sacred.aug`        | `src/aug/aug.css`.                                          | The border and inlay defaults and the `position` anchor. This layer is after the vendor layer, so the defaults win without any specificity. |
| `sacred.components` | Every `*.module.css`.                                       | Component rules and the strip rules. Components come after `sacred.aug`, so a component's `position` beats the anchor.                      |
| `sacred.themes`     | `themes/holo.css`, `themes/acid.css`, `themes/redline.css`. | After `sacred.base`, so a theme block overrides the constants on `html, body` whatever their specificity.                                   |

Layers beat specificity. A rule in a later layer wins over every rule in an earlier layer, whatever the selectors. Inside one layer the usual rules apply, so the `:where()` strip rules at the end of a module keep working, and source order inside a module still decides.

## Your CSS wins

Any rule outside a layer beats every layered rule. That includes your `body.theme-mine { --theme-ink: ... }` block, your `.card { padding: 0 }`, and an element selector such as `a { color: red }` against the `a` rule in `global.css`. You write plain CSS, in any order, before or after the library.

Inline styles still win over everything, which is how the `theme` and `aug` props work. `!important` reverses the layer order, so a library `!important` would beat yours. The library has none.

## What changes for you

States. A library hover or focus rule is also layered, so your plain `.tab { color: red }` now beats the library `.tab:hover` as well. Write the state rule yourself.

```css
.tab {
  color: red;
}
.tab:hover {
  color: white;
}
```

Order tricks. A selector you doubled, or an import you moved, to beat a library class is now redundant. Remove it.

Your own layers. A layer you declare is ranked by where its name first appears. To put your CSS in a layer that loses to the library, or in one that wins, state the order before the library stylesheets load.

```css
@layer reset, sacred, app;
```

`sacred` is the parent of the five sublayers. Put that line in the first stylesheet or a `<style>` in the `<head>`. Rules in `app` beat the library, and rules in `reset` lose to it. Unlayered rules beat all of them.

Sublayers fix the same problem between your own stylesheets. The playground puts the shared HUD styles in `app.hud` and each page in `app.page`, with `@layer sacred, app.hud, app.page;` at the top of every file. A page rule beats a shared rule whatever order the bundler loads them in, so `[data-micro]` overrides in a page need no doubled selector.

## Where the layers come from

The source files are plain CSS with no layer. `scripts/css-layers.ts` holds the table that maps a file to its layer, and a Vite plugin wraps the file when it loads, in the dev server, in `vp build`, in `vp pack` and in the tests. `scripts/pack-css.ts` runs after `vp pack`. It removes the repeated order statements from `dist/style.css`, which leaves one at the top, and it writes the layered copies of `global.css`, `global-fonts.css` and the themes to `dist/`, which the pack step used to copy as they were. The stylesheets in `src/` stay flat so the tests and the docs generator can parse them.

`vpx scripts/check-layers.ts` checks it. It reads the order statement at the top of each shipped file, then loads a fixture whose caller CSS comes before the library and asserts the caller wins on `Badge` and `Panel`.

## What it costs

Browsers older than 2022 ignore `@layer` blocks and drop the rules inside, so nothing is styled there. The package targets current browsers, as augmented-ui does. A `@keyframes` inside a layer works. `@font-face` sits in `sacred.base` and works, and a font rule is not part of the cascade anyway.
