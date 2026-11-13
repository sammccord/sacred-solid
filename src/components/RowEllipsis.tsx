import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./RowEllipsis.module.css";
import { classNames } from "../common/utilities.ts";

export interface RowEllipsisProps extends JSX.HTMLAttributes<HTMLElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function RowEllipsis(props: RowEllipsisProps) {
  const rest = omit(props, "class", "aug", "theme", "children");

  return (
    <section
      class={classNames(styles.row, props.class)}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      {props.children}
    </section>
  );
}
