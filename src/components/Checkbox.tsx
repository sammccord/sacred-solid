import type { JSX } from "@solidjs/web";
import { Checkbox as CheckboxRoot } from "@ui-sdk/solid/checkbox";
import { createSignal, createUniqueId, untrack } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames, findNextFocusable } from "../common/utilities.ts";
import styles from "./Checkbox.module.css";

export interface CheckboxProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  style?: JSX.CSSProperties;
  checkboxStyle?: JSX.CSSProperties;
  name: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  children?: JSX.Element;
}

export function Checkbox(props: CheckboxProps) {
  const labelId = createUniqueId();
  const initial = untrack(() => props.defaultChecked ?? false);
  const [isChecked, setIsChecked] = createSignal(initial);
  const [isFocused, setIsFocused] = createSignal(false);

  const handleKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (event) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        findNextFocusable(document.activeElement, "previous")?.focus();
        break;
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        findNextFocusable(document.activeElement, "next")?.focus();
        break;
    }
  };

  return (
    <div
      class={classNames(
        styles.section,
        { [styles.checked]: isChecked(), [styles.focused]: isFocused() },
        props.class,
      )}
      {...styleAttributes(props, props.style)}
    >
      <div class={styles.relative}>
        <CheckboxRoot
          class={styles.figure}
          style={props.checkboxStyle}
          name={props.name}
          defaultChecked={initial}
          aria-labelledby={labelId}
          onCheckedChange={(checked) => {
            setIsChecked(checked === true);
            props.onChange?.(checked === true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {isChecked() ? "╳" : " "}
        </CheckboxRoot>
      </div>
      <div id={labelId} class={styles.right}>
        &nbsp;&nbsp;{props.children}
      </div>
    </div>
  );
}
