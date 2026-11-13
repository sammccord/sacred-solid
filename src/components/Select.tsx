import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, For, Show } from "solid-js";
import { classNames, mergeDefaults } from "../common/utilities.ts";
import styles from "./Select.module.css";

export interface SelectProps {
  class?: string;
  name: string;
  options: string[];
  placeholder?: string;
  defaultValue?: string;
  onChange?: (selectedValue: string) => void;
}

export function Select(allProps: SelectProps) {
  const props = mergeDefaults({ defaultValue: "" }, allProps);
  const [isOpen, setIsOpen] = createSignal(false);
  const [index, setIndex] = createSignal(-1);
  const [selectedValue, setSelectedValue] = createSignal(props.defaultValue);

  let containerRef = undefined as HTMLButtonElement | undefined;
  let listRef = undefined as HTMLUListElement | undefined;

  const optionAt = (position: number) =>
    listRef?.querySelectorAll<HTMLLIElement>('[role="option"]')[position];

  const focusOption = (nextIndex: number) => {
    setIndex(nextIndex);
    optionAt(nextIndex)?.focus();
  };

  const handleOpen = () => {
    setIsOpen(true);
    const currentIndex = props.options.indexOf(selectedValue());
    setIndex(currentIndex >= 0 ? currentIndex : 0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIndex(-1);
    containerRef?.focus();
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    props.onChange?.(value);
    handleClose();
  };

  const toggle = () => (isOpen() ? handleClose() : handleOpen());

  createEffect(isOpen, (open) => {
    if (open && index() >= 0) {
      optionAt(index())?.focus();
    }
  });

  //NOTE(jimmylee): Enter and Space rely on the button's native click activation via onClick.
  const handleButtonKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (event) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        if (!isOpen()) {
          handleOpen();
        } else {
          focusOption(Math.min(index() + 1, props.options.length - 1));
        }
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (!isOpen()) {
          handleOpen();
        } else {
          focusOption(Math.max(index() - 1, 0));
        }
        break;
      }
      case "Escape": {
        if (isOpen()) {
          event.preventDefault();
          handleClose();
        }
        break;
      }
    }
  };

  const handleOptionKeyDown = (event: KeyboardEvent, option: string, idx: number) => {
    switch (event.key) {
      case "Enter":
      case " ": {
        event.preventDefault();
        handleSelect(option);
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        focusOption(Math.min(idx + 1, props.options.length - 1));
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        focusOption(Math.max(idx - 1, 0));
        break;
      }
      case "Escape": {
        event.preventDefault();
        handleClose();
        break;
      }
    }
  };

  return (
    <>
      <section class={classNames(styles.select, props.class)}>
        <figure
          class={classNames(isOpen() ? styles.focused : null, styles.control)}
          onClick={toggle}
        >
          ▼
        </figure>
        <button
          class={styles.display}
          ref={containerRef}
          tabindex={0}
          onClick={toggle}
          onKeyDown={handleButtonKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen() ? "true" : "false"}
        >
          {selectedValue() || props.placeholder}
        </button>
      </section>

      <Show when={isOpen()}>
        <ul class={styles.menu} role="listbox" ref={listRef}>
          <For each={props.options}>
            {(option, idx) => (
              <li
                role="option"
                tabindex={0}
                class={classNames(styles.item)}
                aria-selected={idx() === index() ? "true" : "false"}
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option, idx())}
              >
                {option}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  );
}
