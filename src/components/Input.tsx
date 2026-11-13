import type { JSX } from "@solidjs/web";
import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  onSettled,
  Show,
  omit,
  untrack,
} from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames, findNextFocusable, mergeDefaults } from "../common/utilities.ts";
import styles from "./Input.module.css";

export interface InputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  caretChars?: JSX.Element;
  label?: JSX.Element;
  isBlink?: boolean;
  defaultValue?: string | number;
  aug?: AugProps;
  theme?: ThemeProps;
  onChange?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
}

export function Input(allProps: InputProps) {
  const props = mergeDefaults({ isBlink: true }, allProps);
  const rest = omit(
    props,
    "class",
    "aug",
    "theme",
    "caretChars",
    "isBlink",
    "label",
    "placeholder",
    "onChange",
    "type",
    "id",
    "value",
    "defaultValue",
  );

  const generatedId = createUniqueId();
  const inputId = () => props.id || generatedId;

  let inputRef = undefined as HTMLInputElement | undefined;
  let lastFocusDirection: "up" | "down" | null = null;

  const initialText = untrack(
    () => props.defaultValue?.toString() || props.value?.toString() || "",
  );
  const [text, setText] = createSignal(initialText);
  const [isFocused, setIsFocused] = createSignal(false);
  const [selectionStart, setSelectionStart] = createSignal(initialText.length);

  createEffect(
    () => props.value,
    (value) => {
      if (value !== undefined) {
        const val = value.toString();
        setText(val);
        setSelectionStart(val.length);
      }
    },
  );

  const syncSelection = () => {
    if (!inputRef) return;
    setSelectionStart(inputRef.selectionStart ?? text().length);
  };

  onSettled(() => {
    const onSelectionChange = () => {
      if (document.activeElement === inputRef) syncSelection();
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  });

  const onHandleChange: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
    const value = e.currentTarget.value;
    setText(value);
    props.onChange?.(e);
    setSelectionStart(e.currentTarget.selectionStart ?? value.length);
  };

  const onHandleFocus = () => {
    setIsFocused(true);
    if (!inputRef) return;

    if (lastFocusDirection === "down") {
      setSelectionStart(text().length);
      inputRef.setSelectionRange(text().length, text().length);
    } else if (lastFocusDirection === "up") {
      setSelectionStart(0);
      inputRef.setSelectionRange(0, 0);
    }
  };

  const onHandleBlur = () => {
    setIsFocused(false);
  };

  const onHandleClick: JSX.EventHandler<HTMLInputElement, MouseEvent> = (e) => {
    e.currentTarget.focus();
    setSelectionStart(e.currentTarget.selectionStart ?? text().length);
  };

  const onHandleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      lastFocusDirection = "up";
      findNextFocusable(document.activeElement, "previous")?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      lastFocusDirection = "down";
      findNextFocusable(document.activeElement, "next")?.focus();
    }
  };

  const isPlaceholderVisible = () => !text() && props.placeholder;
  const containerClasses = () =>
    classNames(styles.root, isFocused() && styles.focused, props.class);

  const maskText = (t: string) => (props.type === "password" ? "•".repeat(t.length) : t);

  const beforeCaretText = createMemo(() =>
    isPlaceholderVisible()
      ? (props.placeholder ?? "")
      : maskText(text().substring(0, selectionStart())),
  );
  const afterCaretText = createMemo(() =>
    isPlaceholderVisible() ? "" : maskText(text().substring(selectionStart())),
  );

  return (
    <div class={containerClasses()} {...styleAttributes(props)}>
      <Show when={props.label}>
        <label for={inputId()} class={styles.label}>
          {props.label}
        </label>
      </Show>
      <div class={styles.inputContainer}>
        <div class={classNames(styles.displayed, isPlaceholderVisible() && styles.placeholder)}>
          {beforeCaretText()}
          <Show when={!isPlaceholderVisible()}>
            <span class={classNames(styles.block, props.isBlink && styles.blink)}>
              {props.caretChars || ""}
            </span>
          </Show>
          <Show when={!isPlaceholderVisible()}>{afterCaretText()}</Show>
        </div>
        <input
          id={inputId()}
          ref={inputRef}
          class={styles.hidden}
          value={text()}
          aria-placeholder={props.placeholder}
          type={props.type}
          onFocus={onHandleFocus}
          onBlur={onHandleBlur}
          onInput={onHandleChange}
          onSelect={syncSelection}
          onKeyUp={syncSelection}
          onMouseUp={syncSelection}
          onClick={onHandleClick}
          onKeyDown={onHandleKeyDown}
          {...rest}
        />
      </div>
    </div>
  );
}
