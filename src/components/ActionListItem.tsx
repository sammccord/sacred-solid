import { type JSX, Show } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./ActionListItem.module.css";
import { classNames } from "../common/utilities.ts";

export interface ActionListItemProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  style?: JSX.CSSProperties;
  icon?: JSX.Element;
  children?: JSX.Element;
  href?: string;
  target?: string;
  onClick?: JSX.EventHandler<HTMLDivElement, MouseEvent>;
  role?: JSX.HTMLAttributes<HTMLDivElement>["role"];
}

export function ActionListItem(props: ActionListItemProps) {
  const resolvedRole = () => props.role || (props.href ? "link" : "button");

  //NOTE(jimmylee): When role="menuitem", the parent menu container handles keyboard activation.
  const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (e.key === " ") e.preventDefault();
      e.currentTarget.click();
    }
  };

  return (
    <Show
      when={props.href}
      fallback={
        <div
          class={classNames(styles.item, props.class)}
          onClick={props.onClick}
          onKeyDown={props.role === "menuitem" ? undefined : handleKeyDown}
          {...styleAttributes(props, props.style)}
          tabIndex={0}
          role={resolvedRole()}
        >
          <figure class={styles.icon}>{props.icon}</figure>
          <span class={styles.text}>{props.children}</span>
        </div>
      }
    >
      <a
        class={classNames(styles.item, props.class)}
        href={props.href}
        target={props.target}
        {...styleAttributes(props, props.style)}
        tabIndex={0}
        role={resolvedRole()}
      >
        <figure class={styles.icon}>{props.icon}</figure>
        <span class={styles.text}>{props.children}</span>
      </a>
    </Show>
  );
}
