import { type JSX, Index, splitProps } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { leftPad } from "../common/utilities.ts";
import styles from "./CodeBlock.module.css";
import { classNames } from "../common/utilities.ts";

export interface CodeBlockProps extends Omit<JSX.HTMLAttributes<HTMLPreElement>, "children"> {
  children?: string;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function CodeBlock(props: CodeBlockProps) {
  const [local, rest] = splitProps(props, ["class", "aug", "theme", "children", "ref"]);
  const lines = () => String(local.children).split("\n");

  return (
    <pre
      class={classNames(styles.root, local.class)}
      ref={local.ref}
      {...rest}
      {...styleAttributes(local, rest.style)}
    >
      <Index each={lines()}>
        {(line, index) => (
          <div class={styles.line}>
            <span class={styles.number}>{leftPad(String(index + 1), 3)}</span>
            <span class={styles.content}>{line()}</span>
          </div>
        )}
      </Index>
    </pre>
  );
}
