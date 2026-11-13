import type { JSX } from "@solidjs/web";
import { createSignal, Show } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { classNames, type SlotClasses } from "../common/utilities.ts";
import type { ThemeProps } from "../style/index.ts";
import styles from "./Accordion.module.css";
import { Row } from "./Row.tsx";

export type AccordionSlot = "header" | "icon" | "title" | "body";

export interface AccordionProps {
  class?: string;
  defaultValue?: boolean;
  title: string;
  icon?: (open: boolean) => JSX.Element;
  classes?: SlotClasses<AccordionSlot>;
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

export function Accordion(props: AccordionProps) {
  const [show, setShow] = createSignal(props.defaultValue ?? false);

  const toggleShow = () => {
    setShow((prev) => !prev);
  };

  return (
    <>
      <Row
        class={classNames(props.class, props.classes?.header)}
        aug={props.aug}
        theme={props.theme}
        tabindex={0}
        role="button"
        onClick={toggleShow}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (e.key === " ") e.preventDefault();
            toggleShow();
          }
        }}
        aria-expanded={show() ? "true" : "false"}
      >
        <div class={classNames(styles.flex, show() ? styles.active : undefined)}>
          <span class={classNames(styles.icon, props.classes?.icon)}>
            {props.icon ? props.icon(show()) : show() ? "▾" : "▸"}
          </span>
          <span class={classNames(styles.content, props.classes?.title)}>{props.title}</span>
        </div>
      </Row>
      <Show when={show()}>
        <Row class={classNames(styles.body, props.classes?.body)}>{props.children}</Row>
      </Show>
    </>
  );
}
