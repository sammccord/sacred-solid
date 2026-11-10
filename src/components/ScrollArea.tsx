import { createSignal, type JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
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

export function ScrollArea(allProps: ScrollAreaProps) {
  const [local, rest] = splitProps(allProps, [
    "class",
    "fade",
    "scrollbar",
    "viewportRef",
    "classes",
    "aug",
    "theme",
    "children",
  ]);
  const [edges, setEdges] = createSignal<Edges>({
    up: false,
    down: false,
    thumbTop: 0,
    thumbHeight: 0,
    scrollable: false,
  });
  let viewport = undefined as HTMLDivElement | undefined;
  let content = undefined as HTMLDivElement | undefined;
  const mode = () => local.scrollbar ?? "native";

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

  onMount(() => {
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport!);
    observer.observe(content!);
    onCleanup(() => observer.disconnect());
  });

  return (
    <div
      class={classNames(styles.root, local.class)}
      {...rest}
      {...styleAttributes(local, rest.style)}
    >
      <div
        ref={(element) => {
          viewport = element;
          local.viewportRef?.(element);
        }}
        class={classNames(
          styles.viewport,
          mode() !== "native" && styles.bare,
          local.fade && styles.fade,
          local.classes?.viewport,
        )}
        data-fade-top={local.fade && edges().up ? "" : undefined}
        data-fade-bottom={local.fade && edges().down ? "" : undefined}
        onScroll={measure}
      >
        <div ref={content} class={classNames(styles.content, local.classes?.content)}>
          {local.children}
        </div>
      </div>
      <Show when={mode() === "rail" && edges().scrollable}>
        <div class={classNames(styles.rail, local.classes?.rail)} aria-hidden="true">
          <div
            class={classNames(styles.thumb, local.classes?.thumb)}
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
