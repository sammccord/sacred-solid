import type { JSX } from "@solidjs/web";
import { Show } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Card.module.css";
import { classNames } from "../common/utilities.ts";
import { useModalTitleId } from "./page/ModalContext.tsx";

export interface CardProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "title" | "style"> {
  children?: JSX.Element;
  title?: JSX.Element;
  mode?: "left" | "right";
  style?: JSX.CSSProperties;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Card(props: CardProps) {
  const titleId = useModalTitleId();

  return (
    <article class={classNames(styles.card, props.class)} {...styleAttributes(props, props.style)}>
      <header class={styles.action}>
        <div
          class={props.mode === "left" ? styles.leftCorner : styles.left}
          aria-hidden="true"
        ></div>
        <Show when={props.mode || props.title}>
          <h2 id={titleId} class={styles.title}>
            {props.title}
          </h2>
        </Show>
        <div
          class={props.mode === "right" ? styles.rightCorner : styles.right}
          aria-hidden="true"
        ></div>
      </header>
      <section class={styles.children}>{props.children}</section>
    </article>
  );
}
