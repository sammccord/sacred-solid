import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/solid/slider";
import { createSignal } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./NumberRangeSlider.module.css";
import { classNames, mergeDefaults } from "../common/utilities.ts";

export interface NumberRangeSliderProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  label?: string;
  name?: string;
  defaultValue?: number;
  max?: number;
  min?: number;
  step?: number;
  onChange?: (value: number) => void;
}

export function NumberRangeSlider(allProps: NumberRangeSliderProps) {
  const props = mergeDefaults({ defaultValue: 0, max: 5000, min: 0, step: 1 }, allProps);
  const [value, setValue] = createSignal(() => props.defaultValue);

  const padValue = (amount: number) => amount.toString().padStart(props.max.toString().length, "0");

  return (
    <Slider
      class={classNames(styles.root, props.class)}
      {...styleAttributes(props)}
      value={value()}
      onValueChange={(next) => {
        setValue(next);
        props.onChange?.(next);
      }}
      min={props.min}
      max={props.max}
      step={props.step}
      name={props.name}
    >
      <div class={styles.left} aria-hidden="true">
        <div class={styles.amount}>{padValue(value())}</div>
      </div>
      <SliderControl class={styles.slider}>
        <SliderTrack class={styles.track}>
          <SliderIndicator class={styles.indicator} />
          <SliderThumb class={styles.thumb} aria-label={props.label ?? "Amount"} />
        </SliderTrack>
      </SliderControl>
    </Slider>
  );
}
