import {
  batch,
  createEffect,
  createSignal,
  type JSX,
  mergeProps,
  onCleanup,
  onMount,
  Show,
  splitProps,
  untrack,
} from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames, findNextFocusable } from "../common/utilities.ts";
import styles from "./TextArea.module.css";

export interface TextAreaProps extends Omit<
  JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  autoPlay?: string;
  autoPlaySpeedMS?: number;
  isBlink?: boolean;
  defaultValue?: string | number;
  aug?: AugProps;
  theme?: ThemeProps;
  onChange?: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent>;
}

export function TextArea(allProps: TextAreaProps) {
  const props = mergeProps({ autoPlaySpeedMS: 40 }, allProps);
  const [local, rest] = splitProps(props, [
    "class",
    "aug",
    "theme",
    "autoPlay",
    "autoPlaySpeedMS",
    "isBlink",
    "placeholder",
    "onChange",
    "value",
    "defaultValue",
  ]);

  let textAreaRef = undefined as HTMLTextAreaElement | undefined;
  let measurementRef = undefined as HTMLDivElement | undefined;
  let autoPlayInterval: ReturnType<typeof setInterval> | undefined;

  const [text, setText] = createSignal(
    local.defaultValue?.toString() || local.value?.toString() || "",
  );
  const [isFocused, setIsFocused] = createSignal(false);
  const [selectionStart, setSelectionStart] = createSignal(0);
  const [currentLineIndex, setCurrentLineIndex] = createSignal(0);
  const [totalLines, setTotalLines] = createSignal(0);

  const stopAutoPlay = () => {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
  };
  onCleanup(stopAutoPlay);

  createEffect(() => {
    const start = selectionStart();
    if (textAreaRef && isFocused()) {
      textAreaRef.setSelectionRange(start, start);
    }
  });

  createEffect(() => {
    if (local.value !== undefined) {
      const val = local.value.toString();
      setText(val);
      stopAutoPlay();
      setSelectionStart(val.length);
    }
  });

  createEffect(() => {
    const autoPlay = local.autoPlay;
    if (autoPlay && !local.value && !local.defaultValue) {
      let index = 0;
      setText("");
      stopAutoPlay();

      autoPlayInterval = setInterval(
        () => {
          index++;
          if (index > autoPlay.length) {
            stopAutoPlay();
            return;
          }
          const newText = autoPlay.slice(0, index);
          batch(() => {
            setText(newText);
            setSelectionStart(newText.length);
          });
        },
        untrack(() => local.autoPlaySpeedMS),
      );
    }

    onCleanup(stopAutoPlay);
  });

  const resizeTextArea = () => {
    if (!textAreaRef) return;
    textAreaRef.style.height = "auto";
    textAreaRef.style.height = `${textAreaRef.scrollHeight}px`;
  };

  onMount(() => {
    resizeTextArea();
    window.addEventListener("resize", resizeTextArea);
    onCleanup(() => window.removeEventListener("resize", resizeTextArea));

    const onSelectionChange = () => {
      if (document.activeElement === textAreaRef) syncSelection();
    };
    document.addEventListener("selectionchange", onSelectionChange);
    onCleanup(() => document.removeEventListener("selectionchange", onSelectionChange));
  });

  const syncSelection = () => {
    if (textAreaRef) setSelectionStart(textAreaRef.selectionStart);
  };

  const onHandleChange: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent> = (e) => {
    batch(() => {
      setText(e.currentTarget.value);
      stopAutoPlay();
      resizeTextArea();
      local.onChange?.(e);
      setSelectionStart(e.currentTarget.selectionStart);
    });
  };

  const onHandleFocus = () => {
    setIsFocused(true);
    syncSelection();
  };

  const onHandleBlur = () => {
    setIsFocused(false);
  };

  const onHandleClick: JSX.EventHandler<HTMLTextAreaElement, MouseEvent> = (e) => {
    e.currentTarget.focus();
    setSelectionStart(e.currentTarget.selectionStart);
  };

  createEffect(() => {
    if (!measurementRef) return;

    const measurementEl = measurementRef;
    const computedStyle = window.getComputedStyle(measurementEl);
    const lineHeightStr = computedStyle.lineHeight;
    let lineHeight = 20;
    if (lineHeightStr.endsWith("px")) {
      lineHeight = parseFloat(lineHeightStr);
    }

    const countLines = (content: string) => {
      measurementEl.textContent = content || "\u00A0";
      const height = measurementEl.offsetHeight;
      return Math.round(height / lineHeight);
    };

    const displayString = text() || local.placeholder || "";
    const textBeforeCaret = text().substring(0, selectionStart());

    const total = countLines(displayString);
    setTotalLines(total > 0 ? total - 1 : 0);

    const currentLines = countLines(textBeforeCaret);
    setCurrentLineIndex(currentLines > 0 ? currentLines - 1 : 0);
  });

  const onHandleKeyDown: JSX.EventHandler<HTMLTextAreaElement, KeyboardEvent> = (e) => {
    if (e.key === "ArrowUp" && currentLineIndex() === 0) {
      e.preventDefault();
      findNextFocusable(document.activeElement, "previous")?.focus();
    } else if (e.key === "ArrowDown" && currentLineIndex() === totalLines()) {
      e.preventDefault();
      findNextFocusable(document.activeElement, "next")?.focus();
    }
  };

  const isPlaceholderVisible = () => !text() && local.placeholder;

  return (
    <div
      class={classNames(styles.root, isFocused() && styles.focused, local.class)}
      {...styleAttributes(local)}
    >
      <div class={classNames(styles.displayed, isPlaceholderVisible() && styles.placeholder)}>
        {isPlaceholderVisible() ? local.placeholder : text().substring(0, selectionStart())}
        <Show when={!isPlaceholderVisible()}>
          <span class={classNames(styles.block, local.isBlink && styles.blink)}></span>
        </Show>
        <Show when={!isPlaceholderVisible()}>{text().substring(selectionStart())}</Show>
      </div>

      <div ref={measurementRef} class={styles.hidden}></div>

      <textarea
        class={styles.hiddenElement}
        ref={textAreaRef}
        value={text()}
        aria-placeholder={local.placeholder}
        onFocus={onHandleFocus}
        onBlur={onHandleBlur}
        onKeyDown={onHandleKeyDown}
        onInput={onHandleChange}
        onSelect={syncSelection}
        onKeyUp={syncSelection}
        onMouseUp={syncSelection}
        onClick={onHandleClick}
        {...rest}
      />
    </div>
  );
}
