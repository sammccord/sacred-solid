---
"sacred-solid": minor
---

Callers can restyle components without descendant selectors. Every component that spread `rest` after its own `class` now merges the two with `classNames`, so a caller `class` no longer replaces the library class. This covers `Avatar` with children, `Badge`, `Block`, `Button`, `CodeBlock`, `Drawer`, `DropdownMenu`, `Grid`, `Indent`, `Input` and `TextArea` (the hidden field), `KeyHint`, `Popover`, `Row`, `RowEllipsis`, `RowSpaceBetween`, `SidebarLayout`, `Table`, `TableColumn`, `TableRow`, `Text`, `Tooltip` and `Window`. Markup is unchanged when no class is passed. A rule in your stylesheet that relied on replacing the library class now has to win by specificity or by loading later.

Components with inner parts take `classes`, a `SlotClasses` object. `Panel` has `header`, `icon`, `title`, `meta` and `body`, and takes `padding` for the body. `KeyHint` has `cap` and `label`. `Accordion` has `header`, `icon`, `title` and `body`, and takes an `icon` function of the open state.

`KeyHint` keys accept any element. A string still draws a boxed cap, an element draws bare. New `MouseIcon` draws a mouse with the left, right or wheel button filled. `ListItem` takes `selected` and forwards its other attributes, a selected item fills with `--theme-accent`. New `Tabs` renders a `tablist` with a selected state and arrow key movement.

A `theme` with an `ink` key now also sets `color: var(--theme-ink)` on the element. Before, only the variable changed, and the text kept the inherited color. This is a visible change for any element that passed `theme={{ ink }}` and relied on the variable alone.

Add `sacred-solid/themes/redline.css` with `theme-redline`, red ink and lines on a maroon-black page, a saturated red accent for selected rows and cyan keycaps. It sets a Rajdhani font stack.
