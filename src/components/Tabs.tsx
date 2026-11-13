import type { JSX } from "@solidjs/web";
import { createSignal, createUniqueId, For, Show, omit } from "solid-js";
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
  );
  const baseId = createUniqueId();
  const [inner, setInner] = createSignal(props.defaultValue ?? props.items[0]?.id ?? "");
  const value = () => props.value ?? inner();
  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;
  const hasPanels = () => props.items.some((item) => "panel" in item);
  const selected = () => props.items.find((item) => item.id === value());

  const select = (id: string) => {
    if (props.value === undefined) setInner(id);
    props.onChange?.(id);
  };

  const move = (event: KeyboardEvent, step: number) => {
    const current = event.currentTarget as HTMLElement;
    const tabs = [...current.parentElement!.querySelectorAll<HTMLElement>("[role='tab']")];
    const next = (tabs.indexOf(current) + step + tabs.length) % tabs.length;
    event.preventDefault();
    select(props.items[next]!.id);
    tabs[next]!.focus();
  };

  return (
    <>
      <div
        role="tablist"
        class={classNames(styles.root, props.class)}
        {...rest}
        {...styleAttributes(props, rest.style)}
      >
        <For each={props.items}>
          {(item) => (
            <button
              type="button"
              role="tab"
              id={hasPanels() ? tabId(item.id) : undefined}
              aria-controls={hasPanels() ? panelId(item.id) : undefined}
              class={classNames(styles.tab, props.classes?.tab)}
              aria-selected={item.id === value() ? "true" : "false"}
              tabindex={item.id === value() ? 0 : -1}
              onClick={() => select(item.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") move(event, 1);
                else if (event.key === "ArrowLeft") move(event, -1);
              }}
            >
              <Show when={item.icon !== undefined}>
                <span class={classNames(styles.icon, props.classes?.icon)}>{item.icon}</span>
              </Show>
              <span class={classNames(styles.label, props.classes?.label)}>{item.label}</span>
            </button>
          )}
        </For>
      </div>
      <Show when={selected()}>
        {(item) => (
          <Show when={"panel" in item()}>
            <div
              role="tabpanel"
              id={panelId(item().id)}
              aria-labelledby={tabId(item().id)}
              class={classNames(styles.panel, props.classes?.panel)}
            >
              {item().panel}
            </div>
          </Show>
        )}
      </Show>
    </>
  );
}
