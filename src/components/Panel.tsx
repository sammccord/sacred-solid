import type { JSX } from "@solidjs/web";
import { Show, omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { classNames, type SlotClasses, mergeDefaults } from "../common/utilities.ts";
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
  const props = mergeDefaults({ tone: "outline" as PanelTone }, allProps);
  const rest = omit(
    props,
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
  );

  return (
    <section
      class={classNames(styles.root, props.class)}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      <Show
        when={props.title !== undefined || props.icon !== undefined || props.meta !== undefined}
      >
        <header class={classNames(styles.header, TONE_CLASS[props.tone], props.classes?.header)}>
          <Show when={props.icon !== undefined}>
            <span class={classNames(styles.icon, props.classes?.icon)}>{props.icon}</span>
          </Show>
          <Show when={props.title !== undefined}>
            <h2 class={classNames(styles.title, props.classes?.title)}>{props.title}</h2>
          </Show>
          <span class={styles.gap} />
          <Show when={props.meta !== undefined}>
            <span class={classNames(styles.meta, props.classes?.meta)}>{props.meta}</span>
          </Show>
        </header>
      </Show>
      <div
        class={classNames(styles.body, props.classes?.body)}
        style={props.padding === undefined ? undefined : { padding: props.padding }}
      >
        {props.children}
      </div>
    </section>
  );
}
