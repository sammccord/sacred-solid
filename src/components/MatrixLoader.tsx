import { createEffect } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./MatrixLoader.module.css";
import { classNames, mergeDefaults } from "../common/utilities.ts";

export interface MatrixLoaderProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  rows?: number;
  direction?: "top-to-bottom" | "left-to-right";
  mode?: "greek" | "katakana";
}

function randomChar(mode: string): string {
  if (mode === "greek") {
    const isUppercase = Math.random() < 0.5;
    return String.fromCharCode(
      isUppercase
        ? 0x0391 + Math.floor(Math.random() * (0x03a9 - 0x0391 + 1))
        : 0x03b1 + Math.floor(Math.random() * (0x03c9 - 0x03b1 + 1)),
    );
  }
  if (mode === "katakana") {
    return String.fromCharCode(0x30a0 + Math.floor(Math.random() * (0x30ff - 0x30a0 + 1)));
  }
  return "0";
}

export function MatrixLoader(propsIn: MatrixLoaderProps) {
  const props = mergeDefaults(
    { rows: 25, direction: "top-to-bottom", mode: "greek" } satisfies MatrixLoaderProps,
    propsIn,
  );
  let pre: HTMLPreElement | undefined;
  let frame = 0;
  let cols = 40;
  let visible = false;
  let grid: HTMLSpanElement[] = [];
  let prevCols = 0;
  let prevChars: string[] = [];
  let prevColors: string[] = [];

  createEffect(
    () => [props.rows, props.direction, props.mode] as const,
    ([rows, direction, mode]) => {
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

      let headPositions: number[] = [];
      let cellBrightness: Float64Array = new Float64Array(0);

      const buildGrid = (nextCols: number) => {
        if (nextCols === prevCols) return;
        prevCols = nextCols;
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
        cellBrightness = new Float64Array(nextCols * rows);

        if (direction === "top-to-bottom") {
          headPositions = Array.from({ length: nextCols }, () => 0);
        } else {
          headPositions = Array.from({ length: rows }, () => 0);
        }
      };

      const updateCols = () => {
        const chW = measure.getBoundingClientRect().width;
        if (chW > 0) {
          cols = Math.floor(el.clientWidth / chW);
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

      const loop = () => {
        if (!visible || cancelled) return;

        const total = cols * rows;

        for (let i = 0; i < total; i++) {
          cellBrightness[i] *= 0.92;
        }

        if (direction === "top-to-bottom") {
          for (let col = 0; col < cols; col++) {
            const y = headPositions[col];
            if (y < rows) {
              const idx = y * cols + col;
              cellBrightness[idx] = 1;
            }
            headPositions[col]++;
            if (headPositions[col] > rows + Math.random() * 40) {
              headPositions[col] = 0;
            }
          }
        } else {
          for (let row = 0; row < rows; row++) {
            const x = headPositions[row];
            if (x < cols) {
              const idx = row * cols + x;
              cellBrightness[idx] = 1;
            }
            headPositions[row]++;
            if (headPositions[row] > cols + Math.random() * 40) {
              headPositions[row] = 0;
            }
          }
        }

        for (let idx = 0; idx < total && idx < grid.length; idx++) {
          const b = cellBrightness[idx];
          const s = grid[idx];

          if (b < 0.02) {
            if (prevChars[idx] !== " ") {
              s.textContent = " ";
              prevChars[idx] = " ";
            }
            if (prevColors[idx] !== "") {
              s.style.color = "";
              prevColors[idx] = "";
            }
            continue;
          }

          if (b > 0.9 || Math.random() < 0.03) {
            const ch = randomChar(mode);
            if (ch !== prevChars[idx]) {
              s.textContent = ch;
              prevChars[idx] = ch;
            }
          }

          const alpha = Math.round(b * 100) / 100;
          const colorKey = alpha.toFixed(2);
          if (colorKey !== prevColors[idx]) {
            s.style.color = themeTextColor;
            s.style.opacity = String(alpha);
            prevColors[idx] = colorKey;
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

  return (
    <div class={classNames(styles.container, props.class)} {...styleAttributes(props)}>
      <pre
        ref={(el) => (pre = el)}
        class={styles.root}
        style={{
          height: `calc(var(--font-size) * var(--theme-line-height-base) * ${props.rows})`,
        }}
      />
    </div>
  );
}
