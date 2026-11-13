---
"sacred-solid": minor
---

Move to Solid 2. The peer dependencies are now `solid-js` and `@solidjs/web` 2.0.0-rc.21 or newer, and Solid 1 is no longer supported. `BodyPortal` now uses Solid's `Portal`, so clicks inside portaled menus and modals reach their handlers. Rendered markup is unchanged except that `BarProgress` writes its attributes in React's order and the radar `<svg>` loses its redundant `xmlns` attribute.
