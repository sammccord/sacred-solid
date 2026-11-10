import {
  batch,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  onCleanup,
  onMount,
  Show,
  splitProps,
} from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames, findNextFocusable } from "../common/utilities.ts";
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
  const props = mergeProps({ isBlink: true }, allProps);
  const [local, rest] = splitProps(props, [
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
  ]);

  const generatedId = createUniqueId();
  const inputId = () => local.id || generatedId;

  let inputRef = undefined as HTMLInputElement | undefined;
  let lastFocusDirection: "up" | "down" | null = null;

  const [text, setText] = createSignal(
    local.defaultValue?.toString() || local.value?.toString() || "",
  );
  const [isFocused, setIsFocused] = createSignal(false);
  const [selectionStart, setSelectionStart] = createSignal(text().length);

  createEffect(() => {
    if (local.value !== undefined) {
      const val = local.value.toString();
      setText(val);
      setSelectionStart(val.length);
    }
  });

  const syncSelection = () => {
    if (!inputRef) return;
    setSelectionStart(inputRef.selectionStart ?? text().length);
  };

  onMount(() => {
    const onSelectionChange = () => {
      if (document.activeElement === inputRef) syncSelection();
    };
    document.addEventListener("selectionchange", onSelectionChange);
    onCleanup(() => document.removeEventListener("selectionchange", onSelectionChange));
  });

  const onHandleChange: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
    batch(() => {
      const value = e.currentTarget.value;
      setText(value);
      local.onChange?.(e);
      setSelectionStart(e.currentTarget.selectionStart ?? value.length);
    });
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

  const isPlaceholderVisible = () => !text() && local.placeholder;
  const containerClasses = () =>
    classNames(styles.root, isFocused() && styles.focused, local.class);

  const maskText = (t: string) => (local.type === "password" ? "•".repeat(t.length) : t);

  const beforeCaretText = createMemo(() =>
    isPlaceholderVisible()
      ? (local.placeholder ?? "")
      : maskText(text().substring(0, selectionStart())),
  );
  const afterCaretText = createMemo(() =>
    isPlaceholderVisible() ? "" : maskText(text().substring(selectionStart())),
  );

  return (
    <div class={containerClasses()} {...styleAttributes(local)}>
      <Show when={local.label}>
        <label for={inputId()} class={styles.label}>
          {local.label}
        </label>
      </Show>
      <div class={styles.inputContainer}>
        <div class={classNames(styles.displayed, isPlaceholderVisible() && styles.placeholder)}>
          {beforeCaretText()}
          <Show when={!isPlaceholderVisible()}>
            <span class={classNames(styles.block, local.isBlink && styles.blink)}>
              {local.caretChars || ""}
            </span>
          </Show>
          <Show when={!isPlaceholderVisible()}>{afterCaretText()}</Show>
        </div>
        <input
          id={inputId()}
          ref={inputRef}
          class={styles.hidden}
          value={text()}
          aria-placeholder={local.placeholder}
          type={local.type}
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
