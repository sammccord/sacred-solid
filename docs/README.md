# sacred-solid documentation

sacred-solid is a SolidJS port of SRCL, the Sacred Computer component library with terminal aesthetics, with its own CSS, role tokens for theming, an `aug` prop for clipped shapes, and a `Surface` panel for glow and blur. It is client only, because components build DOM templates at import time, so import it from browser code. Every stylesheet sits in a cascade layer, so plain CSS of your own always wins. Every app imports three stylesheets, `sacred-solid/global-fonts.css`, `sacred-solid/global.css`, and `sacred-solid/style.css`.

## Tutorial

- [Build a futuristic panel](tutorial/build-a-futuristic-panel.md) takes a plain `Card` to a translucent, clipped, glowing `Surface`.

## How-to guides

- [Apply an aug shape](how-to/apply-an-aug-shape.md) clips, outlines, or fills a component.
- [Switch and write a theme](how-to/switch-and-write-a-theme.md) changes the page theme and adds your own.
- [Retheme a subtree](how-to/retheme-a-subtree.md) overrides tokens for one component and its children.
- [Add glow and blur](how-to/add-glow-and-blur.md) puts a glow and a backdrop blur on a panel.
- [Migrate from the old tokens](how-to/migrate-from-the-old-tokens.md) replaces the removed token names and props.
- [Restyle a component from outside](how-to/restyle-a-component-from-outside.md) adds a class to a root or to its parts, and shows selected rows, tabs and key hints.
- [Add aug to a new component](how-to/add-aug-to-a-new-component.md) wires `aug` and `theme` into a component in this repo.

## Reference

- [aug props](reference/aug-props.md) lists every `AugProps` key, option, and mixin.
- [Theme tokens](reference/theme-tokens.md) lists every token with its scope, key, meaning, and readers.
- [styleAttributes](reference/style-attributes.md) describes the helper and what it returns.
- [Components with aug](reference/components-with-aug.md) lists the components that take `aug` and `theme`, and the ones that do not.
- [Class targets](reference/class-targets.md) lists the element each component puts `class` on, and the `classes` parts.
- [Surface](reference/surface.md) describes the props and the four elements of `Surface`.
- [Themes](reference/themes.md) lists the built-in themes, the tints, and the holo, acid and redline values.

## Explanation

- [Why role tokens](explanation/why-role-tokens.md) explains the token vocabulary and the direct-set rule.
- [Why CSS layers](explanation/why-css-layers.md) explains the `sacred` layer set and why your plain CSS always wins.
- [How aug and the chrome strip work](explanation/how-aug-and-chrome-strip-work.md) explains clipping, the `Surface` structure, and the strip rules.
