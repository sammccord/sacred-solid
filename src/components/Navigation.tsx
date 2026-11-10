import { type JSX, Show } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Navigation.module.css";
import { classNames } from "../common/utilities.ts";

export interface NavigationProps extends JSX.HTMLAttributes<HTMLElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
  logoHref?: string;
  logoTarget?: "_self" | "_blank" | "_parent" | "_top" | (string & {});
  onClickLogo?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  logo?: JSX.Element | false;
  left?: JSX.Element;
  right?: JSX.Element;
}

export function Navigation(props: NavigationProps) {
  return (
    <nav class={classNames(styles.root, props.class)} {...styleAttributes(props)}>
      <Show when={props.logo !== false}>
        <Show
          when={props.logoHref}
          fallback={
            <button class={styles.logo} onClick={props.onClickLogo}>
              {props.logo}
            </button>
          }
        >
          {(href) => (
            <a href={href()} class={styles.logo} target={props.logoTarget}>
              {props.logo}
            </a>
          )}
        </Show>
      </Show>
      <section class={styles.left}>{props.left}</section>
      <section class={styles.children}>{props.children}</section>
      <section class={styles.right}>{props.right}</section>
    </nav>
  );
}
