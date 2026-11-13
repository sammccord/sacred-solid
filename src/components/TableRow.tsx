import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./TableRow.module.css";
import { classNames } from "../common/utilities.ts";

export interface TableRowProps extends JSX.HTMLAttributes<HTMLTableRowElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function TableRow(props: TableRowProps) {
  const rest = omit(props, "class", "aug", "theme", "children");

  return (
    <tr
      class={classNames(styles.root, props.class)}
      tabindex={0}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      {props.children}
    </tr>
  );
}
