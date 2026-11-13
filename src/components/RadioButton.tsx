import type { JSX } from "@solidjs/web";
import { Radio, RadioIndicator } from "@ui-sdk/solid/radio";
import { createUniqueId } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames } from "../common/utilities.ts";
import styles from "./RadioButton.module.css";

export interface RadioButtonProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  style?: JSX.CSSProperties;
  value: string;
  children?: JSX.Element;
}

export function RadioButton(props: RadioButtonProps) {
  const labelId = createUniqueId();

  return (
    <div class={classNames(styles.section, props.class)} {...styleAttributes(props, props.style)}>
      <div class={styles.relative}>
        <Radio value={props.value} class={styles.figure} aria-labelledby={labelId}>
          <RadioIndicator class={styles.dot} aria-hidden="true" />
        </Radio>
      </div>
      <div id={labelId} class={styles.right}>
        &nbsp;&nbsp;{props.children}
      </div>
    </div>
  );
}
