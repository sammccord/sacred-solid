import type { JSX } from "@solidjs/web";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/solid/collapsible";
import { createSignal, omit, untrack } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Drawer.module.css";
import { classNames } from "../common/utilities.ts";

export interface DrawerProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "style"
> {
  children?: JSX.Element;
  defaultValue?: boolean;
  label?: string;
  style?: JSX.CSSProperties;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Drawer(props: DrawerProps) {
  const rest = omit(props, "class", "aug", "theme", "children", "defaultValue", "label", "style");
  const initial = untrack(() => props.defaultValue ?? false);
  const [expand, setExpand] = createSignal(initial);

  return (
    <Collapsible
      class={classNames(styles.root, props.class)}
      defaultOpen={initial}
      onOpenChange={setExpand}
      {...(rest as Record<string, unknown>)}
      {...styleAttributes(props, props.style)}
    >
      <CollapsiblePanel class={styles.side}>{props.children}</CollapsiblePanel>
      <div class={styles.right}>
        <CollapsibleTrigger class={styles.action} aria-label={props.label ?? "Toggle drawer"}>
          {expand() ? "⭠" : "⭢"}
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  );
}
