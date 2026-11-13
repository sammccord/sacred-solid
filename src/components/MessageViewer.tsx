import type { JSX } from "@solidjs/web";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./MessageViewer.module.css";
import { classNames } from "../common/utilities.ts";

export interface MessageViewerProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function MessageViewer(props: MessageViewerProps) {
  return (
    <div class={classNames(styles.message, props.class)} {...styleAttributes(props)}>
      <div class={styles.left}>
        <div class={styles.bubble}>{props.children}</div>
      </div>
      <div class={styles.right}>
        <figure class={styles.triangle} />
      </div>
    </div>
  );
}
