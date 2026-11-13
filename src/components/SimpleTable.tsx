import { For, Show } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames } from "../common/utilities.ts";
import styles from "./SimpleTable.module.css";

export interface SimpleTableProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  data: string[][];
  align?: ("left" | "right")[];
}

const STATUS_OK = new Set(["ACTIVE", "OPEN", "APPROVED"]);
const STATUS_OFF = new Set(["CLOSED", "PAID", "SUSPENDED"]);

function statusClass(cell: string): string | undefined {
  if (STATUS_OK.has(cell)) return styles.statusOk;
  if (STATUS_OFF.has(cell)) return styles.statusOff;
  return undefined;
}

export function SimpleTable(props: SimpleTableProps) {
  const header = () => props.data[0] ?? [];
  const rows = () => props.data.slice(1);
  const alignAt = (col: number) => (props.align?.[col] === "right" ? styles.alignRight : undefined);

  return (
    <Show when={props.data.length > 0}>
      <div class={classNames(styles.scrollWrapper, props.class)} {...styleAttributes(props)}>
        <table class={styles.root}>
          <thead>
            <tr>
              <For keyed={false} each={header()}>
                {(cell, i) => <td class={alignAt(i)}>{cell()}</td>}
              </For>
            </tr>
          </thead>
          <tbody>
            <For keyed={false} each={rows()}>
              {(row) => (
                <tr tabindex={0}>
                  <For keyed={false} each={row()}>
                    {(cell, ci) => (
                      <td class={classNames(alignAt(ci), statusClass(cell())) || undefined}>
                        {cell()}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </Show>
  );
}
