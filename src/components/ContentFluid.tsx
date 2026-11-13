import type { JSX } from "@solidjs/web";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./ContentFluid.module.css";
import { classNames } from "../common/utilities.ts";

export interface ContentFluidProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function ContentFluid(props: ContentFluidProps) {
  return (
    <div class={classNames(styles.root, props.class)} {...styleAttributes(props)}>
      {props.children}
    </div>
  );
}
