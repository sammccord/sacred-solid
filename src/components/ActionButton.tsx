import { type JSX, Show } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames, isEmpty } from "../common/utilities.ts";
import styles from "./ActionButton.module.css";

export interface ActionButtonProps {
  class?: string;
  onClick?: () => void;
  hotkey?: string | number;
  children?: JSX.Element;
  style?: JSX.CSSProperties;
  rootStyle?: JSX.CSSProperties;
  isSelected?: boolean;
  aug?: AugProps;
  theme?: ThemeProps;
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
}

export function ActionButton(props: ActionButtonProps) {
  return (
    <div
      class={classNames(styles.root, props.isSelected ? styles.selected : null, props.class)}
      {...styleAttributes(props, props.rootStyle)}
      onClick={props.onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (e.key === " ") e.preventDefault();
          props.onClick?.();
        }
      }}
      tabIndex={0}
      ref={props.ref}
      role="button"
    >
      <Show when={!isEmpty(props.hotkey)}>
        <span class={styles.hotkey}>{props.hotkey}</span>
      </Show>
      <span class={styles.content} style={props.style}>
        {props.children}
      </span>
    </div>
  );
}
