import type { JSX } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./ActionBar.module.css";
import { ButtonGroup } from "./ButtonGroup.tsx";
import type { DropdownMenuProps } from "./DropdownMenu.tsx";
import { classNames } from "../common/utilities.ts";

export interface ActionBarItem {
  hotkey?: string;
  onClick?: () => void;
  openHotkey?: string;
  selected?: boolean;
  body: JSX.Element;
  items?: DropdownMenuProps["items"];
}

export interface ActionBarProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  items: ActionBarItem[];
}

export function ActionBar(props: ActionBarProps) {
  return (
    <div class={classNames(styles.root, props.class)} {...styleAttributes(props)}>
      <ButtonGroup items={props.items} />
    </div>
  );
}
