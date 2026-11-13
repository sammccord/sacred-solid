import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import type { JSX } from "@solidjs/web";
import type { Component } from "solid-js";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { ActionButton } from "../src/components/ActionButton.tsx";
import { ButtonGroup } from "../src/components/ButtonGroup.tsx";
import { ComboBox } from "../src/components/ComboBox.tsx";
import { DebugGrid, toggleDebugGrid } from "../src/components/DebugGrid.tsx";
import { OutsideElementEvent } from "../src/components/detectors/OutsideElementEvent.tsx";
import { DropdownMenu } from "../src/components/DropdownMenu.tsx";
import { DropdownMenuTrigger } from "../src/components/DropdownMenuTrigger.tsx";
import { HoverComponentTrigger } from "../src/components/HoverComponentTrigger.tsx";
import { ModalStack } from "../src/components/ModalStack.tsx";
import { ModalAlert } from "../src/components/modals/ModalAlert.tsx";
import { ModalCanvasPlatformer } from "../src/components/modals/ModalCanvasPlatformer.tsx";
import { ModalCanvasSnake } from "../src/components/modals/ModalCanvasSnake.tsx";
import { ModalChess } from "../src/components/modals/ModalChess.tsx";
import { ModalCreateAccount } from "../src/components/modals/ModalCreateAccount.tsx";
import { ModalDOMSnake } from "../src/components/modals/ModalDOMSnake.tsx";
import { ModalError } from "../src/components/modals/ModalError.tsx";
import { ModalMatrixModes } from "../src/components/modals/ModalMatrixModes.tsx";
import { DefaultActionBar } from "../src/components/page/DefaultActionBar.tsx";
import {
  type ModalContextValue,
  ModalProvider,
  useModals,
} from "../src/components/page/ModalContext.tsx";

class ResizeObserverStub {
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  vi.stubGlobal("IntersectionObserver", ResizeObserverStub);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.className = "";
  document.body.innerHTML = "";
});

function press(target: Element | Document, key: string, init: KeyboardEventInit = {}) {
  const code = key === " " ? "Space" : key.length === 1 ? `Key${key.toUpperCase()}` : key;
  fireEvent.keyDown(target, { key, code, ...init });
  fireEvent.keyUp(target, { key, code, ...init });
}

function withModals(ui: () => JSX.Element) {
  let modals: ModalContextValue | undefined;
  function Probe() {
    modals = useModals();
    return null;
  }
  const result = render(() => (
    <ModalProvider>
      <Probe />
      {ui()}
    </ModalProvider>
  ));
  return { ...result, modals: () => modals as ModalContextValue };
}

describe("OutsideElementEvent", () => {
  test("fires for mousedown and touchstart outside, not inside or on ignored targets", () => {
    const onOutside = vi.fn();
    render(() => (
      <div>
        <OutsideElementEvent class="box" onOutsideEvent={onOutside}>
          <button>inside</button>
        </OutsideElementEvent>
        <button>outside</button>
        <button data-detector-ignore>ignored</button>
      </div>
    ));

    fireEvent.mouseDown(screen.getByText("inside"));
    expect(onOutside).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByText("ignored"));
    expect(onOutside).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByText("outside"));
    expect(onOutside).toHaveBeenCalledTimes(1);

    fireEvent.touchStart(screen.getByText("outside"));
    expect(onOutside).toHaveBeenCalledTimes(2);
    expect(document.querySelector(".box")).toBeTruthy();
  });

  test("stops listening after unmount", () => {
    const onOutside = vi.fn();
    const { unmount } = render(() => (
      <OutsideElementEvent onOutsideEvent={onOutside}>x</OutsideElementEvent>
    ));
    unmount();
    fireEvent.mouseDown(document.body);
    expect(onOutside).not.toHaveBeenCalled();
  });
});

describe("DropdownMenu", () => {
  function setup() {
    const onClose = vi.fn();
    const first = vi.fn();
    const second = vi.fn();
    const documentKeys = vi.fn();
    const result = render(() => (
      <DropdownMenu
        onClose={onClose}
        items={[
          { icon: "⊹", children: "One", onClick: first },
          { icon: "⊹", children: "Two", onClick: second },
          { icon: "⊹", children: "Three" },
        ]}
      />
    ));
    document.addEventListener("keydown", documentKeys);
    const items = screen.getAllByRole("menuitem");
    return { onClose, first, second, documentKeys, items, ...result };
  }

  test("arrows move focus with wrapping", () => {
    const { items } = setup();
    items[0]?.focus();
    fireEvent.keyDown(items[0] as HTMLElement, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[1]);
    fireEvent.keyDown(items[2] as HTMLElement, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[0]);
    fireEvent.keyDown(items[0] as HTMLElement, { key: "ArrowUp" });
    expect(document.activeElement).toBe(items[2]);
  });

  test("Enter and Space activate the focused item and close the menu", () => {
    const { items, first, second, onClose } = setup();
    fireEvent.keyDown(items[0] as HTMLElement, { key: "Enter" });
    expect(first).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(items[1] as HTMLElement, { key: " " });
    expect(second).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test("handled keys never reach document listeners", () => {
    const { items, documentKeys, onClose } = setup();
    fireEvent.keyDown(items[0] as HTMLElement, { key: "ArrowDown" });
    fireEvent.keyDown(items[0] as HTMLElement, { key: "Escape" });
    expect(documentKeys).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("Escape on the document closes through the hotkey fallback", () => {
    const { onClose } = setup();
    press(document, "Escape");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("the footer Close button still activates from the keyboard", () => {
    const { onClose } = setup();
    const close = screen.getByText("Close").closest("[role=button]") as HTMLElement;
    fireEvent.keyDown(close, { key: "Enter" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clicking an item runs its handler then onClose", () => {
    const { items, first, onClose } = setup();
    fireEvent.click(items[0] as HTMLElement);
    expect(first).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("a modal item opens its modal and leaves the menu open", () => {
    const onClose = vi.fn();
    const { modals } = withModals(() => (
      <DropdownMenu
        onClose={onClose}
        items={[{ children: "Open it", modal: ModalAlert, modalProps: { message: "hi" } }]}
      />
    ));
    fireEvent.click(screen.getByRole("menuitem"));
    expect(modals().modalStack()).toHaveLength(1);
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("DropdownMenuTrigger", () => {
  function setup(hotkey?: string) {
    const picked = vi.fn();
    const result = render(() => (
      <DropdownMenuTrigger hotkey={hotkey} items={[{ children: "Pick me", onClick: picked }]}>
        <ActionButton>Menu</ActionButton>
      </DropdownMenuTrigger>
    ));
    const trigger = screen.getByText("Menu").closest("[role=button]") as HTMLElement;
    return { picked, trigger, ...result };
  }

  test("click opens a menu portaled to body, locks its width and focuses the first item", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 123,
      height: 40,
      top: 0,
      left: 0,
      right: 123,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    const { trigger } = setup();
    expect(screen.queryByRole("menu")).toBeNull();

    fireEvent.click(trigger);
    const menu = screen.getByRole("menu");
    expect(menu.parentElement?.parentElement).toBe(document.body);
    expect(menu.getAttribute("aria-label")).toBe("menu");
    expect(menu.style.width).toBe("123px");
    expect(menu.style.position).toBe("absolute");
    expect(menu.style.zIndex).toBe("var(--z-index-page-dropdown-menus)");
    expect(document.activeElement).toBe(screen.getByRole("menuitem"));
  });

  test("Enter on the focused trigger opens the menu", () => {
    const { trigger } = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  test("mousedown outside closes it and returns focus to the trigger", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeTruthy();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test("mousedown then click on the trigger reopens, as in React", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    fireEvent.mouseDown(trigger);
    expect(screen.queryByRole("menu")).toBeNull();
    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  test("Escape inside the menu closes it", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole("menuitem"), { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test("choosing an item runs it and closes the menu", () => {
    const { trigger, picked } = setup();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("menuitem"));
    expect(picked).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("the hotkey toggles the menu", () => {
    setup("ctrl+o");
    press(document, "o", { ctrlKey: true });
    expect(screen.getByRole("menu")).toBeTruthy();
    press(document, "o", { ctrlKey: true });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("without a hotkey, ctrl+o does nothing", () => {
    setup();
    press(document, "o", { ctrlKey: true });
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("HoverComponentTrigger", () => {
  test("hover opens a tooltip, outside mousedown closes it", () => {
    render(() => (
      <HoverComponentTrigger component="tooltip" text="Tip text">
        <span>target</span>
      </HoverComponentTrigger>
    ));
    expect(screen.getByText("target").tabIndex).toBe(0);
    expect(screen.queryByText("Tip text")).toBeNull();

    fireEvent.mouseEnter(screen.getByText("target").parentElement as HTMLElement);
    const tip = screen.getByText("Tip text");
    expect(tip.style.position).toBe("absolute");
    expect(tip.style.zIndex).toBe("var(--z-index-page-tooltips)");

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("Tip text")).toBeNull();
  });

  test("focus opens a popover dialog, mousedown on the trigger root does not close it", () => {
    render(() => (
      <HoverComponentTrigger component="popover" text="Pop text">
        <button>target</button>
      </HoverComponentTrigger>
    ));
    const target = screen.getByText("target");
    fireEvent.focusIn(target);
    const popover = screen.getByRole("dialog");
    expect(popover.textContent).toBe("Pop text");
    expect(popover.getAttribute("aria-modal")).toBe("true");
    expect(popover.style.zIndex).toBe("var(--z-index-page-popover)");

    fireEvent.mouseDown(target.parentElement as HTMLElement);
    expect(screen.queryByRole("dialog")).toBeTruthy();
  });

  test("click opens it", () => {
    render(() => (
      <HoverComponentTrigger component="tooltip" text="Tip text">
        <span>target</span>
      </HoverComponentTrigger>
    ));
    fireEvent.click(screen.getByText("target"));
    expect(screen.getByText("Tip text")).toBeTruthy();
  });
});

describe("ButtonGroup", () => {
  test("renders nothing without items", () => {
    const { container } = render(() => <ButtonGroup />);
    expect(container.innerHTML).toBe("");
  });

  test("plain items fire onClick, isFull adds the full class", () => {
    const onClick = vi.fn();
    const { container } = render(() => (
      <ButtonGroup isFull items={[{ body: "ONE", onClick, hotkey: "1" }, { body: "TWO" }]} />
    ));
    expect(container.firstElementChild?.className).toMatch(/root/);
    expect(container.firstElementChild?.className).toMatch(/full/);
    expect(screen.getAllByRole("button")).toHaveLength(2);
    fireEvent.click(screen.getByText("ONE"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("items with a menu open a dropdown via openHotkey and click", () => {
    render(() => (
      <ButtonGroup
        items={[{ body: "Fonts", openHotkey: "ctrl+o", items: [{ children: "Alpha" }] }]}
      />
    ));
    fireEvent.click(screen.getByText("Fonts"));
    expect(screen.getByText("Alpha")).toBeTruthy();
    fireEvent.mouseDown(document.body);
    press(document, "o", { ctrlKey: true });
    expect(screen.getByText("Alpha")).toBeTruthy();
  });
});

describe("ComboBox", () => {
  const data = [
    ["name", "description"],
    ["Alpha", "first"],
    ["Beta", "second"],
    ["Gamma", "third"],
    ["Delta", "fourth"],
    ["Epsilon", "fifth"],
    ["Zeta", "sixth"],
    ["Alphabet", "seventh"],
  ];

  const titles = () => Array.from(document.querySelectorAll("h2")).map((h) => h.textContent);

  test("shows the first five rows, then matches first as you type", () => {
    render(() => <ComboBox data={data} label="SEARCH" />);
    expect(titles()).toEqual(["Alpha", "Beta", "Gamma", "Delta", "Epsilon"]);

    const input = document.querySelector("input") as HTMLInputElement;
    input.value = "zet";
    fireEvent.input(input);
    expect(titles()).toEqual(["Zeta", "Alpha", "Beta", "Gamma", "Delta"]);
  });

  test("a term with no match falls back to the first five", () => {
    render(() => <ComboBox data={data} />);
    const input = document.querySelector("input") as HTMLInputElement;
    input.value = "nothing";
    fireEvent.input(input);
    expect(titles()).toEqual(["Alpha", "Beta", "Gamma", "Delta", "Epsilon"]);
  });

  test("five or more matches cap at five", () => {
    render(() => <ComboBox data={data} />);
    const input = document.querySelector("input") as HTMLInputElement;
    input.value = "a";
    fireEvent.input(input);
    expect(titles()).toHaveLength(5);
    expect(titles()[0]).toBe("Alpha");
  });
});

describe("DebugGrid", () => {
  test("adds a hidden grid, toggles on the event, removes it on unmount", () => {
    const { unmount } = render(() => <DebugGrid />);
    const grid = document.body.lastElementChild as HTMLElement;
    expect(grid.style.display).toBe("none");
    expect(grid.style.pointerEvents).toBe("none");
    expect(grid.style.zIndex).toBe("-1");

    toggleDebugGrid();
    expect(grid.style.display).toBe("block");
    toggleDebugGrid();
    expect(grid.style.display).toBe("none");

    unmount();
    expect(grid.isConnected).toBe(false);
    toggleDebugGrid();
    expect(grid.style.display).toBe("none");
  });
});

describe("DefaultActionBar", () => {
  test("lists the default menus then the extra items", () => {
    render(() => <DefaultActionBar items={[{ body: "Extra", hotkey: "X" }]} />);
    const labels = screen.getAllByRole("button").map((b) => b.textContent);
    expect(labels).toEqual(["⌃+OFonts", "⌃+AAppearance", "⌃+TMode", "⌃+GGrid", "XExtra"]);
  });

  test("the Fonts menu applies a font class and the default row clears it", () => {
    render(() => <DefaultActionBar />);
    fireEvent.click(screen.getByText("Fonts"));
    expect(screen.getAllByRole("menuitem")).toHaveLength(42);

    fireEvent.click(screen.getByText("Departure Mono [MIT]"));
    expect(document.body.classList.contains("font-use-departure-mono")).toBe(true);
    expect(screen.queryByRole("menu")).toBeNull();

    fireEvent.click(screen.getByText("Fonts"));
    const row = screen.getByText("Fira Code [OFL] [DEFAULT]");
    expect(row.className).toBe("font-use-fira-code");
    fireEvent.click(row);
    expect(document.body.className).not.toMatch(/font-use/);
  });

  test("Appearance and Mode menus set body classes", () => {
    render(() => <DefaultActionBar />);
    fireEvent.click(screen.getByText("Appearance"));
    fireEvent.click(screen.getByText("Dark"));
    expect(document.body.classList.contains("theme-dark")).toBe(true);

    fireEvent.click(screen.getByText("Mode"));
    fireEvent.click(screen.getByText("Purple"));
    expect(document.body.classList.contains("tint-purple")).toBe(true);
    fireEvent.click(screen.getByText("Mode"));
    fireEvent.click(screen.getByText("None"));
    expect(document.body.className).not.toMatch(/tint-/);
  });

  test("ctrl+a opens the Appearance menu", () => {
    render(() => <DefaultActionBar />);
    press(document, "a", { ctrlKey: true });
    expect(screen.getByText("Light")).toBeTruthy();
  });

  test("applies the dark theme when the system prefers it", () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(() => <DefaultActionBar />);
    expect(document.body.classList.contains("theme-dark")).toBe(true);
  });

  test("ctrl+g toggles the debug grid", () => {
    render(() => (
      <>
        <DebugGrid />
        <DefaultActionBar />
      </>
    ));
    const grid = document.body.lastElementChild as HTMLElement;
    press(document, "g", { ctrlKey: true });
    expect(grid.style.display).toBe("block");
    fireEvent.click(screen.getByText("Grid"));
    expect(grid.style.display).toBe("none");
  });

  test("Escape closes the topmost modal", () => {
    const { modals } = withModals(() => <DefaultActionBar />);
    modals().open(ModalAlert, { message: "one" });
    modals().open(ModalAlert, { message: "two" });
    press(document, "Escape");
    expect(modals().modalStack()).toHaveLength(1);
  });

  test("arrow keys move focus between focusable elements, Enter clicks a role=button div", () => {
    const clicked = vi.fn();
    render(() => (
      <>
        <DefaultActionBar />
        <input aria-label="field" />
        <div tabindex={0} role="button" onClick={clicked}>
          custom
        </div>
      </>
    ));
    const field = screen.getByLabelText("field");
    const custom = screen.getByText("custom");
    custom.focus();
    press(custom, "ArrowUp");
    expect(document.activeElement).toBe(field);

    press(custom, "Enter");
    expect(clicked).toHaveBeenCalledTimes(1);
    press(custom, " ");
    expect(clicked).toHaveBeenCalledTimes(2);
  });

  test("arrow keys inside an open menu are left to the menu", () => {
    render(() => <DefaultActionBar />);
    fireEvent.click(screen.getByText("Appearance"));
    const [light, dark] = screen.getAllByRole("menuitem");
    light?.focus();
    fireEvent.keyDown(light as HTMLElement, { key: "ArrowDown" });
    expect(document.activeElement).toBe(dark);
  });
});

describe("modals", () => {
  function openModal<P extends object>(component: Component<P>, props: P) {
    const view = withModals(() => <ModalStack />);
    view.modals().open(component, props);
    flush();
    return view;
  }

  test("ModalAlert shows the message and its button closes it", () => {
    const { modals } = openModal(ModalAlert, { message: "Careful" });
    expect(screen.getByText("ALERT")).toBeTruthy();
    expect(screen.getByText("Careful")).toBeTruthy();
    fireEvent.click(screen.getByText("Close"));
    expect(modals().modalStack()).toHaveLength(0);
  });

  test("buttonText overrides the default label", () => {
    openModal(ModalAlert, {
      message: "m",
      buttonText: "Dismiss",
    });
    expect(screen.getByText("Dismiss")).toBeTruthy();
    expect(screen.queryByText("Close")).toBeNull();
  });

  test("ModalError closes the topmost modal on Enter and from its ENTER button", () => {
    const { modals } = openModal(ModalError, {
      message: "Boom",
      title: "ERROR",
    });
    modals().open(ModalError, { message: "Bam", title: "ERROR" });
    flush();
    expect(screen.getByText("Bam")).toBeTruthy();

    press(document, "Enter");
    expect(screen.queryByText("Bam")).toBeNull();
    expect(modals().modalStack().length).toBeLessThan(2);
  });

  test("ModalError ENTER button closes one modal", () => {
    const { modals } = openModal(ModalError, { message: "Boom" });
    fireEvent.click(screen.getByText("ENTER"));
    expect(modals().modalStack()).toHaveLength(0);
  });

  test("ModalChess renders the board, centers the card and closes on Enter", () => {
    const board = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => ""));
    const { modals } = openModal(ModalChess, { board, title: "GAME" });
    expect(screen.getByText("GAME")).toBeTruthy();
    expect(screen.getByText("CLOSE")).toBeTruthy();
    expect(document.querySelector("section section")?.getAttribute("style")).toContain(
      "text-align: center",
    );
    press(document, "Enter");
    expect(modals().modalStack()).toHaveLength(0);
  });

  test("ModalCreateAccount renders its form and the button closes it", () => {
    const { modals } = openModal(ModalCreateAccount, {});
    expect(screen.getByText("NEW ACCOUNT")).toBeTruthy();
    expect(document.querySelectorAll("input[name^=modal_]").length).toBeGreaterThanOrEqual(5);
    fireEvent.click(screen.getByText("Create an account"));
    expect(modals().modalStack()).toHaveLength(0);
  });

  test("ModalMatrixModes renders both loaders and closes", () => {
    const { modals } = openModal(ModalMatrixModes, {});
    expect(screen.getByText("MATRIX MODES")).toBeTruthy();
    expect(screen.getByText("KATAKANA DEFAULT")).toBeTruthy();
    expect(screen.getByText("GREEK LTR")).toBeTruthy();
    fireEvent.click(screen.getByText("Close"));
    expect(modals().modalStack()).toHaveLength(0);
  });

  test.each([
    ["ModalCanvasPlatformer", ModalCanvasPlatformer, "ALERT"],
    ["ModalCanvasSnake", ModalCanvasSnake, "CANVAS PLATFORMER"],
    ["ModalDOMSnake", ModalDOMSnake, "DOM SNAKE"],
  ])("%s keeps its React title and closes", (_name, modal, title) => {
    const { modals } = openModal(modal, {});
    expect(screen.getByText(title)).toBeTruthy();
    fireEvent.click(screen.getByText("Close"));
    expect(modals().modalStack()).toHaveLength(0);
  });
});
