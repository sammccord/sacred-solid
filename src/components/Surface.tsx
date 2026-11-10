import { type JSX, splitProps } from "solid-js";
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
  const [local, rest] = splitProps(props, [
    "glow",
    "glowSize",
    "blur",
    "style",
    "aug",
    "theme",
    "class",
    "children",
  ]);

  const glowStyle = (): JSX.CSSProperties | undefined =>
    local.glow === undefined
      ? undefined
      : { filter: `drop-shadow(0 0 ${local.glowSize ?? "6px"} ${local.glow})` };

  const backdropStyle = (): JSX.CSSProperties | undefined =>
    local.blur === undefined
      ? undefined
      : {
          "backdrop-filter": `blur(${local.blur})`,
          "-webkit-backdrop-filter": `blur(${local.blur})`,
        };

  const shape = (): AugProps | undefined => {
    if (local.aug === undefined) return undefined;
    const [, clip] = splitProps(local.aug, ["border", "inlay"]);
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
          class={classNames(styles.surface, local.class)}
          {...rest}
          {...styleAttributes(local, local.style)}
        >
          {local.children}
        </div>
      </div>
    </div>
  );
}
