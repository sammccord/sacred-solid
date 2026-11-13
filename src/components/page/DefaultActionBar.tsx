import { createMemo, onSettled } from "solid-js";
import type { AugProps } from "../../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../../style/index.ts";
import {
  classNames,
  findNextFocusable,
  isFocusableElement,
  onHandleAppearanceChange,
  onHandleAppearanceModeChange,
  onHandleFontChange,
} from "../../common/utilities.ts";
import { createHotkeys } from "../../modules/hotkeys/index.ts";
import { ActionBar, type ActionBarItem } from "../ActionBar.tsx";
import { toggleDebugGrid } from "../DebugGrid.tsx";
import styles from "./DefaultActionBar.module.css";
import { useModals } from "./ModalContext.tsx";

const MENU_CONTAINER_SELECTOR = '[role="menu"], [role="listbox"], [role="grid"]';

function onHandleSubmit(event: KeyboardEvent) {
  const target = event.target;
  if (!isFocusableElement(target)) return;

  const tag = target.tagName;
  if (tag === "BUTTON" || tag === "A" || tag === "SELECT" || tag === "INPUT") return;

  const role = target.getAttribute("role");
  if (role === "menuitem" || role === "option") return;

  event.preventDefault();
  target.click();
}

function createFocusHandler(direction: "next" | "previous") {
  return (event: KeyboardEvent) => {
    const target = event.target;
    if (!isFocusableElement(target)) return;
    if (target.closest(MENU_CONTAINER_SELECTOR) || target.getAttribute("aria-haspopup")) return;

    event.preventDefault();
    findNextFocusable(target, direction)?.focus();
  };
}

const onHandleNextFocus = createFocusHandler("next");
const onHandlePreviousFocus = createFocusHandler("previous");

function createGlobalNavigationHotkeys() {
  createHotkeys("ArrowDown", onHandleNextFocus);
  createHotkeys("ArrowUp", onHandlePreviousFocus);
  createHotkeys("ArrowRight", onHandleNextFocus);
  createHotkeys("ArrowLeft", onHandlePreviousFocus);
  createHotkeys("Enter", onHandleSubmit);
  createHotkeys(" ", onHandleSubmit);
}

const DEFAULT_FONT_CLASS = "font-use-fira-code";

const FONTS = [
  { className: "font-use-cascadia-mono", label: "Cascadia Mono [OFL]" },
  { className: "font-use-chicago-mono", label: "Chicago FLF Proportional [MIT]" },
  { className: "font-use-commit-mono", label: "Commit Mono V143 [OFL]" },
  { className: "font-use-code-new-roman-mono", label: "CodeNewRoman Mono 2.0 [OFL]" },
  { className: "font-use-departure-mono", label: "Departure Mono [MIT]" },
  { className: "font-use-fira-code", label: "Fira Code [OFL] [DEFAULT]" },
  { className: "font-use-fixedsys-excelsior", label: "Fixedsys Excelsior [CC0]" },
  { className: "font-use-fragment-mono", label: "Fragment Mono [OFL]" },
  { className: "font-use-glasstty-vt220", label: "GlassTTY: TrueType VT220 [NO LICENSE]" },
  { className: "font-use-geist-mono", label: "Geist Mono [OFL]" },
  { className: "font-use-intel-one-mono", label: "Intel One Mono 1.4.0 [OFL]" },
  { className: "font-use-iosevka-term", label: "Iosevka Term [OFL]" },
  { className: "font-use-ioskeley-mono-condensed", label: "Ioskeley Mono Condensed [OFL]" },
  { className: "font-use-ioskeley-mono-regular", label: "Ioskeley Mono Regular [OFL]" },
  { className: "font-use-jet-brains-mono", label: "JetBrains Mono [OFL]" },
  { className: "font-use-julia-mono", label: "Julia Mono 0.061 [OFL]" },
  { className: "font-use-kommuna-mono", label: "Kommuna Mono™ Trial [type.tmpstate.net]" },
  { className: "font-use-mekzantine", label: "Mekzantine™ [Michael Micasso] [mek.gallery]" },
  {
    className: "font-use-mekzantine-mono",
    label: "Mekzantine Mono™ [Michael Micasso] [mek.gallery]",
  },
  { className: "font-use-monaspace-argon-mono", label: "Monaspace Argon Variable [OFL]" },
  { className: "font-use-monaspace-krypton-mono", label: "Monaspace Krypton Variable [OFL]" },
  { className: "font-use-monaspace-neon-mono", label: "Monaspace Neon Variable [OFL]" },
  { className: "font-use-monaspace-radon-mono", label: "Monaspace Radon Variable [OFL]" },
  { className: "font-use-monaspace-xenon-mono", label: "Monaspace Xenon Variable [OFL]" },
  { className: "font-use-m1-plus-mono", label: "M1 Plus Mono [OFL]" },
  { className: "font-use-panama-mono", label: "Panama Mono™ Trial [type.tmpstate.net]" },
  { className: "font-use-paper-mono", label: "Paper Mono v0.3 [OFL]" },
  {
    className: "font-use-web437-dos-v-ank16",
    label: "Web437 DOS/V re. ANK16 [int10h.org] [VileR] [CC BY-SA 4.0]",
  },
  {
    className: "font-use-web437-dos-v-ank19",
    label: "Web437 DOS/V re. ANK19 [int10h.org] [VileR] [CC BY-SA 4.0]",
  },
  {
    className: "font-use-web437-dos-v-ank24",
    label: "Web437 DOS/V re. ANK24 [int10h.org] [VileR] [CC BY-SA 4.0]",
  },
  {
    className: "font-use-web437-dos-v-ank30",
    label: "Web437 DOS/V re. ANK30 [int10h.org] [VileR] [CC BY-SA 4.0]",
  },
  {
    className: "font-use-web437-nix8810-m16",
    label: "Web437 Nix8810 M16 [int10h.org] [VileR] [CC BY-SA 4.0]",
  },
  {
    className: "font-use-web437-pheonix-ega-8x8-2y",
    label: "Web437 Pheonix EGA 8X8 2Y [int10h.org] [VileR] [CC BY-SA 4.0]",
  },
  {
    className: "font-use-web437-sanyo-mb-c775-2y",
    label: "Web437 Sanyo MB C775 2Y [int10h.org] [VileR] [CC BY-SA 4.0]",
  },
  {
    className: "font-use-webplus-ast-premiumexec",
    label: "WebPlus AST PremiumExec [int10h.org] [VileR] [CC BY-SA 4.0]",
  },
  {
    className: "font-use-web-plus-ibm-bios",
    label: "WebPlus IBM BIOS [int10h.org] [VileR] [CC BY-SA 4.0]",
  },
  {
    className: "font-use-web-plus-ibm-vga-8x16",
    label: "WebPlus IBM VGA 8X16 [int10h.org] [VileR] [CC BY-SA 4.0]",
  },
  {
    className: "font-use-toshiba-tx-l1-8x16",
    label: "WebPlus ToshibaTxL1-8x16 [int10h.org] [VileR] [CC BY-SA 4.0]",
  },
  { className: "font-use-sfmono-square", label: "SFMono Square [FOSS]" },
  { className: "font-use-server-mono", label: "Server Mono [OFL]" },
  { className: "font-use-berkeley-mono", label: "TX-02 Berkeley Mono™ Trial [usgraphics.com]" },
  { className: "font-use-ubuntu-mono", label: "Ubuntu Sans Mono 1.006 [UBL]" },
];

const fontItems = (): ActionBarItem["items"] =>
  FONTS.map(({ className, label }) => ({
    icon: "⊹",
    children: <span class={className}>{label}</span>,
    onClick: () => onHandleFontChange(className === DEFAULT_FONT_CLASS ? "" : className),
  }));

const APPEARANCE_ITEMS: ActionBarItem["items"] = [
  { icon: "⊹", children: "Light", onClick: () => onHandleAppearanceChange("") },
  { icon: "⊹", children: "Dark", onClick: () => onHandleAppearanceChange("theme-dark") },
];

const MODES = [
  ["None", ""],
  ["Blue", "tint-blue"],
  ["Green", "tint-green"],
  ["Orange", "tint-orange"],
  ["Purple", "tint-purple"],
  ["Red", "tint-red"],
  ["Yellow", "tint-yellow"],
  ["Pink", "tint-pink"],
] as const;

const MODE_ITEMS: ActionBarItem["items"] = MODES.map(([label, className]) => ({
  icon: "⊹",
  children: label,
  onClick: () => onHandleAppearanceModeChange(className),
}));

const defaultItems = (): ActionBarItem[] => [
  { hotkey: "⌃+O", body: "Fonts", openHotkey: "ctrl+o", items: fontItems() },
  { hotkey: "⌃+A", body: "Appearance", openHotkey: "ctrl+a", items: APPEARANCE_ITEMS },
  { hotkey: "⌃+T", body: "Mode", openHotkey: "ctrl+t", items: MODE_ITEMS },
  {
    hotkey: "⌃+G",
    onClick: () => {
      toggleDebugGrid();
    },
    body: "Grid",
    selected: false,
  },
];

export interface DefaultActionBarProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  items?: ActionBarItem[];
}

export function DefaultActionBar(props: DefaultActionBarProps) {
  const { close } = useModals();

  createHotkeys("ctrl+g", () => toggleDebugGrid());
  createHotkeys("Escape", () => close());

  createGlobalNavigationHotkeys();

  onSettled(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (event: MediaQueryList | MediaQueryListEvent) => {
      onHandleAppearanceChange(event.matches ? "theme-dark" : "");
    };

    applyTheme(prefersDark);

    prefersDark.addEventListener("change", applyTheme);

    return () => {
      prefersDark.removeEventListener("change", applyTheme);
    };
  });

  const defaults = defaultItems();
  const items = createMemo(() => [...defaults, ...(props.items ?? [])]);

  return (
    <div class={classNames(styles.root, props.class)} {...styleAttributes(props)}>
      <ActionBar items={items()} />
    </div>
  );
}
