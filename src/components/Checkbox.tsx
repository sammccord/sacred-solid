import type { JSX } from "@solidjs/web";
import { createSignal } from "solid-js";
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
  onChange?: JSX.ChangeEventHandler<HTMLInputElement, Event>;
  tabIndex?: number;
  children?: JSX.Element;
}

export function Checkbox(props: CheckboxProps) {
  const checkboxId = () => `${props.name}-checkbox`;
  const defaultChecked = props.defaultChecked ?? false;
  let inputRef = undefined as HTMLInputElement | undefined;

  const [isChecked, setIsChecked] = createSignal(defaultChecked);
  const [isFocused, setIsFocused] = createSignal(false);

  const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (event) => {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        inputRef?.click();
        break;
      case "ArrowUp":
      case "ArrowLeft": {
        event.preventDefault();
        findNextFocusable(document.activeElement, "previous")?.focus();
        break;
      }
      case "ArrowDown":
      case "ArrowRight": {
        event.preventDefault();
        findNextFocusable(document.activeElement, "next")?.focus();
        break;
      }
      default:
        break;
    }
  };

  const handleChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = (event) => {
    setIsChecked(event.currentTarget.checked);
    props.onChange?.(event);
  };

  return (
    <div
      class={classNames(
        styles.section,
        {
          [styles.checked]: isChecked(),
          [styles.focused]: isFocused(),
        },
        props.class,
      )}
      {...styleAttributes(props, props.style)}
    >
      <div class={styles.relative}>
        <input
          class={styles.input}
          id={checkboxId()}
          type="checkbox"
          name={props.name}
          checked={defaultChecked}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          tabindex={0}
          ref={inputRef}
        />
        <label class={styles.figure} for={checkboxId()}>
          {isChecked() ? "╳" : "\u00A0"}
        </label>
      </div>
      <div class={styles.right}>&nbsp;&nbsp;{props.children}</div>
    </div>
  );
}
