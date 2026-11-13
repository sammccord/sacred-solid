import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Text.module.css";
import { classNames } from "../common/utilities.ts";

export interface TextProps extends JSX.HTMLAttributes<HTMLParagraphElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function Text(props: TextProps) {
  const rest = omit(props, "class", "aug", "theme", "children");

  return (
    <p
      class={classNames(styles.text, props.class)}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      {props.children}
    </p>
  );
}
