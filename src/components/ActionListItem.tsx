import type { JSX } from "@solidjs/web";
import { Show, omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./ActionListItem.module.css";
import { classNames } from "../common/utilities.ts";

export interface ActionListItemProps extends Omit<
  JSX.HTMLAttributes<HTMLElement>,
  "style" | "children"
> {
  aug?: AugProps;
  theme?: ThemeProps;
  style?: JSX.CSSProperties;
  icon?: JSX.Element;
  children?: JSX.Element;
  href?: string;
  target?: string;
}

export function ActionListItem(props: ActionListItemProps) {
  const rest = omit(props, "class", "aug", "theme", "style", "icon", "children", "href", "target");
  const resolvedRole = () => props.role || (props.href ? "link" : "button");

  const handleKeyDown: JSX.EventHandler<HTMLElement, KeyboardEvent> = (e) => {
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
          onKeyDown={props.role === "menuitem" ? undefined : handleKeyDown}
          tabindex={0}
          {...(rest as JSX.HTMLAttributes<HTMLDivElement>)}
          role={resolvedRole()}
          {...styleAttributes(props, props.style)}
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
        tabindex={0}
        {...(rest as JSX.HTMLAttributes<HTMLAnchorElement>)}
        role={resolvedRole()}
        {...styleAttributes(props, props.style)}
      >
        <figure class={styles.icon}>{props.icon}</figure>
        <span class={styles.text}>{props.children}</span>
      </a>
    </Show>
  );
}
