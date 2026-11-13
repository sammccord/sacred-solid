import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
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
  const rest = omit(props, "class", "aug", "theme", "children");

  return (
    <section
      class={classNames(styles.window, props.class)}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      {props.children}
    </section>
  );
}
