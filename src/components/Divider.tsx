import type { JSX } from "@solidjs/web";
import { Separator } from "@ui-sdk/solid/separator";
import { Match, Switch } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Divider.module.css";
import { classNames } from "../common/utilities.ts";

export interface DividerProps extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, "style"> {
  type?: "GRADIENT" | "DOUBLE";
  style?: JSX.CSSProperties;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Divider(props: DividerProps) {
  return (
    <Separator
      render={(separatorProps) => (
        <Switch
          fallback={
            <div
              {...separatorProps}
              class={classNames(styles.divider, props.class)}
              {...styleAttributes(props, props.style)}
            >
              <div class={styles.line} />
            </div>
          }
        >
          <Match when={props.type === "GRADIENT"}>
            <div
              {...separatorProps}
              class={classNames(styles.gradient, props.class)}
              {...styleAttributes(props, props.style)}
            />
          </Match>
          <Match when={props.type === "DOUBLE"}>
            <div
              {...separatorProps}
              class={classNames(styles.divider, props.class)}
              {...styleAttributes(props, props.style)}
            >
              <div class={styles.line} style={{ "margin-bottom": "2px" }} />
              <div class={styles.line} />
            </div>
          </Match>
        </Switch>
      )}
    />
  );
}
