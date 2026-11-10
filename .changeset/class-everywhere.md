---
"sacred-solid": minor
---

Every exported component that renders an element now takes `class`, merged with the library class by `classNames`. Components with several sibling roots put it on the one that visually owns them, `Accordion` on the header row, `Select` on its `section`, `ComboBox` on its `div`, `CanvasPlatformer` and `CanvasSnake` on the `div` around the canvas, `RadioButtonGroup` on each `RadioButton`. `Input` and `TextArea` now put `class` on the outer `div`, where the last release put it on the hidden field. Modals forward `class` to the card they render, and page templates forward it to their root. `Providers`, `ModalProvider`, `BodyPortal` and `DebugGrid` render no element and take none. `Table` takes `classes={{ body }}` for its `tbody`. Markup is unchanged when no class is passed. `docs/reference/class-targets.md` is generated from the sources and fails the docs test if a component stops reading `class`.
