import type { JSX } from "@solidjs/web";
import { Button } from "@ui-sdk/solid/button";
import { Match, Switch, omit } from "solid-js";
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
  const content = () => (
    <>
      <figure class={styles.icon}>{props.icon}</figure>
      <span class={styles.text}>{props.children}</span>
    </>
  );

  //NOTE: A role means a ui-sdk part (a menu item) renders this element and owns its keys and tab stop.
  return (
    <Switch
      fallback={
        <Button
          class={classNames(styles.item, styles.button, props.class)}
          {...(rest as Record<string, unknown>)}
          {...styleAttributes(props, props.style)}
        >
          {content()}
        </Button>
      }
    >
      <Match when={props.href}>
        <a
          class={classNames(styles.item, props.class)}
          href={props.href}
          target={props.target}
          {...(rest as JSX.HTMLAttributes<HTMLAnchorElement>)}
          {...styleAttributes(props, props.style)}
        >
          {content()}
        </a>
      </Match>
      <Match when={props.role}>
        <div
          class={classNames(styles.item, props.class)}
          {...(rest as JSX.HTMLAttributes<HTMLDivElement>)}
          {...styleAttributes(props, props.style)}
        >
          {content()}
        </div>
      </Match>
    </Switch>
  );
}
