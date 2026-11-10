import { createEffect, mergeProps, onCleanup, onMount } from "solid-js";
import { ActionButton } from "./ActionButton.tsx";
import styles from "./CanvasPlatformer.module.css";
import { classNames } from "../common/utilities.ts";

export interface CanvasPlatformerProps {
  class?: string;
  rows?: number;
}

interface Position {
  x: number;
  y: number;
}

interface Keys {
  left: boolean;
  right: boolean;
  jump: boolean;
}

const GRAVITY = 0.015;
const MOVE_SPEED = 0.2;
const JUMP_SPEED = -0.3;
const FRICTION = 0.85;

export function CanvasPlatformer(propsIn: CanvasPlatformerProps) {
  const props = mergeProps({ rows: 25 }, propsIn);
  let pre: HTMLPreElement | undefined;
  let focused = false;

  let position: Position = { x: 2, y: 0 };
  let velocity: Position = { x: 0, y: 0 };
  let keys: Keys = { left: false, right: false, jump: false };
  let platformBlocks = new Set<string>();
  let cols = 40;
  let touchActive = false;

  let frame = 0;
  let visible = false;
  let grid: HTMLSpanElement[] = [];
  let prevCols = 0;
  let prevChars: string[] = [];
  let prevColors: string[] = [];

  createEffect(() => {
    const el = pre;
    if (!el) return;
    const rows = props.rows;

    let cancelled = false;

    const measure = document.createElement("span");
    measure.style.visibility = "hidden";
    measure.style.position = "absolute";
    measure.style.whiteSpace = "pre";
    measure.textContent = "X";
    el.appendChild(measure);

    const themeBorderColor = getComputedStyle(document.body)
      .getPropertyValue("--theme-line")
      .trim();
    const themeTextColor = getComputedStyle(document.body).getPropertyValue("--theme-ink").trim();

    const initPlatform = (nextCols: number) => {
      const platformY = rows - 2;
      const blocks = new Set<string>();
      for (let x = 0; x < nextCols; x++) {
        blocks.add(`${x},${platformY}`);
      }
      platformBlocks = blocks;
      position = { x: 2, y: platformY - 1 };
      velocity = { x: 0, y: 0 };
    };

    const buildGrid = (nextCols: number) => {
      if (nextCols === prevCols) return;
      prevCols = nextCols;
      cols = nextCols;
      while (el.firstChild && el.firstChild !== measure) {
        el.removeChild(el.firstChild);
      }

      const frag = document.createDocumentFragment();
      const spans: HTMLSpanElement[] = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < nextCols; x++) {
          const s = document.createElement("span");
          s.textContent = " ";
          spans.push(s);
          frag.appendChild(s);
        }
        if (y < rows - 1) frag.appendChild(document.createTextNode("\n"));
      }

      el.insertBefore(frag, measure);
      grid = spans;
      prevChars = Array.from({ length: nextCols * rows }, () => "");
      prevColors = Array.from({ length: nextCols * rows }, () => "");
      initPlatform(nextCols);
    };

    const updateCols = () => {
      const chW = measure.getBoundingClientRect().width;
      if (chW > 0) {
        buildGrid(Math.floor(el.clientWidth / chW));
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

    const handleClick = (e: MouseEvent) => {
      if (touchActive) return;
      const rect = el.getBoundingClientRect();
      const chW = measure.getBoundingClientRect().width;
      const lineH = el.clientHeight / rows;
      const gx = Math.floor((e.clientX - rect.left) / chW);
      const gy = Math.floor((e.clientY - rect.top) / lineH);
      if (gx < 0 || gx >= cols || gy < 0 || gy >= rows) return;
      const key = `${gx},${gy}`;
      if (platformBlocks.has(key)) {
        platformBlocks.delete(key);
      } else {
        platformBlocks.add(key);
      }
    };
    el.addEventListener("click", handleClick);

    const loop = () => {
      if (!visible || cancelled) return;

      const total = cols * rows;
      const blocks = platformBlocks;
      const pos = position;
      const vel = velocity;
      const currentKeys = keys;

      if (currentKeys.left) vel.x = -MOVE_SPEED;
      else if (currentKeys.right) vel.x = MOVE_SPEED;
      else {
        vel.x *= FRICTION;
        if (Math.abs(vel.x) < 0.01) vel.x = 0;
      }

      const oldY = pos.y;
      vel.y += GRAVITY;
      pos.x += vel.x;
      pos.y += vel.y;

      if (pos.x < 0) pos.x = 0;
      if (pos.x > cols - 1) pos.x = cols - 1;

      const px = Math.round(pos.x);
      let groundY = rows;
      for (let checkY = Math.floor(oldY) + 1; checkY < rows; checkY++) {
        if (blocks.has(`${px},${checkY}`)) {
          groundY = checkY;
          break;
        }
      }

      if (pos.y + 1 > groundY) {
        pos.y = groundY - 1;
        vel.y = 0;
        if (currentKeys.jump) vel.y = JUMP_SPEED;
      }

      if (pos.y >= rows) {
        const platformY = rows - 2;
        pos.x = 2;
        pos.y = platformY - 1;
        vel.x = 0;
        vel.y = 0;
      }

      const playerGX = Math.round(pos.x);
      const playerGY = Math.round(pos.y);

      for (let idx = 0; idx < total && idx < grid.length; idx++) {
        const gx = idx % cols;
        const gy = (idx - gx) / cols;
        const s = grid[idx];
        let ch: string;
        let color: string;

        if (gx === playerGX && gy === playerGY) {
          ch = "█";
          color = themeTextColor;
        } else if (blocks.has(`${gx},${gy}`)) {
          ch = "░";
          color = themeBorderColor;
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

    onCleanup(() => {
      cancelled = true;
      cancelAnimationFrame(frame);
      resizeObs.disconnect();
      interObs.disconnect();
      el.removeEventListener("click", handleClick);
      if (measure.parentNode) measure.parentNode.removeChild(measure);
    });
  });

  onMount(() => {
    const el = pre;
    if (!el) return;

    const onFocus = () => {
      focused = true;
    };
    const onBlur = () => {
      focused = false;
      keys = { left: false, right: false, jump: false };
    };

    el.tabIndex = 0;
    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);

    onCleanup(() => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
    });
  });

  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focused) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.code === "Space") {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === "ArrowLeft") keys.left = true;
      if (e.key === "ArrowRight") keys.right = true;
      if (e.code === "Space") keys.jump = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!focused) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.code === "Space") {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === "ArrowLeft") keys.left = false;
      if (e.key === "ArrowRight") keys.right = false;
      if (e.code === "Space") keys.jump = false;
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("keyup", handleKeyUp, { capture: true });

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("keyup", handleKeyUp, { capture: true });
    });
  });

  onMount(() => {
    const el = pre;
    if (!el) return;

    const activeTouches = new Map<number, string>();
    const pendingTimeouts = new Set<number>();

    const getRegion = (touch: Touch): string => {
      const rect = el.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const third = rect.width / 3;
      if (x < third) return "left";
      if (x > third * 2) return "right";
      return "center";
    };

    const updateKeysFromTouch = () => {
      const regions = new Set(activeTouches.values());
      keys.left = regions.has("left");
      keys.right = regions.has("right");
      keys.jump = regions.has("center");
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!focused) el.focus();
      touchActive = true;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        activeTouches.set(t.identifier, getRegion(t));
      }
      updateKeysFromTouch();
    };

    const onTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (activeTouches.has(t.identifier)) {
          activeTouches.set(t.identifier, getRegion(t));
        }
      }
      updateKeysFromTouch();
    };

    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        activeTouches.delete(e.changedTouches[i].identifier);
      }
      updateKeysFromTouch();
      if (activeTouches.size === 0) {
        const id = window.setTimeout(() => {
          pendingTimeouts.delete(id);
          touchActive = false;
        }, 300);
        pendingTimeouts.add(id);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    onCleanup(() => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      for (const id of pendingTimeouts) clearTimeout(id);
    });
  });

  const handleJumpClick = () => {
    const pos = position;
    const vel = velocity;
    const blocks = platformBlocks;
    const px = Math.round(pos.x);
    let groundY = props.rows;
    for (let checkY = Math.floor(pos.y) + 1; checkY < props.rows; checkY++) {
      if (blocks.has(`${px},${checkY}`)) {
        groundY = checkY;
        break;
      }
    }
    if (pos.y + 1 >= groundY) vel.y = JUMP_SPEED;
  };

  const handleLeftClick = () => {
    position.x -= 1;
    if (position.x < 0) position.x = 0;
  };

  const handleRightClick = () => {
    position.x += 1;
    if (position.x > cols - 1) position.x = cols - 1;
  };

  return (
    <>
      <ActionButton hotkey="␣" onClick={handleJumpClick}>
        Jump
      </ActionButton>
      <ActionButton hotkey="←" onClick={handleLeftClick}>
        Left
      </ActionButton>
      <ActionButton hotkey="→" onClick={handleRightClick}>
        Right
      </ActionButton>
      <div class={classNames(styles.container, props.class)}>
        <pre
          ref={(el) => (pre = el)}
          class={styles.root}
          tabIndex={0}
          style={{
            height: `calc(var(--font-size) * var(--theme-line-height-base) * ${props.rows})`,
          }}
        />
      </div>
    </>
  );
}
