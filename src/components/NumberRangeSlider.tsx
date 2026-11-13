import type { JSX } from "@solidjs/web";
import { createEffect, createSignal } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./NumberRangeSlider.module.css";
import { classNames, mergeDefaults } from "../common/utilities.ts";

export interface NumberRangeSliderProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  defaultValue?: number;
  max?: number;
  min?: number;
  step?: number;
}

export function NumberRangeSlider(allProps: NumberRangeSliderProps) {
  const props = mergeDefaults({ defaultValue: 0, max: 5000, min: 0, step: 1 }, allProps);
  let sliderRef = undefined as HTMLInputElement | undefined;
  const [displayValue, setDisplayValue] = createSignal(props.defaultValue);

  const maxDigits = () => props.max.toString().length;
  const padValue = (value: number) => value.toString().padStart(maxDigits(), "0");

  createEffect(
    () => props.defaultValue,
    (value) => {
      if (sliderRef) {
        sliderRef.value = String(value);
      }
      setDisplayValue(value);
    },
  );

  const scrub: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (event) => {
    setDisplayValue(parseInt(event.currentTarget.value, 10));
  };

  return (
    <div class={classNames(styles.root, props.class)} {...styleAttributes(props)}>
      <label class={styles.left}>
        <div class={styles.amount}>{padValue(displayValue())}</div>
      </label>
      <input
        class={styles.slider}
        max={props.max}
        min={props.min}
        onInput={scrub}
        ref={sliderRef}
        role="slider"
        step={props.step}
        tabindex={0}
        type="range"
      />
    </div>
  );
}
