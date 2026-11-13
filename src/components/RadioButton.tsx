import type { JSX } from "@solidjs/web";
import { createSignal, Show } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames, findNextFocusable } from "../common/utilities.ts";
import styles from "./RadioButton.module.css";

export interface RadioButtonProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  style?: JSX.CSSProperties;
  name: string;
  value: string;
  selected?: boolean;
  onSelect?: (value: string) => void;
  children?: JSX.Element;
}

export function RadioButton(props: RadioButtonProps) {
  const radioId = () => `${props.name}-${props.value}-radio`;
  const [isFocused, setIsFocused] = createSignal(false);

  const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (event) => {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        props.onSelect?.(props.value);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        findNextFocusable(document.activeElement, "previous")?.focus();
        break;
      case "Tab":
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        findNextFocusable(document.activeElement, "next")?.focus();
        break;
      default:
        break;
    }
  };

  return (
    <div
      class={classNames(
        styles.section,
        {
          [styles.focused]: isFocused(),
          [styles.selected]: props.selected ?? false,
        },
        props.class,
      )}
      {...styleAttributes(props, props.style)}
    >
      <input
        class={styles.input}
        id={radioId()}
        type="radio"
        name={props.name}
        value={props.value}
        checked={props.selected ?? false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        onChange={() => props.onSelect?.(props.value)}
      />
      <div class={styles.relative}>
        <label class={styles.figure} for={radioId()}>
          <Show when={props.selected}>
            <span aria-hidden="true" class={styles.dot} />
          </Show>
        </label>
      </div>
      <div class={styles.right}>&nbsp;&nbsp;{props.children}</div>
    </div>
  );
}
