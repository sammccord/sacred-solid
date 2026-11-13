---
"sacred-solid": minor
---

Build the interactive components on ui-sdk. `@ui-sdk/solid` and `@ui-sdk/core` are new peer dependencies. Tabs, Select, the dropdown menus, Accordion, Checkbox, radios, NumberRangeSlider, TreeView, the modal stack, Dialog, HoverComponentTrigger, Divider, BarProgress, BarLoader, Button, ActionButton, ActionListItem, ButtonGroup, Input, TextArea, Drawer and DatePicker now get keyboard, focus, ARIA and popups from ui-sdk. The look is unchanged. API changes: DropdownMenu must sit inside DropdownMenuTrigger, RadioButton must sit inside RadioButtonGroup (which takes name, label and onChange), Checkbox onChange receives the checked boolean, ActionButton and ActionListItem render native buttons, and Dialog opens as an alert dialog when given trigger, open or defaultOpen. New props: Select label, NumberRangeSlider label, name and onChange, BarProgress and BarLoader label, ButtonGroup label, Drawer label, DatePicker onChange, DropdownMenuTrigger trigger.
