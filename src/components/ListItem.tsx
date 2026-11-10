import { type JSX, splitProps } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { classNames, findNextFocusable } from "../common/utilities.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./ListItem.module.css";

export interface ListItemProps extends JSX.HTMLAttributes<HTMLLIElement> {
  aug?: AugProps;
  theme?: ThemeProps;
  selected?: boolean;
  children?: JSX.Element;
}

export function ListItem(props: ListItemProps) {
  const [local, rest] = splitProps(props, ["class", "aug", "theme", "selected", "children"]);
  let itemRef: HTMLLIElement | undefined;

  const handleKeyDown: JSX.EventHandler<HTMLLIElement, KeyboardEvent> = (event) => {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        itemRef?.click();
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        findNextFocusable(document.activeElement, "previous")?.focus();
        break;
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        findNextFocusable(document.activeElement, "next")?.focus();
        break;
    }
  };

  return (
    <li
      class={classNames(styles.root, local.class)}
      tabIndex={0}
      ref={(el) => (itemRef = el)}
      onKeyDown={handleKeyDown}
      data-selected={local.selected ? "" : undefined}
      {...rest}
      {...styleAttributes(local, rest.style)}
    >
      {local.children}
    </li>
  );
}
