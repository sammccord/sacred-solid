import { type JSX, splitProps } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Window.module.css";
import { classNames } from "../common/utilities.ts";

export interface WindowProps extends JSX.HTMLAttributes<HTMLElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function Window(props: WindowProps) {
  const [local, rest] = splitProps(props, ["class", "aug", "theme", "children"]);

  return (
    <section
      class={classNames(styles.window, local.class)}
      role="dialog"
      {...rest}
      {...styleAttributes(local, rest.style)}
    >
      {local.children}
    </section>
  );
}
