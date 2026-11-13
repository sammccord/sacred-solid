import type { JSX } from "@solidjs/web";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./CardDouble.module.css";
import { classNames } from "../common/utilities.ts";
import { useModalTitleId } from "./page/ModalContext.tsx";

export interface CardDoubleProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "title" | "style"
> {
  children?: JSX.Element;
  title?: JSX.Element;
  mode?: "left" | "right";
  style?: JSX.CSSProperties;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function CardDouble(props: CardDoubleProps) {
  const titleId = useModalTitleId();

  return (
    <article class={classNames(styles.card, props.class)} {...styleAttributes(props)}>
      <header class={styles.action}>
        <div
          class={props.mode === "left" ? styles.leftCorner : styles.left}
          aria-hidden="true"
        ></div>
        <h2 id={titleId} class={styles.title}>
          {props.title}
        </h2>
        <div
          class={props.mode === "right" ? styles.rightCorner : styles.right}
          aria-hidden="true"
        ></div>
      </header>
      <section class={styles.children}>
        <section class={styles.borderChildren} style={props.style}>
          {props.children}
        </section>
      </section>
    </article>
  );
}
