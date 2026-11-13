import type { JSX } from "@solidjs/web";
import {
  type Accessor,
  Show,
  children as resolveChildren,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./TreeView.module.css";
import { classNames } from "../common/utilities.ts";

export interface TreeViewProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  children?: JSX.Element;
  defaultValue?: boolean;
  depth?: number;
  isFile?: boolean;
  isLastChild?: boolean;
  isRoot?: boolean;
  parentLines?: boolean[];
  style?: JSX.CSSProperties;
  title: string;
}

interface TreeBranchContext {
  lastChild: Accessor<unknown>;
  parentLines: Accessor<boolean[]>;
}

const TreeBranchContext = createContext<TreeBranchContext | null>(null);

function TreeItems(props: { children?: JSX.Element; onResolve: (last: unknown) => void }) {
  const resolved = resolveChildren(() => props.children);
  createEffect(
    () => resolved.toArray().at(-1),
    (last) => {
      props.onResolve(last);
    },
  );

  return (
    <Show when={resolved.toArray().length > 0}>
      <div>{resolved()}</div>
    </Show>
  );
}

export function TreeView(props: TreeViewProps) {
  const branch = useContext(TreeBranchContext);
  const [show, setShow] = createSignal(props.defaultValue ?? false);
  const [lastChild, setLastChild] = createSignal<unknown>();
  const [isNestedLast, setIsNestedLast] = createSignal(false);
  let root: HTMLDivElement | undefined;

  createEffect(
    () => branch?.lastChild(),
    (last) => {
      if (branch) setIsNestedLast(last === root);
    },
  );

  const isLastChild = () => (branch ? isNestedLast() : (props.isLastChild ?? false));
  const parentLines = () => (branch ? branch.parentLines() : (props.parentLines ?? []));

  const onToggleShow = () => {
    if (!props.isFile) setShow((prevShow) => !prevShow);
  };

  const spacing = () =>
    parentLines()
      .map((line) => (line ? "│ . " : ". . "))
      .join("");
  const prefix = () => `${spacing()}${isLastChild() ? "└───" : "├───"}`;
  const icon = () => (props.isFile ? " " : show() ? "╦ " : "╤ ");

  const childBranch: TreeBranchContext = {
    lastChild,
    parentLines: () => [...parentLines(), !isLastChild()],
  };

  return (
    <div
      ref={(el) => (root = el)}
      class={classNames(styles.root, props.class)}
      {...styleAttributes(props, props.style)}
    >
      <div
        tabindex={0}
        role="button"
        onClick={onToggleShow}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (e.key === " ") e.preventDefault();
            onToggleShow();
          }
        }}
        class={styles.item}
        aria-expanded={show() ? "true" : "false"}
      >
        {prefix()}
        {icon()}
        {props.title}
      </div>
      <Show when={show()}>
        <TreeBranchContext value={childBranch}>
          <TreeItems onResolve={setLastChild}>{props.children}</TreeItems>
        </TreeBranchContext>
      </Show>
    </div>
  );
}
