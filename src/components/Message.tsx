import type { JSX } from "@solidjs/web";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Message.module.css";
import { classNames } from "../common/utilities.ts";

export interface MessageProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function Message(props: MessageProps) {
  return (
    <div class={classNames(styles.message, props.class)} {...styleAttributes(props)}>
      <div class={styles.left}>
        <figure class={styles.triangle} />
      </div>
      <div class={styles.right}>
        <div class={styles.bubble}>{props.children}</div>
      </div>
    </div>
  );
}
