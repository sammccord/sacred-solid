import { type JSX, children as resolveChildren, Show, splitProps } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { type StyleProps, styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames } from "../common/utilities.ts";
import styles from "./Avatar.module.css";

export interface AvatarProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "style" | "children"
> {
  src?: string;
  href?: string;
  target?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Avatar(props: AvatarProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "src",
    "style",
    "href",
    "target",
    "children",
    "aug",
    "theme",
  ]);
  const resolved = resolveChildren(() => local.children);

  const className = (extra?: string) =>
    classNames(local.src ? styles.root : styles.placeholder, extra);
  const combinedStyle = (): JSX.CSSProperties => ({
    ...local.style,
    ...(local.src ? { "background-image": `url(${local.src})` } : {}),
  });

  const avatarElement = (own: StyleProps = {}, extra?: string) => (
    <Show
      when={local.href}
      fallback={<figure class={className(extra)} {...styleAttributes(own, combinedStyle())} />}
    >
      <a
        class={className(extra)}
        {...styleAttributes(own, combinedStyle())}
        href={local.href}
        target={local.target}
        tabIndex={0}
        role="link"
      />
    </Show>
  );

  return (
    <Show when={resolved()} fallback={avatarElement(local, local.class)}>
      <div class={classNames(styles.parent, local.class)} {...rest} {...styleAttributes(local)}>
        {avatarElement()}
        <span class={styles.right}>{resolved()}</span>
      </div>
    </Show>
  );
}
