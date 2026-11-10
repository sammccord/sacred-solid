import { createSignal, For } from "solid-js";
import { RadioButton } from "./RadioButton.tsx";

export interface RadioButtonGroupProps {
  options: { value: string; label: string }[];
  defaultValue?: string;
  class?: string;
}

export function RadioButtonGroup(props: RadioButtonGroupProps) {
  const [selectedValue, setSelectedValue] = createSignal(props.defaultValue ?? "");

  return (
    <For each={props.options}>
      {(option) => (
        <RadioButton
          class={props.class}
          name="example"
          value={option.value}
          selected={selectedValue() === option.value}
          onSelect={setSelectedValue}
        >
          {option.label}
        </RadioButton>
      )}
    </For>
  );
}
