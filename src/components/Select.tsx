import { createSelectController } from "@ui-sdk/core/select";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select";
import { createSignal, For } from "solid-js";
import { classNames } from "../common/utilities.ts";
import styles from "./Select.module.css";

export interface SelectProps {
  class?: string;
  name: string;
  label?: string;
  options: string[];
  placeholder?: string;
  defaultValue?: string;
  onChange?: (selectedValue: string) => void;
}

export function Select(props: SelectProps) {
  const controller = createSelectController<string>();
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <SelectRoot
      name={props.name}
      controller={controller}
      defaultValue={props.defaultValue || null}
      placeholder={props.placeholder}
      onOpenChange={setIsOpen}
      onValueChange={(value) => {
        if (value !== null) props.onChange?.(value);
      }}
    >
      <section class={classNames(styles.select, props.class)}>
        <figure
          class={classNames(isOpen() ? styles.focused : null, styles.control)}
          onClick={() => controller.toggle()}
        >
          ▼
        </figure>
        <SelectTrigger class={styles.display} aria-label={props.label ?? props.placeholder}>
          <SelectValue />
        </SelectTrigger>
      </section>
      <SelectContent class={styles.menu} side="bottom" align="end">
        <For each={props.options}>
          {(option) => (
            <SelectItem value={option} class={styles.item}>
              {option}
            </SelectItem>
          )}
        </For>
      </SelectContent>
    </SelectRoot>
  );
}
