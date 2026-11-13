import type { JSX } from "@solidjs/web";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/solid/collapsible";
import { createSignal, untrack } from "solid-js";
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
  const initial = untrack(() => props.defaultValue ?? false);
  const [show, setShow] = createSignal(initial);

  return (
    <Collapsible class={styles.root} defaultOpen={initial} onOpenChange={setShow}>
      <CollapsibleTrigger
        render={(triggerProps) => (
          <Row
            {...triggerProps}
            class={classNames(props.class, props.classes?.header)}
            aug={props.aug}
            theme={props.theme}
          >
            <div class={classNames(styles.flex, show() ? styles.active : undefined)}>
              <span class={classNames(styles.icon, props.classes?.icon)}>
                {props.icon ? props.icon(show()) : show() ? "▾" : "▸"}
              </span>
              <span class={classNames(styles.content, props.classes?.title)}>{props.title}</span>
            </div>
          </Row>
        )}
      />
      <CollapsiblePanel
        render={(panelProps) => (
          <Row {...panelProps} class={classNames(styles.body, props.classes?.body)}>
            {props.children}
          </Row>
        )}
      />
    </Collapsible>
  );
}
