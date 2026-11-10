import { createEffect, mergeProps, onCleanup } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { classNames } from "../common/utilities.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./ASCIICanvas.module.css";

const DENSITY = "10";

function animate(x: number, y: number, t: number): { char: string; color: string } {
  const speed = t * 8;
  const wave1 = Math.sin(x * 0.15 + speed) * Math.cos(y * 0.1 + speed * 0.7);
  const wave2 = Math.sin((x + y) * 0.08 + speed * 1.3);
  const v = wave1 + wave2;
  const digit = DENSITY[Math.floor(x * 0.5 + y * 0.3 + speed * 2) % DENSITY.length];
  const brightness = Math.floor(((Math.sin(v * 2) + 1) / 2) * 180 + 50);
  const hex = brightness.toString(16).padStart(2, "0");
  return { char: digit, color: `#${hex}${hex}${hex}` };
}

export interface ASCIICanvasProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  rows?: number;
}

export function ASCIICanvas(propsIn: ASCIICanvasProps) {
  const props = mergeProps({ rows: 10 }, propsIn);
  let pre: HTMLPreElement | undefined;
  let frame = 0;
  let cols = 40;
  let visible = false;
  let grid: HTMLSpanElement[] = [];
  let previousCols = 0;
  let previousChars: string[] = [];
  let previousColors: string[] = [];

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

    const buildGrid = (nextCols: number) => {
      if (nextCols === previousCols) return;
      previousCols = nextCols;
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
      previousChars = Array.from({ length: nextCols * rows }, () => "");
      previousColors = Array.from({ length: nextCols * rows }, () => "");
    };

    const updateCols = () => {
      const charWidth = measure.getBoundingClientRect().width;
      if (charWidth > 0) {
        cols = Math.floor(el.clientWidth / charWidth);
        buildGrid(cols);
      }
    };
    updateCols();

    const resizeObs = new ResizeObserver(updateCols);
    resizeObs.observe(el);

    //NOTE(jimmylee): Font changes toggle a class on <body> (e.g. font-use-web-plus-ibm-bios),
    //NOTE(jimmylee): which changes --font-family-mono. Other components reflow via CSS but
    //NOTE(jimmylee): ASCIICanvas must rebuild its span grid because column count depends on
    //NOTE(jimmylee): character width.
    const fontObs = new MutationObserver(() => {
      previousCols = 0;
      updateCols();
    });
    fontObs.observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });

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

      const time = performance.now() * 0.0001;
      const total = cols * rows;

      for (let index = 0; index < total && index < grid.length; index++) {
        const column = index % cols;
        const row = (index - column) / cols;
        const cell = animate(column, row, time);
        const span = grid[index];
        if (cell.char !== previousChars[index]) {
          span.textContent = cell.char;
          previousChars[index] = cell.char;
        }
        if (cell.color !== previousColors[index]) {
          span.style.color = cell.color;
          previousColors[index] = cell.color;
        }
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    onCleanup(() => {
      cancelled = true;
      cancelAnimationFrame(frame);
      resizeObs.disconnect();
      fontObs.disconnect();
      interObs.disconnect();
      if (measure.parentNode) measure.parentNode.removeChild(measure);
    });
  });

  return (
    <pre
      ref={(el) => (pre = el)}
      class={classNames(styles.root, props.class)}
      {...styleAttributes(props, {
        height: `calc(var(--font-size) * var(--theme-line-height-base) * ${props.rows})`,
      })}
    />
  );
}
