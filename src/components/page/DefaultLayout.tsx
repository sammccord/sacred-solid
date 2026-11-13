import type { JSX } from "@solidjs/web";
import type { AugProps } from "../../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../../style/index.ts";
import styles from "./DefaultLayout.module.css";
import { classNames } from "../../common/utilities.ts";

export interface DefaultLayoutProps {
  class?: string;
  previewPixelSRC: string;
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function DefaultLayout(props: DefaultLayoutProps) {
  return (
    <div class={classNames(styles.body, props.class)} {...styleAttributes(props)}>
      <img class={styles.pixel} src={props.previewPixelSRC} alt="" />
      {props.children}
    </div>
  );
}
