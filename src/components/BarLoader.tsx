import { Progress } from "@ui-sdk/solid/progress";
import { createEffect, createSignal } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./BarLoader.module.css";
import { classNames } from "../common/utilities.ts";

export interface BarLoaderProps {
  label?: string;
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  intervalRate?: number;
  progress?: number;
}

export function BarLoader(props: BarLoaderProps) {
  const [currentProgress, setCurrentProgress] = createSignal<number>(props.progress || 0);

  createEffect(
    () => [props.progress, props.intervalRate] as const,
    ([progress, intervalRate]) => {
      if (progress !== undefined) {
        setCurrentProgress(progress);
        return;
      }

      if (!intervalRate) return;

      const interval = setInterval(() => {
        setCurrentProgress((prev) => (prev + 10) % 110);
      }, intervalRate);

      return () => clearInterval(interval);
    },
  );

  return (
    <Progress
      class={classNames(styles.root, props.class)}
      {...styleAttributes(props)}
      value={Math.min(currentProgress(), 100)}
      aria-label={props.label ?? "Loading"}
    >
      <div class={styles.bar} style={{ width: `${Math.min(currentProgress(), 100)}%` }}></div>
    </Progress>
  );
}
