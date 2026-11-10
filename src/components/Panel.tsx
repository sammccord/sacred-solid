import { type JSX, mergeProps, Show, splitProps } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { classNames, type SlotClasses } from "../common/utilities.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Panel.module.css";

export type PanelTone = "outline" | "filled";

const TONE_CLASS: Record<PanelTone, string> = {
  outline: styles.outline,
  filled: styles.filled,
};

export type PanelSlot = "header" | "icon" | "title" | "meta" | "body";

export interface PanelProps extends Omit<JSX.HTMLAttributes<HTMLElement>, "title"> {
  title?: JSX.Element;
  icon?: JSX.Element;
  meta?: JSX.Element;
  tone?: PanelTone;
  padding?: string;
  classes?: SlotClasses<PanelSlot>;
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function Panel(allProps: PanelProps) {
  const props = mergeProps({ tone: "outline" as PanelTone }, allProps);
  const [local, rest] = splitProps(props, [
    "title",
    "icon",
    "meta",
    "tone",
    "padding",
    "classes",
    "aug",
    "theme",
    "class",
    "children",
  ]);

  return (
    <section
      class={classNames(styles.root, local.class)}
      {...rest}
      {...styleAttributes(local, rest.style)}
    >
      <Show
        when={local.title !== undefined || local.icon !== undefined || local.meta !== undefined}
      >
        <header class={classNames(styles.header, TONE_CLASS[local.tone], local.classes?.header)}>
          <Show when={local.icon !== undefined}>
            <span class={classNames(styles.icon, local.classes?.icon)}>{local.icon}</span>
          </Show>
          <Show when={local.title !== undefined}>
            <h2 class={classNames(styles.title, local.classes?.title)}>{local.title}</h2>
          </Show>
          <span class={styles.gap} />
          <Show when={local.meta !== undefined}>
            <span class={classNames(styles.meta, local.classes?.meta)}>{local.meta}</span>
          </Show>
        </header>
      </Show>
      <div
        class={classNames(styles.body, local.classes?.body)}
        style={local.padding === undefined ? undefined : { padding: local.padding }}
      >
        {local.children}
      </div>
    </section>
  );
}
