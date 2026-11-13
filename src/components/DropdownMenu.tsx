import type { JSX } from "@solidjs/web";
import { MenuContent, MenuItem } from "@ui-sdk/solid/menu";
import { type Component, For, omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames, SPACE } from "../common/utilities.ts";
import { ActionButton } from "./ActionButton.tsx";
import { ActionListItem } from "./ActionListItem.tsx";
import styles from "./DropdownMenu.module.css";
import { useModals } from "./page/ModalContext.tsx";

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
  "children" | "onClose" | "style"
> {
  onClose?: () => void;
  items?: DropdownMenuItem[];
  style?: JSX.CSSProperties;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function DropdownMenu(props: DropdownMenuProps) {
  const rest = omit(props, "class", "onClose", "items", "style", "aug", "theme");
  const { open } = useModals();

  const select = (each: DropdownMenuItem, event: Event) => {
    if (each.modal) {
      event.preventDefault();
      open(each.modal as Component<Record<string, unknown>>, each.modalProps ?? {});
      return;
    }
    each.onClick?.();
  };

  return (
    <MenuContent
      class={classNames(styles.root, props.class)}
      {...rest}
      {...styleAttributes(props, props.style)}
    >
      <For each={props.items ?? []}>
        {(each) => (
          <MenuItem
            onSelect={(event) => select(each, event)}
            render={(itemProps) => (
              <ActionListItem
                {...itemProps}
                icon={each.icon}
                href={each.modal ? undefined : each.href}
                target={each.target}
              >
                {each.children}
              </ActionListItem>
            )}
          />
        )}
      </For>
      <footer class={styles.footer}>
        Press escape to{SPACE}
        <ActionButton hotkey="Esc" onClick={() => props.onClose?.()}>
          Close
        </ActionButton>
      </footer>
    </MenuContent>
  );
}
