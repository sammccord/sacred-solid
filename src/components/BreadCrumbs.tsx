import { For, Show } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./BreadCrumbs.module.css";
import { classNames } from "../common/utilities.ts";

export interface BreadCrumbsItem {
  url?: string;
  name: string;
}

export interface BreadCrumbsProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  items: BreadCrumbsItem[];
}

export function BreadCrumbs(props: BreadCrumbsProps) {
  return (
    <nav
      aria-label="breadcrumb"
      class={classNames(styles.root, props.class)}
      {...styleAttributes(props)}
    >
      <For each={props.items}>
        {(item, index) => {
          const isLast = () => index() === props.items.length - 1;
          const linkElement = (
            <a class={styles.link} href={item.url} target="_blank">
              {item.name}
            </a>
          );

          return (
            <span class={styles.line}>
              {isLast() ? <span>{linkElement}</span> : linkElement}
              <Show when={!isLast()}>
                <span class={styles.symbol}> ❯ </span>
              </Show>
            </span>
          );
        }}
      </For>
    </nav>
  );
}
