import {
  type JSX,
  Show,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
} from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./BlockLoader.module.css";
import { classNames } from "../common/utilities.ts";

const SEQUENCES = [
  ["⠁", "⠂", "⠄", "⡀", "⢀", "⠠", "⠐", "⠈"],
  ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"],
  ["▖", "▘", "▝", "▗"],
  ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃", "▁"],
  ["▉", "▊", "▋", "▌", "▍", "▎", "▏", "▎", "▍", "▌", "▋", "▊", "▉"],
  ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"],
  ["┤", "┘", "┴", "└", "├", "┌", "┬", "┐"],
  ["◢", "◣", "◤", "◥"],
  ["◰", "◳", "◲", "◱"],
  ["◴", "◷", "◶", "◵"],
  ["◐", "◓", "◑", "◒"],
];

export interface BlockLoaderProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> {
  aug?: AugProps;
  theme?: ThemeProps;
  mode?: number;
}

export function BlockLoader(propsIn: BlockLoaderProps) {
  const props = mergeProps({ mode: 0 }, propsIn);
  const [index, setIndex] = createSignal(0);
  const sequence = () => SEQUENCES[props.mode] as string[] | undefined;
  const indexLength = createMemo(() => sequence()?.length);

  createEffect(() => {
    const length = indexLength();
    if (length === undefined) return;

    const interval = window.setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % length);
    }, 100);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <Show
      when={sequence()}
      fallback={
        <span class={classNames(styles.block, props.class)} {...styleAttributes(props)}>
          �
        </span>
      }
    >
      {(frames) => (
        <span class={classNames(styles.root, props.class)} {...styleAttributes(props)}>
          {frames()[index()]}
        </span>
      )}
    </Show>
  );
}
