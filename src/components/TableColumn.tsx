import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./TableColumn.module.css";
import { classNames } from "../common/utilities.ts";

export interface TableColumnProps extends JSX.HTMLAttributes<HTMLTableCellElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function TableColumn(props: TableColumnProps) {
  const rest = omit(props, "class", "aug", "theme", "children");

  return (
    <td
      class={classNames(styles.root, props.class)}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      {props.children}
    </td>
  );
}
