import type { JSX } from "@solidjs/web";
import { children as resolveChildren, Show, omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { type StyleProps, styleAttributes, type ThemeProps } from "../style/index.ts";
import { type ClassValue, classNames } from "../common/utilities.ts";
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
  const rest = omit(props, "class", "src", "style", "href", "target", "children", "aug", "theme");
  const resolved = resolveChildren(() => props.children);

  const className = (extra?: ClassValue) =>
    classNames(props.src ? styles.root : styles.placeholder, extra);
  const combinedStyle = (): JSX.CSSProperties => ({
    ...props.style,
    ...(props.src ? { "background-image": `url(${props.src})` } : {}),
  });

  const avatarElement = (own: StyleProps = {}, extra?: ClassValue) => (
    <Show
      when={props.href}
      fallback={<figure class={className(extra)} {...styleAttributes(own, combinedStyle())} />}
    >
      <a
        class={className(extra)}
        {...styleAttributes(own, combinedStyle())}
        href={props.href}
        target={props.target}
      />
    </Show>
  );

  return (
    <Show when={resolved()} fallback={avatarElement(props, props.class)}>
      <div class={classNames(styles.parent, props.class)} {...rest} {...styleAttributes(props)}>
        {avatarElement()}
        <span class={styles.right}>{resolved()}</span>
      </div>
    </Show>
  );
}
