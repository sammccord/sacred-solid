import { type JSX, spread } from "@solidjs/web";
import { createMenuController, Menu, MenuTrigger } from "@ui-sdk/solid/menu";
import { children as resolveChildren, untrack } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { createHotkeys } from "../modules/hotkeys/index.ts";
import { DropdownMenu, type DropdownMenuProps } from "./DropdownMenu.tsx";
import styles from "./DropdownMenuTrigger.module.css";
import { classNames } from "../common/utilities.ts";

export interface DropdownMenuTriggerProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
  items: DropdownMenuProps["items"];
  hotkey?: string;
}

export function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  const controller = createMenuController();
  const resolved = resolveChildren(() => props.children);
  const trigger = untrack(() =>
    resolved.toArray().find((node): node is HTMLElement => node instanceof HTMLElement),
  );

  createHotkeys(
    () => props.hotkey ?? "",
    () => controller.toggle(),
    () => ({ enabled: Boolean(props.hotkey) }),
  );

  //NOTE: The caller's element becomes the trigger, so the page keeps one tab stop.
  return (
    <div class={classNames(styles.root, props.class)} {...styleAttributes(props)}>
      <Menu controller={controller} loop>
        {trigger ? (
          <MenuTrigger
            render={(triggerProps) => {
              spread(trigger, triggerProps, true);
              return trigger;
            }}
          />
        ) : (
          resolved()
        )}
        <DropdownMenu items={props.items} onClose={() => controller.close()} />
      </Menu>
    </div>
  );
}
