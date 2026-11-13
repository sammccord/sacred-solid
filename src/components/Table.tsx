import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Table.module.css";
import { classNames, type SlotClasses } from "../common/utilities.ts";

export type TableSlot = "body";

export interface TableProps extends JSX.HTMLAttributes<HTMLTableElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  classes?: SlotClasses<TableSlot>;
  children?: JSX.Element;
}

export function Table(props: TableProps) {
  const rest = omit(props, "class", "classes", "aug", "theme", "children");

  return (
    <table
      class={classNames(styles.root, props.class)}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      <tbody class={classNames(styles.body, props.classes?.body)}>{props.children}</tbody>
    </table>
  );
}
