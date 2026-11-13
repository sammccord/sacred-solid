import type { JSX } from "@solidjs/web";
import { Show, omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames } from "../common/utilities.ts";
import styles from "./Button.module.css";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "PRIMARY" | "SECONDARY";
  isDisabled?: boolean;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Button(props: ButtonProps) {
  const rest = omit(props, "class", "aug", "theme", "variant", "isDisabled", "children");
  const className = () =>
    classNames(
      styles.root,
      props.isDisabled
        ? styles.disabled
        : props.variant === "SECONDARY"
          ? styles.secondary
          : styles.primary,
      props.class,
    );

  return (
    <Show
      when={!props.isDisabled}
      fallback={
        <div class={className()} {...styleAttributes(props)}>
          {props.children}
        </div>
      }
    >
      <button
        class={className()}
        role="button"
        tabindex={0}
        {...rest}
        {...styleAttributes(props, rest.style)}
      >
        {props.children}
      </button>
    </Show>
  );
}
