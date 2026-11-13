import type { JSX } from "@solidjs/web";
import { createUniqueId } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { Block } from "./Block.tsx";
import { Button } from "./Button.tsx";
import styles from "./Dialog.module.css";
import { classNames } from "../common/utilities.ts";

export interface DialogProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  title?: JSX.Element;
  children?: JSX.Element;
  style?: JSX.CSSProperties;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function Dialog(props: DialogProps) {
  const titleId = createUniqueId();
  const descId = createUniqueId();

  return (
    <div
      class={classNames(styles.root, props.class)}
      {...styleAttributes(props, props.style)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <header class={styles.header}>{props.title}</header>
      <br />
      <article class={styles.message} id={descId}>
        {props.children}
      </article>
      <br />
      <div class={styles.actions}>
        <Button variant="SECONDARY" onClick={props.onConfirm}>
          OK
        </Button>
        <Block style={{ opacity: 0 }} />
        <Button variant="SECONDARY" onClick={props.onCancel}>
          Cancel
        </Button>
      </div>
      <br />
    </div>
  );
}
