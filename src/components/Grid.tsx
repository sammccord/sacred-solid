import { type JSX, splitProps } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Grid.module.css";
import { classNames } from "../common/utilities.ts";

export interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function Grid(props: GridProps) {
  const [local, rest] = splitProps(props, ["class", "aug", "theme", "children"]);

  return (
    <div
      class={classNames(styles.grid, local.class)}
      {...rest}
      {...styleAttributes(local, rest.style)}
    >
      {local.children}
    </div>
  );
}
