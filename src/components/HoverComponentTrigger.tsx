import { type JSX, spread } from "@solidjs/web";
import { Popover as PopoverRoot, PopoverContent, PopoverTrigger } from "@ui-sdk/solid/popover";
import { Tooltip as TooltipRoot, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip";
import { children as resolveChildren, Match, Switch, untrack } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./HoverComponentTrigger.module.css";
import { classNames } from "../common/utilities.ts";
import { Popover } from "./Popover.tsx";
import { Tooltip } from "./Tooltip.tsx";

export interface HoverComponentTriggerProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
  text: string;
  component: "popover" | "tooltip";
}

export function HoverComponentTrigger(props: HoverComponentTriggerProps) {
  const resolved = resolveChildren(() => props.children);
  const target = untrack(() =>
    resolved.toArray().find((node): node is HTMLElement => node instanceof HTMLElement),
  );

  const asTrigger = (triggerProps: Record<string, unknown>) => {
    if (!target) return resolved();
    spread(target, triggerProps, true);
    if (
      !target.hasAttribute("tabindex") &&
      !target.matches("a[href], button, input, select, textarea")
    ) {
      target.tabIndex = 0;
    }
    return target;
  };

  return (
    <div
      class={classNames(styles.root, props.class)}
      data-detector-ignore="true"
      {...styleAttributes(props)}
    >
      <Switch>
        <Match when={props.component === "popover"}>
          <PopoverRoot openOnHover>
            <PopoverTrigger render={asTrigger} />
            <PopoverContent
              side="bottom"
              align="start"
              render={(contentProps) => <Popover {...contentProps}>{props.text}</Popover>}
            />
          </PopoverRoot>
        </Match>
        <Match when={props.component === "tooltip"}>
          <TooltipRoot>
            <TooltipTrigger render={asTrigger} />
            <TooltipContent
              side="bottom"
              align="start"
              render={(contentProps) => <Tooltip {...contentProps}>{props.text}</Tooltip>}
            />
          </TooltipRoot>
        </Match>
      </Switch>
    </div>
  );
}
