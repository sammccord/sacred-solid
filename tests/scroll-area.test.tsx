import { fireEvent, render } from "@solidjs/testing-library";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { ScrollArea } from "../src/components/ScrollArea.tsx";
import styles from "../src/components/ScrollArea.module.css";

const observers: { callback: () => void; disconnected: boolean; targets: Element[] }[] = [];

beforeEach(() => {
  observers.length = 0;
  vi.stubGlobal(
    "ResizeObserver",
    class {
      entry = { callback: () => {}, disconnected: false, targets: [] as Element[] };
      constructor(callback: () => void) {
        this.entry.callback = callback;
        observers.push(this.entry);
      }
      observe(target: Element) {
        this.entry.targets.push(target);
      }
      unobserve() {}
      disconnect() {
        this.entry.disconnected = true;
      }
    },
  );
});

afterEach(() => vi.unstubAllGlobals());

function size(element: HTMLElement, box: { scrollHeight: number; clientHeight: number }) {
  Object.defineProperty(element, "scrollHeight", { configurable: true, value: box.scrollHeight });
  Object.defineProperty(element, "clientHeight", { configurable: true, value: box.clientHeight });
}

function scrollTo(element: HTMLElement, top: number) {
  element.scrollTop = top;
  fireEvent.scroll(element);
}

function setup(props: { fade?: boolean; scrollbar?: "native" | "hidden" | "rail" } = {}) {
  let viewport!: HTMLDivElement;
  const view = render(() => (
    <ScrollArea {...props} viewportRef={(element) => (viewport = element)}>
      rows
    </ScrollArea>
  ));
  return { ...view, viewport };
}

const edges = (viewport: HTMLElement) => [
  viewport.hasAttribute("data-fade-top"),
  viewport.hasAttribute("data-fade-bottom"),
];

test("the fade shows only on the edges that can still scroll", () => {
  const { viewport } = setup({ fade: true });
  size(viewport, { scrollHeight: 400, clientHeight: 100 });
  scrollTo(viewport, 0);
  expect(edges(viewport)).toEqual([false, true]);
  scrollTo(viewport, 120);
  expect(edges(viewport)).toEqual([true, true]);
  scrollTo(viewport, 300);
  expect(edges(viewport)).toEqual([true, false]);
  scrollTo(viewport, 0);
  expect(edges(viewport)).toEqual([false, true]);
});

test("content that fits shows no fade, and fade is off unless asked for", () => {
  const fits = setup({ fade: true });
  size(fits.viewport, { scrollHeight: 100, clientHeight: 100 });
  scrollTo(fits.viewport, 0);
  expect(edges(fits.viewport)).toEqual([false, false]);
  fits.unmount();
  const plain = setup();
  size(plain.viewport, { scrollHeight: 400, clientHeight: 100 });
  scrollTo(plain.viewport, 150);
  expect(edges(plain.viewport)).toEqual([false, false]);
  expect(plain.viewport.classList.contains(styles.fade!)).toBe(false);
});

test("a resize of the viewport or the content measures again, and cleanup disconnects", () => {
  const { viewport, unmount } = setup({ fade: true });
  expect(edges(viewport)).toEqual([false, false]);
  expect(observers).toHaveLength(1);
  expect(observers[0]?.targets).toHaveLength(2);
  size(viewport, { scrollHeight: 400, clientHeight: 100 });
  observers[0]!.callback();
  expect(edges(viewport)).toEqual([false, true]);
  size(viewport, { scrollHeight: 90, clientHeight: 100 });
  observers[0]!.callback();
  expect(edges(viewport)).toEqual([false, false]);
  unmount();
  expect(observers[0]?.disconnected).toBe(true);
});

test("the rail thumb follows the scroll position and hides when nothing scrolls", () => {
  const { viewport, container } = setup({ scrollbar: "rail" });
  expect(container.querySelector(`.${styles.rail}`)).toBeNull();
  size(viewport, { scrollHeight: 400, clientHeight: 100 });
  scrollTo(viewport, 0);
  const thumb = () => container.querySelector<HTMLElement>(`.${styles.thumb}`)!;
  expect(thumb().style.height).toBe("25px");
  expect(thumb().style.top).toBe("0px");
  scrollTo(viewport, 300);
  expect(thumb().style.top).toBe("75px");
  scrollTo(viewport, 150);
  expect(thumb().style.top).toBe("37.5px");
});

test("scrollbar hidden and rail drop the native bar, native keeps it", () => {
  const hidden = setup({ scrollbar: "hidden" });
  expect(hidden.viewport.classList.contains(styles.bare!)).toBe(true);
  hidden.unmount();
  const rail = setup({ scrollbar: "rail" });
  expect(rail.viewport.classList.contains(styles.bare!)).toBe(true);
  rail.unmount();
  const native = setup();
  expect(native.viewport.classList.contains(styles.bare!)).toBe(false);
});

test("class, classes, aug and theme land on the wrapper and the parts", () => {
  const { container } = render(() => (
    <ScrollArea
      class="mine"
      classes={{ viewport: "vp", content: "ct" }}
      aug={{ tl: "clip" }}
      theme={{ line: "cyan" }}
    >
      rows
    </ScrollArea>
  ));
  const root = container.firstElementChild as HTMLElement;
  expect(root.classList.contains("mine")).toBe(true);
  expect(root.classList.contains(styles.root!)).toBe(true);
  expect(root.getAttribute("data-augmented-ui")).toBe("tl-clip");
  expect(root.style.getPropertyValue("--theme-line")).toBe("cyan");
  expect(container.querySelector(".vp")?.classList.contains(styles.viewport!)).toBe(true);
  expect(container.querySelector(".ct")?.textContent).toBe("rows");
  expect(container.querySelectorAll("[data-augmented-ui]")).toHaveLength(1);
});
