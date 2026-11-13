import type { JSX } from "@solidjs/web";
import { For, Show } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames } from "../common/utilities.ts";
import { ActionButton } from "./ActionButton.tsx";
import styles from "./ButtonGroup.module.css";
import { DropdownMenuTrigger } from "./DropdownMenuTrigger.tsx";
import type { DropdownMenuProps } from "./DropdownMenu.tsx";

export interface ButtonGroupItem {
  body: JSX.Element;
  hotkey?: string;
  onClick?: () => void;
  openHotkey?: string;
  selected?: boolean;
  items?: DropdownMenuProps["items"];
}

export interface ButtonGroupProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  items?: ButtonGroupItem[];
  isFull?: boolean;
}

export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <Show when={props.items}>
      {(items) => (
        <div
          class={classNames(styles.root, props.isFull ? styles.full : null, props.class)}
          {...styleAttributes(props)}
        >
          <For each={items()}>
            {(each) => (
              <Show
                when={each.items}
                fallback={
                  <ActionButton
                    onClick={each.onClick}
                    hotkey={each.hotkey}
                    isSelected={each.selected}
                  >
                    {each.body}
                  </ActionButton>
                }
              >
                <DropdownMenuTrigger items={each.items} hotkey={each.openHotkey}>
                  <ActionButton hotkey={each.hotkey} isSelected={each.selected}>
                    {each.body}
                  </ActionButton>
                </DropdownMenuTrigger>
              </Show>
            )}
          </For>
        </div>
      )}
    </Show>
  );
}
