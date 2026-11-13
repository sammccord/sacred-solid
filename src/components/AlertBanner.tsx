import type { JSX } from "@solidjs/web";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./AlertBanner.module.css";
import { classNames } from "../common/utilities.ts";

export interface AlertBannerProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
}

export function AlertBanner(props: AlertBannerProps) {
  return (
    <div class={classNames(styles.root, props.class)} {...styleAttributes(props, props.style)}>
      {props.children}
    </div>
  );
}
