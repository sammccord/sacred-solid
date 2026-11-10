import { type JSX, splitProps } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./RowSpaceBetween.module.css";
import { classNames } from "../common/utilities.ts";

export interface RowSpaceBetweenProps extends JSX.HTMLAttributes<HTMLElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function RowSpaceBetween(props: RowSpaceBetweenProps) {
  const [local, rest] = splitProps(props, ["class", "aug", "theme", "children"]);

  return (
    <section
      class={classNames(styles.row, local.class)}
      {...rest}
      {...styleAttributes(local, rest.style)}
    >
      {local.children}
    </section>
  );
}
