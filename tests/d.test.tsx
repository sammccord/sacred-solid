import { flush } from "solid-js";
import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { CHESSBOARD_DEFAULT_POSITIONS } from "../src/common/constants.ts";
import { ASCIICanvas } from "../src/components/ASCIICanvas.tsx";
import { BarLoader } from "../src/components/BarLoader.tsx";
import { BlockLoader } from "../src/components/BlockLoader.tsx";
import { CanvasPlatformer } from "../src/components/CanvasPlatformer.tsx";
import { CanvasSnake } from "../src/components/CanvasSnake.tsx";
import { Chessboard } from "../src/components/Chessboard.tsx";
import domSnakeStyles from "../src/components/DOMSnake.module.css";
import { DOMSnake } from "../src/components/DOMSnake.tsx";
import { MatrixLoader } from "../src/components/MatrixLoader.tsx";
import { OneLineLoaders } from "../src/components/examples/OneLineLoaders.tsx";

const CHAR_WIDTH = 10;

type IntersectionCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

let intersectionCallbacks: IntersectionCallback[] = [];

class FakeIntersectionObserver {
  constructor(callback: IntersectionCallback) {
    intersectionCallbacks.push(callback);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function stubGeometry(clientWidth: number, clientHeight: number) {
  vi.spyOn(Element.prototype, "clientWidth", "get").mockReturnValue(clientWidth);
  vi.spyOn(Element.prototype, "clientHeight", "get").mockReturnValue(clientHeight);
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
    width: CHAR_WIDTH,
    height: 20,
    left: 0,
    top: 0,
    right: CHAR_WIDTH,
    bottom: 20,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
}

function setVisible(isIntersecting: boolean) {
  for (const callback of intersectionCallbacks) callback([{ isIntersecting }]);
}

async function startFrames() {
  await vi.advanceTimersByTimeAsync(16);
  setVisible(true);
  flush();
}

async function frames(count: number) {
  await vi.advanceTimersByTimeAsync(16 * count);
}

function cells(pre: HTMLElement): HTMLElement[] {
  const spans = Array.from(pre.querySelectorAll<HTMLElement>(":scope > span"));
  return spans.slice(0, -1);
}

function touch(target: HTMLElement, type: string, identifier: number) {
  const event = new Event(type, { bubbles: true });
  Object.defineProperty(event, "changedTouches", {
    value: [{ identifier, clientX: 5, clientY: 5 }],
  });
  Object.defineProperty(event, "touches", {
    value: [{ identifier, clientX: 5, clientY: 5 }],
  });
  target.dispatchEvent(event);
}

beforeEach(() => {
  intersectionCallbacks = [];
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  vi.stubGlobal("ResizeObserver", FakeResizeObserver);
  vi.useFakeTimers({
    toFake: [
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "requestAnimationFrame",
      "cancelAnimationFrame",
      "performance",
      "Date",
    ],
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ASCIICanvas", () => {
  test("builds a rows x cols span grid and animates digits once visible", async () => {
    stubGeometry(100, 60);
    const { container, unmount } = render(() => <ASCIICanvas rows={3} />);
    const pre = container.querySelector("pre") as HTMLElement;
    expect(cells(pre)).toHaveLength(30);
    expect(pre.textContent?.replace(/X$/, "").split("\n")).toHaveLength(3);

    await startFrames();
    await frames(2);
    expect(cells(pre).every((cell) => cell.textContent === "1" || cell.textContent === "0")).toBe(
      true,
    );
    expect(cells(pre).every((cell) => cell.style.color.startsWith("rgb("))).toBe(true);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  test("stops drawing when it leaves the viewport", async () => {
    stubGeometry(100, 60);
    const { container } = render(() => <ASCIICanvas rows={2} />);
    const pre = container.querySelector("pre") as HTMLElement;
    await startFrames();
    await frames(1);
    setVisible(false);
    flush();
    await frames(1);
    const snapshot = pre.innerHTML;
    await vi.advanceTimersByTimeAsync(5000);
    expect(pre.innerHTML).toBe(snapshot);
  });
});

describe("BarLoader", () => {
  test("advances by ten percent per interval and wraps after 100", async () => {
    const { container } = render(() => <BarLoader intervalRate={1000} />);
    const bar = container.firstElementChild?.firstElementChild as HTMLElement;
    expect(bar.style.width).toBe("0%");
    await vi.advanceTimersByTimeAsync(1000);
    expect(bar.style.width).toBe("10%");
    await vi.advanceTimersByTimeAsync(9000);
    expect(bar.style.width).toBe("100%");
    await vi.advanceTimersByTimeAsync(1000);
    expect(bar.style.width).toBe("0%");
  });

  test("a fixed progress does not tick and clears its interval on unmount", async () => {
    const { container, unmount } = render(() => <BarLoader progress={50} intervalRate={1000} />);
    const bar = container.firstElementChild?.firstElementChild as HTMLElement;
    await vi.advanceTimersByTimeAsync(5000);
    expect(bar.style.width).toBe("50%");
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("BlockLoader", () => {
  test("cycles glyphs every 100ms and wraps", async () => {
    const { container } = render(() => <BlockLoader mode={2} />);
    const span = container.querySelector("span") as HTMLElement;
    expect(span.textContent).toBe("▖");
    await vi.advanceTimersByTimeAsync(100);
    expect(span.textContent).toBe("▘");
    await vi.advanceTimersByTimeAsync(300);
    expect(span.textContent).toBe("▖");
  });

  test("an unknown mode renders the replacement glyph and no timer", () => {
    const { container } = render(() => <BlockLoader mode={99} />);
    expect(container.querySelector("span")?.textContent).toBe("�");
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("MatrixLoader", () => {
  test("drops katakana heads down each column, one row per frame", async () => {
    stubGeometry(50, 100);
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { container, unmount } = render(() => <MatrixLoader rows={4} mode="katakana" />);
    const grid = cells(container.querySelector("pre") as HTMLElement);
    expect(grid).toHaveLength(20);

    await startFrames();
    await frames(1);
    expect(grid.slice(0, 5).map((cell) => cell.textContent)).toEqual(Array(5).fill("゠"));
    expect(grid.slice(5).every((cell) => cell.textContent === " ")).toBe(true);

    await frames(1);
    expect(grid.slice(5, 10).map((cell) => cell.textContent)).toEqual(Array(5).fill("゠"));
    expect(Number(grid[0].style.opacity)).toBeCloseTo(0.92, 2);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  test("left-to-right sweeps along each row", async () => {
    stubGeometry(50, 100);
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { container } = render(() => (
      <MatrixLoader rows={3} direction="left-to-right" mode="katakana" />
    ));
    const grid = cells(container.querySelector("pre") as HTMLElement);
    await startFrames();
    await frames(1);
    expect([0, 5, 10].map((i) => grid[i].textContent)).toEqual(["゠", "゠", "゠"]);
    expect(grid[1].textContent).toBe(" ");
    await frames(1);
    expect(grid[1].textContent).toBe("゠");
  });
});

describe("CanvasSnake", () => {
  function setup() {
    stubGeometry(300, 240);
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = render(() => <CanvasSnake rows={12} />);
    const pre = result.container.querySelector("pre") as HTMLElement;
    const filled = () => cells(pre).flatMap((cell, i) => (cell.textContent === "█" ? [i] : []));
    return { ...result, pre, filled };
  }

  test("draws a 14 segment snake and the fruit", async () => {
    const { filled } = setup();
    await startFrames();
    await frames(1);
    const snake = Array.from({ length: 14 }, (_, i) => 6 * 30 + 2 + i);
    expect(filled()).toEqual([0, ...snake]);
  });

  test("only moves while focused, and arrow keys steer it", async () => {
    const { pre, filled } = setup();
    await startFrames();
    await frames(30);
    const before = filled();

    fireEvent.keyDown(window, { key: "ArrowUp" });
    await frames(30);
    expect(filled()).toEqual(before);

    pre.focus();
    const event = new KeyboardEvent("keydown", { key: "ArrowUp", cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    await frames(12);
    const after = filled();
    expect(after).toContain(5 * 30 + 15);
    expect(after).not.toContain(6 * 30 + 2);
  });

  test("reversing into itself is ignored", async () => {
    const { pre, filled } = setup();
    await startFrames();
    await frames(1);
    pre.focus();
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    await frames(12);
    expect(filled()).toContain(6 * 30 + 16);
  });

  test("hitting the wall restarts the game", async () => {
    const { pre, filled } = setup();
    await startFrames();
    await frames(1);
    pre.focus();
    const head = () => Math.max(...filled());
    let sawWall = false;
    let restarted = false;
    for (let i = 0; i < 400 && !restarted; i++) {
      await frames(1);
      if (head() === 6 * 30 + 29) sawWall = true;
      if (sawWall && head() === 6 * 30 + 15) restarted = true;
    }
    expect(restarted).toBe(true);
    expect(filled().filter((i) => i !== 0)).toHaveLength(14);
  });

  test("removes its listeners and frame loop on unmount", async () => {
    const { pre, unmount } = setup();
    await startFrames();
    pre.focus();
    unmount();
    const event = new KeyboardEvent("keydown", { key: "ArrowUp", cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("CanvasPlatformer", () => {
  function setup() {
    stubGeometry(300, 120);
    const result = render(() => <CanvasPlatformer rows={12} />);
    const pre = result.container.querySelector("pre") as HTMLElement;
    const glyphs = () => cells(pre).map((cell) => cell.textContent);
    const playerAt = () => {
      const index = glyphs().indexOf("█");
      return { x: index % 30, y: Math.floor(index / 30) };
    };
    return { ...result, pre, glyphs, playerAt };
  }

  test("draws the floor and a player standing on it", async () => {
    const { glyphs, playerAt } = setup();
    await startFrames();
    await frames(3);
    const floor = glyphs().slice(10 * 30, 11 * 30);
    expect(floor.every((glyph) => glyph === "░")).toBe(true);
    expect(playerAt()).toEqual({ x: 2, y: 9 });
  });

  test("arrow keys move the player only while focused", async () => {
    const { pre, playerAt } = setup();
    await startFrames();
    await frames(2);

    fireEvent.keyDown(window, { key: "ArrowRight" });
    await frames(10);
    expect(playerAt().x).toBe(2);
    fireEvent.keyUp(window, { key: "ArrowRight" });

    pre.focus();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    await frames(10);
    expect(playerAt().x).toBeGreaterThan(2);
    fireEvent.keyUp(window, { key: "ArrowRight" });
    await frames(40);
    const rest = playerAt().x;
    await frames(10);
    expect(playerAt().x).toBe(rest);
  });

  test("space jumps off the floor", async () => {
    const { pre, playerAt } = setup();
    await startFrames();
    await frames(2);
    pre.focus();
    const event = new KeyboardEvent("keydown", { code: "Space", key: " ", cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    let highest = 9;
    for (let i = 0; i < 30; i++) {
      await frames(1);
      highest = Math.min(highest, playerAt().y);
    }
    expect(highest).toBeLessThan(9);
  });

  test("clicking toggles a platform block", async () => {
    const { pre, glyphs } = setup();
    await startFrames();
    await frames(2);
    const index = 1 * 30 + 5;
    expect(glyphs()[index]).toBe(" ");
    fireEvent.click(pre, { clientX: 55, clientY: 15 });
    await frames(1);
    expect(glyphs()[index]).toBe("░");
    fireEvent.click(pre, { clientX: 55, clientY: 15 });
    await frames(1);
    expect(glyphs()[index]).toBe(" ");
  });

  test("ignores clicks that follow a touch and clears its timer on unmount", async () => {
    const { pre, glyphs, unmount } = setup();
    await startFrames();
    await frames(2);
    const index = 1 * 30 + 5;
    touch(pre, "touchstart", 1);
    touch(pre, "touchend", 1);
    fireEvent.click(pre, { clientX: 55, clientY: 15 });
    await frames(1);
    expect(glyphs()[index]).toBe(" ");
    await vi.advanceTimersByTimeAsync(300);
    fireEvent.click(pre, { clientX: 55, clientY: 15 });
    await frames(1);
    expect(glyphs()[index]).toBe("░");

    touch(pre, "touchstart", 2);
    touch(pre, "touchend", 2);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("DOMSnake", () => {
  const snakeCells = (container: HTMLElement) =>
    Array.from(container.querySelectorAll(`.${domSnakeStyles.grid} > div`)).flatMap((cell, i) =>
      cell.classList.contains(domSnakeStyles.snake) ? [i] : [],
    );

  test("renders a width x height grid with a centered snake and a food cell", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { container } = render(() => <DOMSnake />);
    const grid = container.querySelector(`.${domSnakeStyles.grid}`) as HTMLElement;
    expect(grid.children).toHaveLength(800);
    expect(grid.getAttribute("style")).toContain("repeat(40, 10px)");
    expect(grid.getAttribute("style")).toContain("repeat(20, 20px)");
    expect(snakeCells(container)).toEqual([10 * 40 + 20]);
    expect(grid.children[0].classList.contains(domSnakeStyles.food)).toBe(true);
    expect(document.activeElement).toBe(grid);
  });

  test("moves right on every tick and restarts at the wall", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { container } = render(() => <DOMSnake />);
    await vi.advanceTimersByTimeAsync(150);
    expect(snakeCells(container)).toEqual([10 * 40 + 21]);
    await vi.advanceTimersByTimeAsync(150 * 18);
    expect(snakeCells(container)).toEqual([10 * 40 + 39]);
    await vi.advanceTimersByTimeAsync(150);
    expect(snakeCells(container)).toEqual([10 * 40 + 20]);
  });

  test("arrow keys steer, reversing is blocked, and every key is swallowed", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { container } = render(() => <DOMSnake />);
    const left = new KeyboardEvent("keydown", { key: "ArrowLeft", cancelable: true });
    window.dispatchEvent(left);
    expect(left.defaultPrevented).toBe(true);
    await vi.advanceTimersByTimeAsync(150);
    expect(snakeCells(container)).toEqual([10 * 40 + 21]);

    const other = new KeyboardEvent("keydown", { key: "a", cancelable: true });
    window.dispatchEvent(other);
    expect(other.defaultPrevented).toBe(true);

    fireEvent.keyDown(window, { key: "ArrowDown" });
    await vi.advanceTimersByTimeAsync(150);
    expect(snakeCells(container)).toEqual([11 * 40 + 21]);
  });

  test("direction buttons steer the snake", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { container } = render(() => <DOMSnake />);
    fireEvent.click(screen.getByText("Up"));
    await vi.advanceTimersByTimeAsync(150);
    expect(snakeCells(container)).toEqual([9 * 40 + 20]);
  });

  test("eating food grows the snake and speeds it up by 5ms", async () => {
    const random = vi.spyOn(Math, "random");
    random
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(21.5 / 40)
      .mockReturnValueOnce(10.5 / 20)
      .mockReturnValue(0);
    const { container } = render(() => <DOMSnake />);
    await vi.advanceTimersByTimeAsync(150);
    expect(snakeCells(container)).toEqual([10 * 40 + 20, 10 * 40 + 21]);
    await vi.advanceTimersByTimeAsync(144);
    expect(snakeCells(container)).toEqual([10 * 40 + 20, 10 * 40 + 21]);
    await vi.advanceTimersByTimeAsync(1);
    expect(snakeCells(container)).toEqual([10 * 40 + 21, 10 * 40 + 22]);
  });

  test("clears its interval and key listener on unmount", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { unmount } = render(() => <DOMSnake />);
    unmount();
    vi.runOnlyPendingTimers();
    expect(vi.getTimerCount()).toBe(0);
    const event = new KeyboardEvent("keydown", { key: "ArrowUp", cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});

describe("Chessboard", () => {
  test("renders the labelled board with pieces in the right squares", async () => {
    const { container } = render(() => <Chessboard board={CHESSBOARD_DEFAULT_POSITIONS} />);
    const rows = Array.from(container.querySelectorAll("tr"));
    expect(rows).toHaveLength(9);
    expect(rows[0].textContent).toBe("ABCDEFGH");
    expect(rows[1].textContent).toBe("8♜♞♝♛♚♝♞♜");
    expect(rows[2].textContent).toBe("7♟♟♟♟♟♟♟♟");
    expect(rows[8].textContent).toBe("1♖♘♗♕♔♗♘♖");
    const squares = rows[1].querySelectorAll("td:not(:first-child)");
    expect(squares[0].className).not.toBe(squares[1].className);
    expect(squares[0].className).toBe(squares[2].className);
  });
});

describe("OneLineLoaders", () => {
  test("starts at frame zero and advances spinners, dots and elapsed time together", async () => {
    const { container, unmount } = render(() => <OneLineLoaders />);
    const lines = () => Array.from(container.querySelectorAll("section > div"));
    expect(lines()).toHaveLength(18);
    expect(lines()[0].textContent).toBe("⠋⠋⠋⠋  Thinking﹒ (0ms)");
    expect(lines()[17].textContent).toBe("⠁⠀⠀⠀  Ruminating﹒ (0ms)");

    await vi.advanceTimersByTimeAsync(600);
    expect(lines()[0].textContent).toBe("⠧⠧⠧⠧  Thinking﹒﹒ (600ms)");

    await vi.advanceTimersByTimeAsync(1200);
    expect(lines()[1].textContent).toContain("Pondering﹒ (1.8s)");

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
