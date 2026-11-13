import type { JSX } from "@solidjs/web";
import { createSignal, Show, omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Drawer.module.css";
import { classNames } from "../common/utilities.ts";

export interface DrawerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  children?: JSX.Element;
  defaultValue?: boolean;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Drawer(props: DrawerProps) {
  const rest = omit(props, "class", "aug", "theme", "children", "defaultValue");
  const [expand, setExpand] = createSignal(props.defaultValue ?? false);

  return (
    <div
      class={classNames(styles.root, props.class)}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      <Show when={expand()}>
        <div class={styles.side}>{props.children}</div>
      </Show>
      <div class={styles.right}>
        <button class={styles.action} onClick={() => setExpand(!expand())}>
          {expand() ? "⭠" : "⭢"}
        </button>
      </div>
    </div>
  );
}
