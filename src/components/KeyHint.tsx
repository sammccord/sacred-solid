import type { JSX } from "@solidjs/web";
import { For, omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { classNames, type SlotClasses } from "../common/utilities.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./KeyHint.module.css";

export type KeyHintSlot = "cap" | "label";

export interface KeyHintProps extends JSX.HTMLAttributes<HTMLDivElement> {
  keys: JSX.Element[];
  classes?: SlotClasses<KeyHintSlot>;
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

type CapKind = "text" | "long" | "icon";

function capKind(key: JSX.Element): CapKind {
  if (typeof key !== "string") return "icon";
  return Array.from(key).length > 1 ? "long" : "text";
}

const CAP_CLASS: Record<CapKind, string> = {
  text: styles.cap,
  long: classNames(styles.cap, styles.long),
  icon: styles.icon,
};

export function KeyHint(props: KeyHintProps) {
  const rest = omit(props, "class", "keys", "classes", "aug", "theme", "children");

  return (
    <div
      class={classNames(styles.root, props.class)}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      <For each={props.keys}>
        {(key) => <kbd class={classNames(CAP_CLASS[capKind(key)], props.classes?.cap)}>{key}</kbd>}
      </For>
      <span class={classNames(styles.label, props.classes?.label)}>{props.children}</span>
    </div>
  );
}
