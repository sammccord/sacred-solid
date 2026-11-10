import type { StyleProps } from "../../src/style/index.ts";

export const GROUP_MEANINGS: Record<string, string> = {
  ink: "Text colors.",
  surface: "Fills for pages, panels, inputs and chips.",
  line: "Edge colors and line widths.",
  accent: "The emphasis color for hover, focus and active states.",
  control: "Chrome of buttons, checkboxes, radio buttons and sliders.",
  shadow:
    "Elevation of windows, floating panels, tooltips and modal rings, as a geometry and a color.",
};

export const TOKEN_MEANINGS: Record<string, string> = {
  ink: "Text color.",
  "ink-inverse": "Text drawn on an ink fill.",
  "ink-subdued": "Placeholder text.",
  "surface-page": "Page background and scrollbar track.",
  "surface-input": "Fill of input fields.",
  "surface-panel": "Fill of modal panels.",
  "surface-panel-footer": "Fill of the dropdown menu footer.",
  "surface-window": "Fill of the window body.",
  "surface-float":
    "Fill of overlay panels such as dialogs, menus, popovers, tooltips, messages and Surface.",
  "surface-chip": "Fill of labels, bars, navigation items and the scrollbar thumb.",
  "surface-inverse": "Fill drawn in the ink color, such as selected controls and block cursors.",
  "surface-subdued": "Muted fill for links, code blocks, slider tracks and select menus.",
  "surface-sunken": "Recessed fill, used by the Avatar placeholder.",
  "line-strong": "Edge line drawn in the ink tone, such as Card borders and Divider rules.",
  line: "Standard edge line, such as the Input field edge and the secondary Button line.",
  "line-subdued": "Hairline divider inside checkboxes and radio buttons.",
  "line-width-strong": "Thickness of strong lines.",
  "line-width": "Thickness of standard lines and focus rings.",
  "line-width-double": "Thickness of the CardDouble border.",
  accent: "Emphasis fill and focus line for hover, focus and active states.",
  "accent-subdued":
    "Translucent emphasis fill, such as the DataTable flash and light chessboard cells.",
  control: "Fill of a primary Button.",
  "control-ink": "Text on a primary Button fill.",
  "control-foreground": "Chrome tone of controls, used as fill, text and outline.",
  "control-background": "Body fill of controls.",
  "shadow-window-geometry": "Offsets, blur and spread of the Window shadow.",
  "shadow-window-color": "Color of the Window shadow.",
  "shadow-float-geometry": "Offsets, blur and spread of the shadow under floating panels.",
  "shadow-float-color": "Color of the shadow under floating panels.",
  "shadow-tooltip-geometry": "Offsets, blur and spread of the Tooltip shadow.",
  "shadow-tooltip-color": "Color of the Tooltip shadow.",
  "shadow-ring-geometry": "Spread of the ring around modals and popovers.",
  "shadow-ring-color": "Color of the ring around modals and popovers.",
};

const SIZE_MEANINGS = {
  size: "Size of the shape in the region. The augmented-ui default is 15px.",
  size1: "Size of the first shape in the region.",
  size2: "Size of the second shape in the region.",
  width1: "Width of the first shape in the region.",
  height1: "Height of the first shape in the region.",
  width2: "Width of the second shape in the region.",
  height2: "Height of the second shape in the region.",
  inset1: "Distance of the first shape from the start of the region, clockwise.",
  extend1: "Distance after the first shape, parallel to the starting edge.",
  clipmodX1: "Horizontal clip ratio of the first shape, from 0 to 1.",
  clipmodY1: "Vertical clip ratio of the first shape, from 0 to 1.",
  clipmodX2: "Horizontal clip ratio of the second shape, from 0 to 1.",
  clipmodY2: "Vertical clip ratio of the second shape, from 0 to 1.",
};

export const CORNER_OPTION_MEANINGS: Record<string, string> = {
  ...SIZE_MEANINGS,
  inset2: "Distance of the second shape from the end of the region, clockwise.",
  extend2: "Distance before the second shape, parallel to the ending edge.",
};

export const EDGE_OPTION_MEANINGS: Record<string, string> = {
  ...SIZE_MEANINGS,
  center: "Center of the edge region. The default centers it between the corner regions.",
  offset: "Shift of the edge region from its center. A negative value moves it left or up.",
};

export const ALL_OPTION_MEANINGS: Record<string, string> = {
  width: "Width of the shape. Set width or height, not both.",
  height: "Height of the shape. Set width or height, not both.",
};

export const SURFACE_OPTION_MEANINGS: Record<string, string> = {
  all: "Border width on all sides. Inlay distance from the border on all sides.",
  x: "Border width left and right. Inlay distance left and right.",
  y: "Border width top and bottom. Inlay distance top and bottom.",
  top: "Border width on top. Inlay distance on top.",
  right: "Border width on the right. Inlay distance on the right.",
  bottom: "Border width on the bottom. Inlay distance on the bottom.",
  left: "Border width on the left. Inlay distance on the left.",
  bg: "CSS background of the border or the inlay.",
  opacity: "Opacity of the border or the inlay.",
};

export const SKIPPED_REASONS: Record<string, string> = {
  BodyPortal: "Renders no element. It moves its children into `document.body`.",
  CanvasPlatformer: "Renders several sibling roots.",
  CanvasSnake: "Renders several sibling roots.",
  ComboBox: "Renders several sibling roots.",
  DebugGrid: "Renders no element. It appends an overlay `div` to `document.body`.",
  ModalProvider: "Renders no element. It provides the modal context.",
  ModalStack: "Renders the wrapper that positions open modals. Pass `aug` to the modal instead.",
  ModalTrigger: "Renders a `span` with `display: contents`, which has no box to clip.",
  OutsideElementEvent:
    "Detects events outside its box. It renders one `div` and takes only `class` and `style`.",
  Providers: "Renders no element. It mounts the hotkey and modal providers.",
  RadioButtonGroup: "Renders a list of `RadioButton` elements with no shared root.",
  Select: "Renders several sibling roots.",
  AS400: "Page template built from other components.",
  CLITemplate: "Page template built from other components.",
  DashboardRadar: "Page template built from other components.",
  Denabase: "Page template built from other components.",
  InvoiceTemplate: "Page template built from other components.",
  MessagesInterface: "Page template built from other components.",
  OneLineLoaders: "Page template built from other components.",
  PageConceptOne: "Page template built from other components.",
  PageConceptTwo: "Page template built from other components.",
  ResultsList: "Page template built from other components.",
  UpdatingDataTable: "Returns a `DataTable`. Pass `aug` and `theme` to a `DataTable` instead.",
  IntDevLogo: "Renders an `svg` and takes SVG attributes only.",
  MouseIcon: "Renders an `svg` and takes `button`, `size` and `style` only.",
  Sphere: "Renders an `svg` and takes `size`, `segments` and `style` only.",
};

export const COMPONENT_NOTES: Record<string, string> = {
  ASCIICanvas: "The component sets `height` on the same style.",
  Accordion: "The attributes go on the header row through `Row`. The body row gets none.",
  ActionButton: "The root takes `rootStyle`. The `style` prop goes on the inner `span`.",
  ActionListItem: "A `div`, or an `a` when `href` is set.",
  Avatar:
    "With children, the attributes go on the wrapping `div`. The `figure` or `a` inside gets none.",
  Button: "An enabled Button renders a `button`. A disabled one renders a `div`.",
  Divider: "The element depends on `type`.",
  DropdownMenuTrigger:
    "The attributes go on the wrapper around the trigger. The menu opens in a portal on `document.body` and gets none.",
  HoverComponentTrigger:
    "The attributes go on the wrapper around the trigger. The popover or tooltip opens in a portal on `document.body` and gets none.",
  Input: "The attributes go on the outer `div`. Other props go on the hidden `input`.",
  KeyHint: "The attributes go on the wrapper. The keycaps and the label get none.",
  Panel:
    "The attributes go on the root `section`. The header and the body get none. The body has no padding unless you pass `padding`.",
  ScrollArea: "The attributes go on the outer wrapper. The scrolling viewport gets none.",
  Surface:
    "The attributes go on the innermost element. The backdrop layer gets the clip of `aug`. See [Surface](surface.md).",
  TextArea: "The attributes go on the outer `div`. Other props go on the hidden `textarea`.",
};

export interface StyleCase {
  input: StyleProps;
  style?: Record<string, string> | string;
}

export const STYLE_CASES: StyleCase[] = [
  { input: {} },
  { input: { aug: {} } },
  { input: {}, style: { color: "red" } },
  { input: {}, style: "color:red" },
  { input: { aug: { tl: "clip", br: "2-rect-xy" } } },
  { input: { aug: { tl: { mixin: "clip", size: "24px" } } } },
  { input: { aug: { tr: { mixin: "2-clip-xy", clipmodX1: 0.5 } } } },
  { input: { aug: { inlay: true, border: true, l: "clip", tl: "clip" } } },
  { input: { aug: { border: "2px" } } },
  { input: { aug: { border: { all: "2px", bg: "cyan" } } } },
  { input: { aug: { all: { mixin: "hex", width: "8px" }, inlay: true } } },
  { input: { theme: { ink: "white", surfaceFloat: "rgb(0 0 0 / 0.5)" } } },
  { input: { theme: { ink: "white" } }, style: { color: "red" } },
  {
    input: { aug: { tl: "clip" }, theme: { line: "cyan" } },
    style: { color: "red", "--theme-line": "pink" },
  },
  { input: { theme: { line: "cyan" } }, style: "color: red;" },
];

export const THEME_NOTES: Record<string, string> = {
  "theme-light": "Default. Black on white with a bright green accent.",
  "theme-dark": "White on black with a fuchsia accent.",
  "theme-holo": "Dark translucent set with a cyan accent, hairline lines and glow shadows.",
  "theme-redline":
    "Deep maroon-black page with red ink and lines, a saturated red accent for selected rows, cyan keycaps and a Rajdhani font stack.",
  "theme-acid":
    "Near-black page with acid lime ink and lines, slate highlights, cyan keycaps and a Rajdhani font stack.",
};

export const NO_ELEMENT_REASONS: Record<string, string> = {
  BodyPortal: "Renders no element. It moves its children into `document.body`.",
  DebugGrid: "Renders no element. It appends an overlay `div` to `document.body` on demand.",
  ModalProvider: "Renders no element. It provides the modal context.",
  Providers: "Renders no element. It mounts the hotkey and modal providers.",
};

export const CLASS_NOTES: Record<string, string> = {
  Accordion:
    "Two sibling rows with no wrapper. `class` goes on the header row, which is always present. `classes.body` styles the other row.",
  ActionListItem: "A `div`, or an `a` when `href` is set.",
  Avatar: "With children, on the wrapping `div`. Without, on the `figure` or `a`.",
  AS400: "A page template. `class` goes on the `Window` it renders.",
  Button: "Also set on the `div` a disabled Button renders.",
  CanvasPlatformer:
    "Several sibling roots. `class` goes on the `div` around the canvas, not on the buttons.",
  CanvasSnake:
    "Several sibling roots. `class` goes on the `div` around the canvas, not on the buttons.",
  CLITemplate: "A page template. `class` goes on the `Window` it renders.",
  ComboBox: "Several sibling roots. `class` goes on the `div` that holds the input.",
  DashboardRadar: "A page template. `class` goes on the `Window` it renders.",
  Denabase: "A page template. `class` goes on the `Window` it renders.",
  DropdownMenuTrigger:
    "On the wrapper around the trigger. The menu opens in a portal and gets none.",
  HoverComponentTrigger:
    "On the wrapper around the trigger. The popover opens in a portal and gets none.",
  Input: "On the outer `div`, not on the hidden `input`. Other props go on the hidden `input`.",
  InvoiceTemplate: "A page template. `class` goes on the `Window` it renders.",
  MessagesInterface: "A page template. `class` goes on the `Window` it renders.",
  ModalAlert: "Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.",
  ModalCanvasPlatformer:
    "Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.",
  ModalCanvasSnake:
    "Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.",
  ModalChess: "Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.",
  ModalCreateAccount:
    "Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.",
  ModalDOMSnake:
    "Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.",
  ModalError: "Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.",
  ModalMatrixModes:
    "Forwarded to the card, like `aug` and `theme`. The positioning wrapper gets none.",
  ModalStack: "On the positioning wrapper. Each open modal renders its own class on its card.",
  ModalTrigger: "On the `span` with `display: contents`, which has no box of its own.",
  OneLineLoaders: "A page template. `class` goes on the `Card` it renders.",
  OutsideElementEvent: "The detector `div`. It has no library class.",
  PageConceptOne: "A page template. `class` goes on its root `div`.",
  PageConceptTwo: "A page template. `class` goes on its root `div`.",
  RadioButtonGroup: "No wrapper. `class` goes on every `RadioButton` it renders.",
  ResultsList: "A page template. `class` goes on the `Window` it renders.",
  Select:
    "Several sibling roots. `class` goes on the `section` that holds the control and the menu.",
  SimpleTable: "On the scroll wrapper `div`, which also carries `aug` and `theme`.",
  ScrollArea:
    "On the outer wrapper, which also carries `aug` and `theme`. `classes.viewport` styles the scrolling element.",
  Surface: "On the innermost element, with `aug` and `theme`. The backdrop layer gets none.",
  TextArea:
    "On the outer `div`, not on the hidden `textarea`. Other props go on the hidden `textarea`.",
  UpdatingDataTable: "Forwarded to the `DataTable` it renders.",
};
