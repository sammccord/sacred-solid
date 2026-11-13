import { RadioGroup } from "@ui-sdk/solid/radio";
import { For } from "solid-js";
import { RadioButton } from "./RadioButton.tsx";
import styles from "./RadioButton.module.css";

export interface RadioButtonGroupProps {
  options: { value: string; label: string }[];
  defaultValue?: string;
  name?: string;
  label?: string;
  onChange?: (value: string) => void;
  class?: string;
}

export function RadioButtonGroup(props: RadioButtonGroupProps) {
  return (
    <RadioGroup
      class={styles.group}
      name={props.name ?? "example"}
      aria-label={props.label}
      defaultValue={props.defaultValue ?? null}
      onValueChange={(value) => {
        if (value !== null) props.onChange?.(value);
      }}
      loop
    >
      <For each={props.options}>
        {(option) => (
          <RadioButton class={props.class} value={option.value}>
            {option.label}
          </RadioButton>
        )}
      </For>
    </RadioGroup>
  );
}
