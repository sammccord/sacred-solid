import {
  children as resolveChildren,
  createEffect,
  createSignal,
  type JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { BodyPortal } from "./BodyPortal.tsx";
import * as Position from "../common/position.ts";
import { findFocusableDescendant } from "../common/utilities.ts";
import { createHotkeys } from "../modules/hotkeys/index.ts";
import { OutsideElementEvent } from "./detectors/OutsideElementEvent.tsx";
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
  const [open, setOpen] = createSignal(false);
  const [focusChildren, setFocusChildren] = createSignal(false);
  const [willClose, setWillClose] = createSignal(false);
  const [position, setPosition] = createSignal({ top: 0, left: 0 });

  let element: HTMLDivElement | undefined;

  const resolved = resolveChildren(() => props.children);
  const trigger = resolved.toArray().find((node) => node instanceof HTMLElement);

  const onClick = (event?: Event) => {
    if (event) event.preventDefault();
    setOpen(true);
  };

  onMount(() => {
    if (!trigger) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target !== trigger) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      if (trigger.tagName === "BUTTON" || trigger.tagName === "A") return;
      onClick();
    };

    trigger.tabIndex = 0;
    trigger.addEventListener("click", onClick);
    trigger.addEventListener("keydown", onKeyDown);

    onCleanup(() => {
      trigger.removeEventListener("click", onClick);
      trigger.removeEventListener("keydown", onKeyDown);
    });
  });

  createHotkeys(
    () => props.hotkey ?? "",
    () => setOpen(!open()),
    () => ({ enabled: Boolean(props.hotkey) }),
  );

  createEffect(() => {
    if (!focusChildren()) return;

    if (element) {
      const firstFocusable = findFocusableDescendant(element);
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        element.focus();
      }
    }
    setFocusChildren(false);
  });

  createEffect(() => {
    if (!willClose()) return;

    setOpen(false);
    setWillClose(false);
  });

  //NOTE(jimmylee): WAI-ARIA requires focus return to the trigger on close so keyboard users are not stranded.
  let prevOpen = false;
  createEffect(() => {
    const isOpen = open();
    if (prevOpen && !isOpen) {
      trigger?.focus();
    }
    prevOpen = isOpen;
  });

  createEffect(() => {
    if (!open() || !trigger || !element) return;

    const menu = element;
    menu.style.width = `${menu.getBoundingClientRect().width}px`;

    const updatePosition = () => {
      setPosition(Position.calculate(trigger, menu).position);
    };

    updatePosition();
    setFocusChildren(true);

    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    onCleanup(() => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      observer.disconnect();
    });
  });

  return (
    <div class={classNames(styles.root, props.class)} {...styleAttributes(props)}>
      {resolved()}
      <Show when={open()}>
        <BodyPortal>
          <OutsideElementEvent onOutsideEvent={() => setOpen(false)}>
            <DropdownMenu
              onClose={() => setWillClose(true)}
              ref={(el) => (element = el)}
              items={props.items}
              style={{
                position: "absolute",
                top: `${position().top}px`,
                left: `${position().left}px`,
                "z-index": "var(--z-index-page-dropdown-menus)",
              }}
              aria-label="menu"
            />
          </OutsideElementEvent>
        </BodyPortal>
      </Show>
    </div>
  );
}
