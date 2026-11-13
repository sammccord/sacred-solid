import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Block.module.css";
import { classNames } from "../common/utilities.ts";

export interface BlockProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function Block(props: BlockProps) {
  const rest = omit(props, "class", "aug", "theme", "children");

  return (
    <span
      class={classNames(styles.block, props.class)}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      {props.children}
    </span>
  );
}
