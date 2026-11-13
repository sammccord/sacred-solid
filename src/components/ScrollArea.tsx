import type { JSX } from "@solidjs/web";
import { createSignal, onSettled, Show, omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { classNames, type SlotClasses } from "../common/utilities.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./ScrollArea.module.css";

export type ScrollbarMode = "native" | "hidden" | "rail";

export type ScrollAreaSlot = "viewport" | "content" | "rail" | "thumb";

export interface ScrollAreaProps extends JSX.HTMLAttributes<HTMLDivElement> {
  fade?: boolean;
  scrollbar?: ScrollbarMode;
  viewportRef?: (element: HTMLDivElement) => void;
  classes?: SlotClasses<ScrollAreaSlot>;
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
}

const MIN_THUMB = 12;

interface Edges {
  up: boolean;
  down: boolean;
  thumbTop: number;
  thumbHeight: number;
  scrollable: boolean;
}

export function ScrollArea(props: ScrollAreaProps) {
  const rest = omit(
    props,
    "class",
    "fade",
    "scrollbar",
    "viewportRef",
    "classes",
    "aug",
    "theme",
    "children",
  );
  const [edges, setEdges] = createSignal<Edges>({
    up: false,
    down: false,
    thumbTop: 0,
    thumbHeight: 0,
    scrollable: false,
  });
  let viewport = undefined as HTMLDivElement | undefined;
  let content = undefined as HTMLDivElement | undefined;
  const mode = () => props.scrollbar ?? "native";

  const measure = () => {
    if (viewport === undefined) return;
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const scrollable = scrollHeight - clientHeight > 1;
    const thumbHeight = scrollable
      ? Math.max(MIN_THUMB, (clientHeight / scrollHeight) * clientHeight)
      : 0;
    const travel = clientHeight - thumbHeight;
    const maxScroll = scrollHeight - clientHeight;
    setEdges({
      up: scrollTop > 0,
      down: scrollable && scrollTop + clientHeight < scrollHeight - 1,
      thumbTop: scrollable ? (scrollTop / maxScroll) * travel : 0,
      thumbHeight,
      scrollable,
    });
  };

  onSettled(() => {
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport!);
    observer.observe(content!);
    return () => observer.disconnect();
  });

  return (
    <div
      class={classNames(styles.root, props.class)}
      {...rest}
      {...styleAttributes(props, rest.style)}
    >
      <div
        ref={(element) => {
          viewport = element;
          props.viewportRef?.(element);
        }}
        class={classNames(
          styles.viewport,
          mode() !== "native" && styles.bare,
          props.fade && styles.fade,
          props.classes?.viewport,
        )}
        data-fade-top={props.fade && edges().up ? "" : undefined}
        data-fade-bottom={props.fade && edges().down ? "" : undefined}
        onScroll={measure}
      >
        <div ref={content} class={classNames(styles.content, props.classes?.content)}>
          {props.children}
        </div>
      </div>
      <Show when={mode() === "rail" && edges().scrollable}>
        <div class={classNames(styles.rail, props.classes?.rail)} aria-hidden="true">
          <div
            class={classNames(styles.thumb, props.classes?.thumb)}
            style={{
              top: `${edges().thumbTop}px`,
              height: `${edges().thumbHeight}px`,
            }}
          />
        </div>
      </Show>
    </div>
  );
}
