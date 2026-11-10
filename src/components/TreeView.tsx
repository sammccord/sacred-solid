import {
  type Accessor,
  type JSX,
  Show,
  children as resolveChildren,
  createComputed,
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

const TreeBranchContext = createContext<TreeBranchContext>();

function TreeItems(props: { children?: JSX.Element; onResolve: (last: unknown) => void }) {
  const resolved = resolveChildren(() => props.children);
  createComputed(() => props.onResolve(resolved.toArray().at(-1)));

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

  createEffect(() => {
    if (branch) setIsNestedLast(branch.lastChild() === root);
  });

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
        tabIndex={0}
        role="button"
        onClick={onToggleShow}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (e.key === " ") e.preventDefault();
            onToggleShow();
          }
        }}
        class={styles.item}
        aria-expanded={show()}
      >
        {prefix()}
        {icon()}
        {props.title}
      </div>
      <Show when={show()}>
        <TreeBranchContext.Provider value={childBranch}>
          <TreeItems onResolve={setLastChild}>{props.children}</TreeItems>
        </TreeBranchContext.Provider>
      </Show>
    </div>
  );
}
