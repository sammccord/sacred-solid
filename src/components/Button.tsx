import type { JSX } from "@solidjs/web";
import { Button as ButtonRoot } from "@ui-sdk/solid/button";
import { omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Button.module.css";
import { classNames } from "../common/utilities.ts";

export interface ButtonProps extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  variant?: "PRIMARY" | "SECONDARY";
  isDisabled?: boolean;
  style?: JSX.CSSProperties;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Button(props: ButtonProps) {
  const rest = omit(props, "class", "aug", "theme", "variant", "isDisabled", "style");

  return (
    <ButtonRoot
      class={classNames(
        styles.root,
        props.isDisabled
          ? styles.disabled
          : props.variant === "SECONDARY"
            ? styles.secondary
            : styles.primary,
        props.class,
      )}
      disabled={props.isDisabled}
      {...(rest as Record<string, unknown>)}
      {...styleAttributes(props, props.style)}
    />
  );
}
