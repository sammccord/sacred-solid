import type { JSX } from "@solidjs/web";
import { Tabs as TabsRoot, TabsList, TabsPanel, TabsTab, TabsTabIcon } from "@ui-sdk/solid/tabs";
import { For, Show, omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { classNames, type SlotClasses } from "../common/utilities.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Tabs.module.css";

export interface TabItem {
  id: string;
  label: JSX.Element;
  icon?: JSX.Element;
  panel?: JSX.Element;
}

export type TabsSlot = "tab" | "icon" | "label" | "panel";

export interface TabsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  classes?: SlotClasses<TabsSlot>;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Tabs(props: TabsProps) {
  const rest = omit(
    props,
    "class",
    "items",
    "value",
    "defaultValue",
    "onChange",
    "classes",
    "aug",
    "theme",
    "style",
  );

  return (
    <TabsRoot
      class={styles.group}
      {...(props.value === undefined
        ? { defaultValue: props.defaultValue ?? props.items[0]?.id }
        : {
            get value() {
              return props.value;
            },
          })}
      onValueChange={(next) => {
        if (next !== null) props.onChange?.(next);
      }}
      loop
    >
      <TabsList
        class={classNames(styles.root, props.class)}
        {...rest}
        {...styleAttributes(props, props.style)}
      >
        <For each={props.items}>
          {(item) => (
            <TabsTab value={item.id} class={classNames(styles.tab, props.classes?.tab)}>
              <Show when={item.icon !== undefined}>
                <TabsTabIcon class={classNames(styles.icon, props.classes?.icon)}>
                  {item.icon}
                </TabsTabIcon>
              </Show>
              <span class={classNames(styles.label, props.classes?.label)}>{item.label}</span>
            </TabsTab>
          )}
        </For>
      </TabsList>
      <For each={props.items.filter((item) => "panel" in item)}>
        {(item) => (
          <TabsPanel value={item.id} class={classNames(styles.panel, props.classes?.panel)}>
            {item.panel}
          </TabsPanel>
        )}
      </For>
    </TabsRoot>
  );
}
