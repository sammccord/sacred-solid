import { createSignal, For } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./DatePicker.module.css";
import { classNames } from "../common/utilities.ts";

export interface DatePickerProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  year?: number;
  month?: number;
}

const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MAX_CELLS = 42;

function range(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}

export function DatePicker(props: DatePickerProps) {
  const today = new Date();
  const [currentYear, setYear] = createSignal(props.year || today.getFullYear());
  const [currentMonth, setMonth] = createSignal(props.month || today.getMonth() + 1);

  const startingWeekday = () => new Date(currentYear(), currentMonth() - 1, 1).getDay();
  const daysInMonth = () => new Date(currentYear(), currentMonth(), 0).getDate();
  const trailingCells = () => Math.max(0, MAX_CELLS - startingWeekday() - daysInMonth());

  const pad = (n: number) => String(n).padStart(2, "0");

  const onSwitchPreviousMonth = () => {
    let newMonth = currentMonth() - 1;
    let newYear = currentYear();
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  const onSwitchNextMonth = () => {
    let newMonth = currentMonth() + 1;
    let newYear = currentYear();
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div class={classNames(styles.root, props.class)} {...styleAttributes(props)}>
      <div class={styles.controls}>
        <button
          type="button"
          class={styles.button}
          onClick={onSwitchPreviousMonth}
          aria-label="Previous month"
        >
          ▲
        </button>
        <div class={styles.date}>
          {currentYear()} {MONTH_NAMES[currentMonth() - 1]?.toUpperCase()}
        </div>
        <button
          type="button"
          class={styles.button}
          onClick={onSwitchNextMonth}
          aria-label="Next month"
        >
          ▼
        </button>
      </div>
      <div class={styles.header}>
        <For each={WEEKDAYS}>{(day) => <div class={styles.cell}>{day}</div>}</For>
      </div>
      <div class={styles.days}>
        <For keyed={false} each={range(startingWeekday())}>
          {() => <div class={styles.dayCell} />}
        </For>
        <For each={range(daysInMonth()).map((i) => i + 1)}>
          {(day) => (
            <div
              class={styles.cell}
              tabindex={0}
              aria-label={`${currentYear()}-${pad(currentMonth())}-${pad(day)}`}
            >
              {pad(day)}
            </div>
          )}
        </For>
        <For keyed={false} each={range(trailingCells())}>
          {() => <div class={styles.dayCell} />}
        </For>
      </div>
    </div>
  );
}
