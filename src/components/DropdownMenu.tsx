import type { JSX } from "@solidjs/web";
import { type Component, For, Show, omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { SPACE } from "../common/utilities.ts";
import { createHotkeys } from "../modules/hotkeys/index.ts";
import { ActionButton } from "./ActionButton.tsx";
import { ActionListItem } from "./ActionListItem.tsx";
import styles from "./DropdownMenu.module.css";
import { ModalTrigger } from "./ModalTrigger.tsx";
import { classNames } from "../common/utilities.ts";

export interface DropdownMenuItem {
  children?: JSX.Element;
  icon?: JSX.Element;
  href?: string;
  target?: string;
  onClick?: () => void;
  modal?: Component<never>;
  modalProps?: Record<string, unknown>;
}

export interface DropdownMenuProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children" | "onClose"
> {
  onClose?: (event?: MouseEvent | TouchEvent | KeyboardEvent) => void;
  items?: DropdownMenuItem[];
  aug?: AugProps;
  theme?: ThemeProps;
}

export function DropdownMenu(props: DropdownMenuProps) {
  const rest = omit(props, "class", "onClose", "items", "style", "ref", "aug", "theme");

  let menu: HTMLDivElement | undefined;

  const handleClose = () => {
    props.onClose?.();
  };

  createHotkeys("Escape", handleClose);

  // Solid delegates onKeyDown to document, so stopPropagation alone would not keep the
  //menu's keys away from document hotkeys. Delegation also keeps the footer button's own key handler working.
  const consume = (event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  };

  const handleKeyDown: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    if (!menu) return;

    const menuItems = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    if (menuItems.length === 0) return;

    const currentIndex = menuItems.indexOf(event.target as HTMLElement);

    switch (event.key) {
      case "ArrowDown": {
        consume(event);
        const next = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        menuItems[next]?.focus();
        break;
      }
      case "ArrowUp": {
        consume(event);
        const prev = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        menuItems[prev]?.focus();
        break;
      }
      case "Enter":
      case " ": {
        consume(event);
        if (currentIndex >= 0) {
          menuItems[currentIndex]?.click();
        }
        break;
      }
      case "Escape": {
        consume(event);
        handleClose();
        break;
      }
    }
  };

  return (
    <div
      ref={(element) => {
        menu = element;
        const forwarded = props.ref;
        if (typeof forwarded === "function") forwarded(element);
      }}
      class={classNames(styles.root, props.class)}
      {...rest}
      {...styleAttributes(props, props.style)}
      role="menu"
      onKeyDown={handleKeyDown}
    >
      <Show when={props.items}>
        {(items) => (
          <For each={items()}>
            {(each) => (
              <Show
                when={each.modal}
                fallback={
                  <ActionListItem
                    icon={each.icon}
                    href={each.href}
                    target={each.target}
                    role="menuitem"
                    onClick={() => {
                      each.onClick?.();
                      props.onClose?.();
                    }}
                  >
                    {each.children}
                  </ActionListItem>
                }
              >
                {(modal) => (
                  <ModalTrigger
                    modal={modal() as Component<Record<string, unknown>>}
                    modalProps={each.modalProps}
                  >
                    <ActionListItem icon={each.icon} role="menuitem">
                      {each.children}
                    </ActionListItem>
                  </ModalTrigger>
                )}
              </Show>
            )}
          </For>
        )}
      </Show>

      <footer class={styles.footer}>
        Press escape to{SPACE}
        <ActionButton hotkey="Esc" onClick={() => props.onClose?.()}>
          Close
        </ActionButton>
      </footer>
    </div>
  );
}
