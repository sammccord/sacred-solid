import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  CalendarHeading,
  CalendarNext,
  CalendarPrevious,
  CalendarWeekday,
  CalendarWeekdays,
  CalendarWeeks,
} from "@ui-sdk/solid/calendar";
import { createSignal, untrack } from "solid-js";
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
  onChange?: (date: string) => void;
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

export function DatePicker(props: DatePickerProps) {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const initialMonth = untrack(
    () => `${props.year || today.getFullYear()}-${pad(props.month || today.getMonth() + 1)}`,
  );
  const [month, setMonth] = createSignal(initialMonth);
  const heading = () => {
    const [year, index] = month().split("-").map(Number);
    return `${year} ${MONTH_NAMES[(index ?? 1) - 1]?.toUpperCase()}`;
  };

  return (
    <Calendar
      class={classNames(styles.root, props.class)}
      {...styleAttributes(props)}
      defaultMonth={initialMonth}
      onMonthChange={setMonth}
      onValueChange={(value) => {
        if (typeof value === "string") props.onChange?.(value);
      }}
      weekStartsOn={0}
      fixedWeeks
      showOutsideDays={false}
      locale="en-US"
    >
      <div class={styles.controls}>
        <CalendarPrevious class={styles.button} aria-label="Previous month">
          ▲
        </CalendarPrevious>
        <CalendarHeading class={styles.date}>{heading()}</CalendarHeading>
        <CalendarNext class={styles.button} aria-label="Next month">
          ▼
        </CalendarNext>
      </div>
      <CalendarGrid class={styles.grid}>
        <CalendarWeekdays class={styles.header}>
          {(index) => <CalendarWeekday index={index}>{WEEKDAYS[index]}</CalendarWeekday>}
        </CalendarWeekdays>
        <CalendarWeeks class={styles.days}>
          {(cell) => (
            <CalendarDay value={cell.date} class={styles.cell}>
              {pad(Number(cell.date.slice(-2)))}
            </CalendarDay>
          )}
        </CalendarWeeks>
      </CalendarGrid>
    </Calendar>
  );
}
