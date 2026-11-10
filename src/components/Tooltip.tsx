import { type JSX, splitProps } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Tooltip.module.css";
import { classNames } from "../common/utilities.ts";

export interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Tooltip(props: TooltipProps) {
  const [local, rest] = splitProps(props, ["class", "aug", "theme", "style"]);

  return (
    <div
      class={classNames(styles.root, local.class)}
      {...rest}
      {...styleAttributes(local, local.style)}
    />
  );
}
