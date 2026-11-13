import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Tooltip.module.css";
import { classNames } from "../common/utilities.ts";

export interface TooltipProps extends JSX.HTMLAttributes<HTMLDivElement> {
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Tooltip(props: TooltipProps) {
  const rest = omit(props, "class", "aug", "theme", "style");

  return (
    <div
      class={classNames(styles.root, props.class)}
      {...rest}
      {...styleAttributes(props, props.style)}
    />
  );
}
