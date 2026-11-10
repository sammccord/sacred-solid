import { type JSX, splitProps } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Badge.module.css";
import { classNames } from "../common/utilities.ts";

export interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function Badge(props: BadgeProps) {
  const [local, rest] = splitProps(props, ["class", "aug", "theme", "children"]);

  return (
    <span
      class={classNames(styles.root, local.class)}
      {...rest}
      {...styleAttributes(local, rest.style)}
    >
      {local.children}
    </span>
  );
}
