import type { JSX } from "@solidjs/web";
import { Progress } from "@ui-sdk/solid/progress";
import { createEffect, createSignal, onCleanup, onSettled, Show, untrack } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { classNames, mergeDefaults } from "../common/utilities.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./BarProgress.module.css";

export type BarProgressVariant = "char" | "solid";

export interface BarProgressProps {
  label?: string;
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  intervalRate?: number;
  progress?: number;
  fillChar?: string;
  variant?: BarProgressVariant;
  style?: JSX.CSSProperties;
}

export function BarProgress(allProps: BarProgressProps) {
  const props = mergeDefaults({ fillChar: "░", variant: "char" as BarProgressVariant }, allProps);
  const [currentProgress, setCurrentProgress] = createSignal(untrack(() => props.progress ?? 0));
  const [containerWidth, setContainerWidth] = createSignal(0);
  const [charWidth, setCharWidth] = createSignal(0);

  let containerRef = undefined as HTMLDivElement | undefined;
  let measureRef = undefined as HTMLSpanElement | undefined;

  createEffect(
    () => [props.progress, props.intervalRate] as const,
    ([progress, intervalRate]) => {
      if (typeof progress === "number") {
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

  createEffect(
    () => props.fillChar,
    () => {
      if (!measureRef) return;
      const rect = measureRef.getBoundingClientRect();
      if (rect.width > 0) {
        setCharWidth(rect.width);
      } else {
        const frame = requestAnimationFrame(() => {
          const retryRect = measureRef?.getBoundingClientRect();
          if (retryRect && retryRect.width > 0) {
            setCharWidth(retryRect.width);
          }
        });
        onCleanup(() => cancelAnimationFrame(frame));
      }
    },
  );

  onSettled(() => {
    if (!containerRef) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef);
    return () => observer.disconnect();
  });

  const cappedProgress = () => Math.min(currentProgress(), 100);

  const maxChars = () => {
    if (charWidth() > 0 && containerWidth() > 0) {
      return Math.max(1, Math.floor(containerWidth() / charWidth()));
    }
    return 10;
  };

  const barStr = () => props.fillChar.repeat(Math.round((cappedProgress() / 100) * maxChars()));

  return (
    <Progress
      class={classNames(styles.root, props.variant === "solid" && styles.solid, props.class)}
      ref={containerRef}
      value={cappedProgress()}
      aria-label={props.label ?? "Progress"}
      {...styleAttributes(props, props.style)}
    >
      <Show
        when={props.variant === "solid"}
        fallback={
          <>
            <span ref={measureRef} class={styles.measure}>
              {props.fillChar}
            </span>
            {barStr()}
          </>
        }
      >
        <div class={styles.fill} style={{ width: `${cappedProgress()}%` }} />
      </Show>
    </Progress>
  );
}
