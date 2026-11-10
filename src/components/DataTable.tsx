import { createEffect, Index, type JSX } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./DataTable.module.css";
import { classNames } from "../common/utilities.ts";

export interface DataTableProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  data: string[][];
}

interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

const BASE_FOREGROUND_RGBA: RGBAColor = { r: 98, g: 98, b: 98, a: 0.5 };
const BASE_BACKGROUND_RGBA: RGBAColor = { r: 168, g: 168, b: 168, a: 0.5 };
const ALPHA = 0.45;

const TARGET_COLOR_HEADER: RGBAColor = { r: 255, g: 255, b: 255, a: ALPHA };
const TARGET_COLOR_DATA: RGBAColor = { r: 255, g: 255, b: 255, a: ALPHA };

function interpolateColor(color1: RGBAColor, color2: RGBAColor, factor: number): RGBAColor {
  return {
    r: Math.round(color1.r + factor * (color2.r - color1.r)),
    g: Math.round(color1.g + factor * (color2.g - color1.g)),
    b: Math.round(color1.b + factor * (color2.b - color1.b)),
    a: color1.a + factor * (color2.a - color1.a),
  };
}

function toCss(color: RGBAColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a.toFixed(2)})`;
}

export function DataTable(props: DataTableProps) {
  let tableRef = undefined as HTMLTableElement | undefined;
  let prevData = props.data;

  createEffect(() => {
    const data = props.data;
    const rows = tableRef?.querySelectorAll<HTMLTableRowElement>("tr") ?? [];
    for (let i = 1; i < data.length; i++) {
      const cells = rows[i]?.querySelectorAll<HTMLTableCellElement>("td");
      if (!cells) continue;
      const row = data[i] ?? [];
      for (let j = 0; j < row.length; j++) {
        const cell = cells[j];
        const changed = prevData[i]?.[j] !== row[j];
        if (cell && changed) {
          cell.classList.remove(styles.changed);
          void cell.offsetWidth;
          cell.classList.add(styles.changed);
        }
      }
    }
    prevData = data;
  });

  const handleKeyDown: JSX.EventHandler<HTMLTableElement, KeyboardEvent> = (event) => {
    const activeElement = document.activeElement;
    if (!activeElement) return;
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        if (activeElement instanceof HTMLTableCellElement) {
          activeElement.click();
        }
        break;
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight": {
        event.preventDefault();
        if (!(activeElement instanceof HTMLTableCellElement)) return;
        const direction =
          event.key === "ArrowUp" || event.key === "ArrowLeft" ? "previous" : "next";
        const allCells = Array.from(tableRef?.querySelectorAll<HTMLTableCellElement>("td") ?? []);
        const currentIndex = allCells.indexOf(activeElement);
        if (currentIndex === -1) return;
        let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
        if (direction === "previous") {
          if (nextIndex < 0) nextIndex = allCells.length - 1;
        } else {
          if (nextIndex >= allCells.length) nextIndex = 0;
        }
        allCells[nextIndex]?.focus();
        break;
      }
    }
  };

  const backgroundColor = (rowIndex: number, colIndex: number, rowLength: number): string => {
    if (rowIndex === 0) {
      const lightnessFactor = rowLength > 1 ? colIndex / (rowLength - 1) : 0;
      return toCss(interpolateColor(BASE_FOREGROUND_RGBA, TARGET_COLOR_HEADER, lightnessFactor));
    }
    const numRows = props.data.length - 1;
    const maxIndexSum = numRows - 1 + (rowLength - 1) || 1;
    const indexSum = rowIndex - 1 + colIndex;
    const lightnessFactor = indexSum / maxIndexSum;
    return toCss(interpolateColor(BASE_BACKGROUND_RGBA, TARGET_COLOR_DATA, lightnessFactor));
  };

  return (
    <table
      class={classNames(styles.root, props.class)}
      ref={tableRef}
      onKeyDown={handleKeyDown}
      {...styleAttributes(props)}
    >
      <tbody class={styles.body}>
        <Index each={props.data}>
          {(row, rowIndex) => (
            <tr class={styles.row} tabIndex={0} onClick={() => alert("testing")}>
              <Index each={row()}>
                {(cellContent, colIndex) => (
                  <td
                    class={styles.column}
                    style={{
                      "background-color": backgroundColor(rowIndex, colIndex, row().length),
                    }}
                  >
                    {cellContent()}
                  </td>
                )}
              </Index>
            </tr>
          )}
        </Index>
      </tbody>
    </table>
  );
}
