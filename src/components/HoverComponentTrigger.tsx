import {
  children as resolveChildren,
  createEffect,
  createSignal,
  type JSX,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { BodyPortal } from "./BodyPortal.tsx";
import * as Position from "../common/position.ts";
import { OutsideElementEvent } from "./detectors/OutsideElementEvent.tsx";
import styles from "./HoverComponentTrigger.module.css";
import { Popover } from "./Popover.tsx";
import { Tooltip } from "./Tooltip.tsx";
import { classNames } from "../common/utilities.ts";

export interface HoverComponentTriggerProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
  text: string;
  component: "popover" | "tooltip";
}

export function HoverComponentTrigger(props: HoverComponentTriggerProps) {
  const [open, setOpen] = createSignal(false);
  const [position, setPosition] = createSignal({ top: 0, left: 0 });

  let triggerRef: HTMLDivElement | undefined;
  let popoverRef: HTMLDivElement | undefined;

  const resolved = resolveChildren(() => props.children);

  onMount(() => {
    const child = resolved.toArray().find((node) => node instanceof HTMLElement);
    if (child) child.tabIndex = 0;
  });

  createEffect(() => {
    if (!open() || !triggerRef || !popoverRef) return;

    const trigger = triggerRef;
    const popover = popoverRef;

    const updatePosition = () => {
      setPosition(Position.calculate(trigger, popover).position);
    };

    updatePosition();

    const mutationObserver = new MutationObserver(updatePosition);
    mutationObserver.observe(document.body, { attributes: true, childList: true, subtree: true });

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    onCleanup(() => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      mutationObserver.disconnect();
    });
  });

  return (
    <div
      ref={(element) => (triggerRef = element)}
      class={classNames(styles.root, props.class)}
      data-detector-ignore="true"
      onMouseEnter={() => setOpen(true)}
      onClick={() => setOpen(true)}
      onFocusIn={() => setOpen(true)}
      {...styleAttributes(props)}
    >
      {resolved()}
      <Show when={open()}>
        <BodyPortal>
          <OutsideElementEvent onOutsideEvent={() => setOpen(false)}>
            <Switch>
              <Match when={props.component === "popover"}>
                <Popover
                  ref={(el) => (popoverRef = el)}
                  style={{
                    position: "absolute",
                    top: `${position().top}px`,
                    left: `${position().left}px`,
                    "z-index": "var(--z-index-page-popover)",
                  }}
                  role="dialog"
                  aria-modal="true"
                >
                  {props.text}
                </Popover>
              </Match>
              <Match when={props.component === "tooltip"}>
                <Tooltip
                  ref={(el) => (popoverRef = el)}
                  style={{
                    position: "absolute",
                    top: `${position().top}px`,
                    left: `${position().left}px`,
                    "z-index": "var(--z-index-page-tooltips)",
                  }}
                >
                  {props.text}
                </Tooltip>
              </Match>
            </Switch>
          </OutsideElementEvent>
        </BodyPortal>
      </Show>
    </div>
  );
}
