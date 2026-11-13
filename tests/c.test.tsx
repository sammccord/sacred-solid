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

const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
  flush();
};

describe("DropdownMenuTrigger", () => {
  function setup(hotkey?: string) {
    const first = vi.fn();
    const second = vi.fn();
    const result = withModals(() => (
      <DropdownMenuTrigger
        hotkey={hotkey}
        items={[
          { icon: "⊹", children: "One", onClick: first },
          { icon: "⊹", children: "Two", onClick: second },
          { icon: "⊹", children: "Open it", modal: ModalAlert, modalProps: { message: "hi" } },
        ]}
      >
        <ActionButton>Menu</ActionButton>
      </DropdownMenuTrigger>
    ));
    const trigger = screen.getByText("Menu").closest("button") as HTMLElement;
    const menu = () => document.querySelector<HTMLElement>('[data-slot="menu-content"]');
    const isOpen = () => trigger.getAttribute("aria-expanded") === "true";
    return { first, second, trigger, menu, isOpen, ...result };
  }

  test("the caller's element is the trigger and carries the menu button semantics", () => {
    const { trigger, isOpen } = setup();
    expect(trigger.getAttribute("data-slot")).toBe("menu-trigger");
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(isOpen()).toBe(false);
    expect(trigger.tagName).toBe("BUTTON");
    expect(document.querySelectorAll("button")).toHaveLength(1);
  });

  test("click opens the menu with every item and the close footer", () => {
    const { trigger, menu, isOpen } = setup();
    fireEvent.click(trigger);
    expect(isOpen()).toBe(true);
    expect(menu()?.getAttribute("role")).toBe("menu");
    expect(screen.getAllByRole("menuitem").map((item) => item.textContent)).toEqual([
      "⊹One",
      "⊹Two",
      "⊹Open it",
    ]);
    expect(menu()?.querySelector("footer")?.textContent).toContain("Press escape to");
  });

  test("ArrowDown on the trigger opens the menu on the first item, arrows wrap", async () => {
    const { trigger } = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await settle();
    const items = screen.getAllByRole("menuitem");
    expect(document.activeElement).toBe(items[0]);
    fireEvent.keyDown(items[0]!, { key: "ArrowUp" });
    expect(document.activeElement).toBe(items[2]);
    fireEvent.keyDown(items[2]!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[0]);
  });

  test("choosing an item runs it, closes the menu and returns focus to the trigger", async () => {
    const { trigger, first, second, isOpen } = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await settle();
    press(document.activeElement!, "ArrowDown");
    press(document.activeElement!, "Enter");
    await settle();
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  test("Escape closes the menu and returns focus to the trigger", async () => {
    const { trigger, isOpen } = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await settle();
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await settle();
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  test("the footer Close button closes the menu", async () => {
    const { trigger, isOpen } = setup();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("Close").closest("button")!);
    await settle();
    expect(isOpen()).toBe(false);
  });

  test("a modal item opens its modal and leaves the menu open", () => {
    const { trigger, isOpen, modals } = setup();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("menuitem", { name: "⊹ Open it" }));
    expect(modals().modalStack()).toHaveLength(1);
    expect(isOpen()).toBe(true);
  });

  test("the hotkey toggles the menu", async () => {
    const { isOpen } = setup("ctrl+o");
    press(document, "o", { ctrlKey: true });
    await settle();
    expect(isOpen()).toBe(true);
    press(document, "o", { ctrlKey: true });
    await settle();
    expect(isOpen()).toBe(false);
  });

  test("without a hotkey, ctrl+o does nothing", () => {
    const { isOpen } = setup();
    press(document, "o", { ctrlKey: true });
    expect(isOpen()).toBe(false);
  });
});

describe("HoverComponentTrigger", () => {
  test("tooltip: the caller's element is the trigger, focus shows the hint, Escape hides it", async () => {
    render(() => (
      <HoverComponentTrigger component="tooltip" text="Tip text">
        <button type="button">target</button>
      </HoverComponentTrigger>
    ));
    const target = screen.getByRole("button", { name: "target" });
    expect(target.getAttribute("data-slot")).toBe("tooltip-trigger");
    target.focus();
    fireEvent.focus(target);
    await settle();
    const tip = screen.getByRole("tooltip");
    expect(tip.textContent).toBe("Tip text");
    expect(target.getAttribute("aria-describedby")).toBe(tip.id);
    fireEvent.keyDown(target, { key: "Escape" });
    await settle();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  test("popover: a press opens a dialog panel named by its trigger and Escape closes it", async () => {
    render(() => (
      <HoverComponentTrigger component="popover" text="Pop text">
        <button type="button">target</button>
      </HoverComponentTrigger>
    ));
    const target = screen.getByRole("button", { name: "target" });
    expect(target.getAttribute("aria-haspopup")).toBe("dialog");
    fireEvent.click(target);
    await settle();
    const popover = screen.getByRole("dialog", { name: "target" });
    expect(popover.textContent).toBe("Pop text");
    expect(target.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await settle();
    expect(target.getAttribute("aria-expanded")).toBe("false");
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

  test("items with a menu open a dropdown via click and toggle it with openHotkey", async () => {
    render(() => (
      <ButtonGroup
        items={[{ body: "Fonts", openHotkey: "ctrl+o", items: [{ children: "Alpha" }] }]}
      />
    ));
    const trigger = screen.getByText("Fonts").closest("button")!;
    fireEvent.click(trigger);
    expect(screen.getByRole("menuitem").textContent).toBe("Alpha");
    press(document, "o", { ctrlKey: true });
    await settle();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    press(document, "o", { ctrlKey: true });
    await settle();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
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
