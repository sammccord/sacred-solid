import type { JSX } from "@solidjs/web";
import { Button } from "@ui-sdk/solid/button";
import { Show, omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames, isEmpty } from "../common/utilities.ts";
import styles from "./ActionButton.module.css";

export interface ActionButtonProps extends Omit<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>,
  "style" | "onClick" | "ref"
> {
  onClick?: () => void;
  hotkey?: string | number;
  children?: JSX.Element;
  style?: JSX.CSSProperties;
  rootStyle?: JSX.CSSProperties;
  isSelected?: boolean;
  aug?: AugProps;
  theme?: ThemeProps;
  ref?: HTMLButtonElement | ((el: HTMLButtonElement) => void);
}

export function ActionButton(props: ActionButtonProps) {
  const rest = omit(
    props,
    "class",
    "onClick",
    "hotkey",
    "children",
    "style",
    "rootStyle",
    "isSelected",
    "aug",
    "theme",
  );

  return (
    <Button
      class={classNames(styles.root, props.isSelected ? styles.selected : null, props.class)}
      onClick={() => props.onClick?.()}
      {...(rest as Record<string, unknown>)}
      {...styleAttributes(props, props.rootStyle)}
    >
      <Show when={!isEmpty(props.hotkey)}>
        <span class={styles.hotkey}>{props.hotkey}</span>
      </Show>
      <span class={styles.content} style={props.style}>
        {props.children}
      </span>
    </Button>
  );
}
