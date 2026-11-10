import type { JSX } from "solid-js";
import { collectAug } from "../aug/collect.ts";
import type { AugProps } from "../aug/index.ts";
import { type ThemeCssVar, type ThemeTokenKey, themeTokens } from "../theme/tokens.ts";

export type ThemeProps = { [K in ThemeTokenKey]?: string };

export interface StyleProps {
  aug?: AugProps;
  theme?: ThemeProps;
}

export interface StyleAttributes {
  "data-augmented-ui"?: string;
  "data-aug-border"?: "";
  "data-aug-inlay"?: "";
  style?: JSX.CSSProperties | string;
}

type Vars = Record<`--${string}`, string>;

const INK_COLOR = "var(--theme-ink)";
const INK_COLOR_DECLARATION = `color:${INK_COLOR}`;

const THEME_VAR_BY_KEY: ReadonlyMap<string, ThemeCssVar> = new Map(
  themeTokens.map((token) => [token.key, `--theme-${token.name}` as const]),
);

function themeVars(theme: ThemeProps): Vars {
  const vars: Vars = {};
  for (const [key, value] of Object.entries(theme)) {
    const name = THEME_VAR_BY_KEY.get(key);
    if (name !== undefined && value !== undefined) vars[name] = value;
  }
  return vars;
}

function mergeStyle(
  vars: Vars,
  style: JSX.CSSProperties | string | undefined,
  recolor: boolean,
): JSX.CSSProperties | string | undefined {
  const entries = Object.entries(vars);
  if (entries.length === 0) return style;
  if (typeof style === "string") {
    const declarations = [
      ...entries.map(([name, value]) => `${name}:${value}`),
      ...(recolor ? [INK_COLOR_DECLARATION] : []),
    ].join(";");
    const rest = style.replace(/[\s;]+$/, "").trim();
    return rest === "" ? declarations : `${declarations};${rest}`;
  }
  return { ...vars, ...(recolor && { color: INK_COLOR }), ...style };
}

export function styleAttributes(
  props: StyleProps,
  style?: JSX.CSSProperties | string,
): StyleAttributes {
  const aug = props.aug === undefined ? undefined : collectAug(props.aug);
  const merged = mergeStyle(
    { ...aug?.vars, ...(props.theme === undefined ? undefined : themeVars(props.theme)) },
    style,
    props.theme?.ink !== undefined,
  );
  return {
    ...(aug !== undefined &&
      aug.tokens.length > 0 && { "data-augmented-ui": aug.tokens.join(" ") }),
    ...(props.aug?.border !== undefined && { "data-aug-border": "" }),
    ...(props.aug?.inlay !== undefined && { "data-aug-inlay": "" }),
    ...(merged !== undefined && { style: merged }),
  };
}
