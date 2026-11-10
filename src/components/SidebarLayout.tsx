import { type JSX, Show, createSignal, onCleanup, splitProps } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./SidebarLayout.module.css";
import { classNames } from "../common/utilities.ts";

export interface SidebarLayoutProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "defaultValue"
> {
  children?: JSX.Element;
  sidebar?: JSX.Element;
  defaultSidebarWidth?: number;
  isShowingHandle?: boolean;
  isReversed?: boolean;
  aug?: AugProps;
  theme?: ThemeProps;
}

const CHARACTER_WIDTH = 9.6;

export function SidebarLayout(props: SidebarLayoutProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "aug",
    "theme",
    "defaultSidebarWidth",
    "children",
    "sidebar",
    "isShowingHandle",
    "isReversed",
  ]);
  const [sidebarWidth, setSidebarWidth] = createSignal(local.defaultSidebarWidth ?? 20);
  let stopDragging: (() => void) | undefined;

  onCleanup(() => stopDragging?.());

  const handleMouseDown: JSX.EventHandler<HTMLDivElement, MouseEvent> = (event) => {
    stopDragging?.();
    const startX = event.clientX;
    const startWidth = sidebarWidth();

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const increment = Math.round(deltaX / CHARACTER_WIDTH);
      setSidebarWidth(Math.max(CHARACTER_WIDTH, startWidth + increment));
    };

    const stop = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stop);
      stopDragging = undefined;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stop);
    stopDragging = stop;
  };

  const sidebar = () => (
    <div class={styles.sidebar} style={{ width: `${sidebarWidth()}ch` }}>
      {local.sidebar}
    </div>
  );

  return (
    <div
      class={classNames(styles.root, local.class)}
      {...rest}
      {...styleAttributes(local, rest.style)}
    >
      <Show
        when={local.isReversed}
        fallback={
          <>
            {sidebar()}
            <Show when={local.isShowingHandle}>
              <div class={styles.handle} role="button" tabIndex={0} onMouseDown={handleMouseDown}>
                <div class={styles.line} />
                <div class={styles.line} />
              </div>
            </Show>
            <div class={styles.content}>{local.children}</div>
          </>
        }
      >
        <div class={styles.content}>{local.children}</div>
        &nbsp;
        {sidebar()}
      </Show>
    </div>
  );
}
