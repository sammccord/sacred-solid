import type { JSX } from "@solidjs/web";
import { Tree, TreeGroup, TreeItem, TreeItemLabel } from "@ui-sdk/solid/tree";
import {
  type Accessor,
  children as resolveChildren,
  createContext,
  createEffect,
  createSignal,
  createUniqueId,
  Show,
  untrack,
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

interface TreeState {
  expanded: Accessor<string[]>;
  expand: (value: string) => void;
}

interface TreeBranchContext {
  lastChild: Accessor<unknown>;
  parentLines: Accessor<boolean[]>;
}

const TreeStateContext = createContext<TreeState | null>(null);
const TreeBranchContext = createContext<TreeBranchContext | null>(null);

function TreeItems(props: { children?: JSX.Element; onResolve: (last: unknown) => void }) {
  const resolved = resolveChildren(() => props.children);
  createEffect(
    () => resolved.toArray().at(-1),
    (last) => {
      props.onResolve(last);
    },
  );

  return <>{resolved()}</>;
}

export function TreeView(props: TreeViewProps) {
  const state = useContext(TreeStateContext);
  if (state) return <TreeNode {...props} state={state} />;

  const [expanded, setExpanded] = createSignal<string[]>([], { ownedWrite: true });
  const own: TreeState = {
    expanded,
    expand: (value) => setExpanded((prev) => (prev.includes(value) ? prev : [...prev, value])),
  };

  return (
    <TreeStateContext value={own}>
      <Tree
        class={styles.tree}
        aria-label={props.title}
        expanded={expanded()}
        onExpandedChange={setExpanded}
        expandOnPress
      >
        <TreeNode {...props} state={own} />
      </Tree>
    </TreeStateContext>
  );
}

function TreeNode(props: TreeViewProps & { state: TreeState }) {
  const branch = useContext(TreeBranchContext);
  const value = createUniqueId();
  const [lastChild, setLastChild] = createSignal<unknown>();
  const [isNestedLast, setIsNestedLast] = createSignal(false);
  let root: HTMLElement | undefined;

  if (untrack(() => props.defaultValue && !props.isFile)) props.state.expand(value);

  createEffect(
    () => branch?.lastChild(),
    (last) => {
      if (branch) setIsNestedLast(last === root);
    },
  );

  const show = () => props.state.expanded().includes(value);
  const isLastChild = () => (branch ? isNestedLast() : (props.isLastChild ?? false));
  const parentLines = () => (branch ? branch.parentLines() : (props.parentLines ?? []));

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
    <TreeItem
      value={value}
      label={props.title}
      branch={!props.isFile}
      ref={(el: HTMLElement) => (root = el)}
      class={classNames(styles.root, props.class)}
      {...styleAttributes(props, props.style)}
    >
      <TreeItemLabel class={styles.item}>
        {prefix()}
        {icon()}
        {props.title}
      </TreeItemLabel>
      <Show when={!props.isFile}>
        <TreeGroup class={styles.group}>
          <TreeBranchContext value={childBranch}>
            <TreeItems onResolve={setLastChild}>{props.children}</TreeItems>
          </TreeBranchContext>
        </TreeGroup>
      </Show>
    </TreeItem>
  );
}
