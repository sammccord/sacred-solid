import type { JSX } from "@solidjs/web";
import { For, Show } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames } from "../common/utilities.ts";
import { ActionButton } from "./ActionButton.tsx";
import styles from "./ButtonGroup.module.css";
import { DropdownMenuTrigger } from "./DropdownMenuTrigger.tsx";
import { Toolbar, ToolbarButton } from "@ui-sdk/solid/toolbar";
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
  label?: string;
}

export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <Show when={props.items}>
      {(items) => (
        <Toolbar
          class={classNames(styles.root, props.isFull ? styles.full : null, props.class)}
          aria-label={props.label ?? "Actions"}
          loop
          {...styleAttributes(props)}
        >
          <For each={items()}>
            {(each) => (
              <Show
                when={each.items}
                fallback={
                  <ToolbarButton
                    onClick={() => each.onClick?.()}
                    render={(buttonProps) => (
                      <ActionButton
                        {...buttonProps}
                        hotkey={each.hotkey}
                        isSelected={each.selected}
                      >
                        {each.body}
                      </ActionButton>
                    )}
                  />
                }
              >
                <DropdownMenuTrigger
                  items={each.items}
                  hotkey={each.openHotkey}
                  trigger={(triggerProps) => (
                    <ToolbarButton
                      {...triggerProps}
                      render={(buttonProps) => (
                        <ActionButton
                          {...buttonProps}
                          hotkey={each.hotkey}
                          isSelected={each.selected}
                        >
                          {each.body}
                        </ActionButton>
                      )}
                    />
                  )}
                />
              </Show>
            )}
          </For>
        </Toolbar>
      )}
    </Show>
  );
}
