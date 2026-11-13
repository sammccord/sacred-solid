import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Indent.module.css";
import { classNames } from "../common/utilities.ts";

export interface IndentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function Indent(props: IndentProps) {
  const rest = omit(props, "class", "aug", "theme", "children");

  return (
    <div
      class={classNames(styles.root, props.class)}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      {props.children}
    </div>
  );
}
