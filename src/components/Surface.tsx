import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { classNames } from "../common/utilities.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import styles from "./Surface.module.css";

export interface SurfaceProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> {
  glow?: string;
  glowSize?: string;
  blur?: string;
  style?: JSX.CSSProperties;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function Surface(props: SurfaceProps) {
  const rest = omit(
    props,
    "glow",
    "glowSize",
    "blur",
    "style",
    "aug",
    "theme",
    "class",
    "children",
  );

  const glowStyle = (): JSX.CSSProperties | undefined =>
    props.glow === undefined
      ? undefined
      : { filter: `drop-shadow(0 0 ${props.glowSize ?? "6px"} ${props.glow})` };

  const backdropStyle = (): JSX.CSSProperties | undefined =>
    props.blur === undefined
      ? undefined
      : {
          "backdrop-filter": `blur(${props.blur})`,
          "-webkit-backdrop-filter": `blur(${props.blur})`,
        };

  const shape = (): AugProps | undefined => {
    if (props.aug === undefined) return undefined;
    const clip = omit(props.aug, "border", "inlay");
    return clip;
  };

  return (
    <div class={styles.root}>
      <div
        class={styles.backdrop}
        aria-hidden="true"
        {...styleAttributes({ aug: shape() }, backdropStyle())}
      />
      <div class={styles.glow} style={glowStyle()}>
        <div
          class={classNames(styles.surface, props.class)}
          {...rest}
          {...styleAttributes(props, props.style)}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
