import { type JSX, Show, splitProps } from "solid-js";
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
  const [local, rest] = splitProps(props, [
    "class",
    "aug",
    "theme",
    "variant",
    "isDisabled",
    "children",
  ]);
  const className = () =>
    classNames(
      styles.root,
      local.isDisabled
        ? styles.disabled
        : local.variant === "SECONDARY"
          ? styles.secondary
          : styles.primary,
      local.class,
    );

  return (
    <Show
      when={!local.isDisabled}
      fallback={
        <div class={className()} {...styleAttributes(local)}>
          {local.children}
        </div>
      }
    >
      <button
        class={className()}
        role="button"
        tabIndex={0}
        {...rest}
        {...styleAttributes(local, rest.style)}
      >
        {local.children}
      </button>
    </Show>
  );
}
