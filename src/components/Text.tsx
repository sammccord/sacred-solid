import { type JSX, splitProps } from "solid-js";
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
  const [local, rest] = splitProps(props, ["class", "aug", "theme", "children"]);

  return (
    <p
      class={classNames(styles.text, local.class)}
      {...rest}
      {...styleAttributes(local, rest.style)}
    >
      {local.children}
    </p>
  );
}
