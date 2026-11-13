import { createEffect, onSettled } from "solid-js";
import { ActionButton } from "./ActionButton.tsx";
import styles from "./CanvasSnake.module.css";
import { classNames, mergeDefaults } from "../common/utilities.ts";

export interface CanvasSnakeProps {
  class?: string;
  rows?: number;
}

interface Position {
  x: number;
  y: number;
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const MOVE_INTERVAL = 150;

export function CanvasSnake(propsIn: CanvasSnakeProps) {
  const props = mergeDefaults({ rows: 25 }, propsIn);
  let pre: HTMLPreElement | undefined;
  let direction: Direction = "RIGHT";
  let snake: Position[] = [];
  let fruit: Position = { x: 0, y: 0 };
  let gridWidth = 0;
  let lastMoveTime = 0;
  let frame = 0;
  let visible = false;
  let grid: HTMLSpanElement[] = [];
  let prevCols = 0;
  let prevChars: string[] = [];
  let prevColors: string[] = [];
  let focused = false;

  const reset = (cols: number, gridRows: number) => {
    gridWidth = cols;

    const startX = Math.floor(cols / 2);
    const startY = Math.floor(gridRows / 2);

    const nextSnake: Position[] = [];
    for (let i = 13; i >= 0; i--) {
      nextSnake.push({ x: startX - i, y: startY });
    }
    snake = nextSnake;
    direction = "RIGHT";

    fruit = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * gridRows),
    };

    lastMoveTime = performance.now();
  };

  createEffect(
    () => props.rows,
    (rows) => {
      const el = pre;
      if (!el) return;

      let cancelled = false;

      const measure = document.createElement("span");
      measure.style.visibility = "hidden";
      measure.style.position = "absolute";
      measure.style.whiteSpace = "pre";
      measure.textContent = "X";
      el.appendChild(measure);

      const themeTextColor = getComputedStyle(document.body).getPropertyValue("--theme-ink").trim();
      const themeFocusedColor = getComputedStyle(document.body)
        .getPropertyValue("--theme-accent")
        .trim();

      const buildGrid = (cols: number) => {
        if (cols === prevCols) return;
        prevCols = cols;
        while (el.firstChild && el.firstChild !== measure) {
          el.removeChild(el.firstChild);
        }

        const frag = document.createDocumentFragment();
        const spans: HTMLSpanElement[] = [];

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const s = document.createElement("span");
            s.textContent = " ";
            spans.push(s);
            frag.appendChild(s);
          }
          if (y < rows - 1) frag.appendChild(document.createTextNode("\n"));
        }

        el.insertBefore(frag, measure);
        grid = spans;
        prevChars = Array.from({ length: cols * rows }, () => "");
        prevColors = Array.from({ length: cols * rows }, () => "");
        reset(cols, rows);
      };

      const updateCols = () => {
        const chW = measure.getBoundingClientRect().width;
        if (chW > 0) {
          const cols = Math.floor(el.clientWidth / chW);
          buildGrid(cols);
        }
      };
      updateCols();

      const resizeObs = new ResizeObserver(updateCols);
      resizeObs.observe(el);

      const interObs = new IntersectionObserver(
        ([entry]) => {
          const wasVisible = visible;
          visible = entry.isIntersecting;
          if (entry.isIntersecting && !wasVisible) {
            frame = requestAnimationFrame(loop);
          }
        },
        { threshold: 0 },
      );
      interObs.observe(el);

      const moveSnake = () => {
        const dir = direction;
        const head = snake[snake.length - 1];
        const newHead: Position = { x: head.x, y: head.y };

        if (dir === "LEFT") newHead.x -= 1;
        if (dir === "RIGHT") newHead.x += 1;
        if (dir === "UP") newHead.y -= 1;
        if (dir === "DOWN") newHead.y += 1;

        const cols = gridWidth;
        if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
          reset(cols, rows);
          return;
        }

        for (const seg of snake) {
          if (seg.x === newHead.x && seg.y === newHead.y) {
            reset(cols, rows);
            return;
          }
        }

        snake.push(newHead);
        if (newHead.x === fruit.x && newHead.y === fruit.y) {
          let fruitPos: Position;
          while (true) {
            fruitPos = {
              x: Math.floor(Math.random() * cols),
              y: Math.floor(Math.random() * rows),
            };
            if (!snake.some((s) => s.x === fruitPos.x && s.y === fruitPos.y)) break;
          }
          fruit = fruitPos;
        } else {
          snake.shift();
        }
      };

      const loop = (time: number) => {
        if (!visible || cancelled) return;

        const cols = gridWidth;
        const total = cols * rows;

        if (focused && time - lastMoveTime > MOVE_INTERVAL) {
          moveSnake();
          lastMoveTime = time;
        }

        const snakeSet = new Set<number>();
        for (const seg of snake) {
          snakeSet.add(seg.y * cols + seg.x);
        }
        const fruitIdx = fruit.y * cols + fruit.x;

        for (let idx = 0; idx < total && idx < grid.length; idx++) {
          const s = grid[idx];
          let ch: string;
          let color: string;

          if (snakeSet.has(idx)) {
            ch = "█";
            color = themeTextColor;
          } else if (idx === fruitIdx) {
            ch = "█";
            color = themeFocusedColor;
          } else {
            ch = " ";
            color = "";
          }

          if (ch !== prevChars[idx]) {
            s.textContent = ch;
            prevChars[idx] = ch;
          }
          if (color !== prevColors[idx]) {
            s.style.color = color;
            prevColors[idx] = color;
          }
        }

        frame = requestAnimationFrame(loop);
      };

      frame = requestAnimationFrame(loop);

      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
        resizeObs.disconnect();
        interObs.disconnect();
        if (measure.parentNode) measure.parentNode.removeChild(measure);
      };
    },
  );

  onSettled(() => {
    const el = pre;
    if (!el) return;

    const onFocus = () => {
      focused = true;
    };
    const onBlur = () => {
      focused = false;
    };

    el.tabIndex = 0;
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);

    return () => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    };
  });

  onSettled(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focused) return;
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
      const currentDir = direction;
      if (e.key === "ArrowLeft" && currentDir !== "RIGHT") direction = "LEFT";
      if (e.key === "ArrowRight" && currentDir !== "LEFT") direction = "RIGHT";
      if (e.key === "ArrowUp" && currentDir !== "DOWN") direction = "UP";
      if (e.key === "ArrowDown" && currentDir !== "UP") direction = "DOWN";
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  });

  onSettled(() => {
    const el = pre;
    if (!el) return;

    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      if (!focused) el.focus();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx < 10 && absDy < 10) return;

      const currentDir = direction;
      if (absDx > absDy) {
        if (dx > 0 && currentDir !== "LEFT") direction = "RIGHT";
        if (dx < 0 && currentDir !== "RIGHT") direction = "LEFT";
      } else {
        if (dy > 0 && currentDir !== "UP") direction = "DOWN";
        if (dy < 0 && currentDir !== "DOWN") direction = "UP";
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  });

  const onHandleClickUp = () => {
    if (direction !== "DOWN") direction = "UP";
  };
  const onHandleClickDown = () => {
    if (direction !== "UP") direction = "DOWN";
  };
  const onHandleClickLeft = () => {
    if (direction !== "RIGHT") direction = "LEFT";
  };
  const onHandleClickRight = () => {
    if (direction !== "LEFT") direction = "RIGHT";
  };

  return (
    <>
      <ActionButton hotkey="↑" onClick={onHandleClickUp}>
        Up
      </ActionButton>
      <ActionButton hotkey="↓" onClick={onHandleClickDown}>
        Down
      </ActionButton>
      <ActionButton hotkey="←" onClick={onHandleClickLeft}>
        Left
      </ActionButton>
      <ActionButton hotkey="→" onClick={onHandleClickRight}>
        Right
      </ActionButton>
      <div class={classNames(styles.container, props.class)}>
        <pre
          ref={(el) => (pre = el)}
          class={styles.root}
          tabindex={0}
          style={{
            height: `calc(var(--font-size) * var(--theme-line-height-base) * ${props.rows})`,
          }}
        />
      </div>
    </>
  );
}
