export const themeTokens = [
  { group: "ink", name: "ink", key: "ink", scope: "theme" },
  { group: "ink", name: "ink-inverse", key: "inkInverse", scope: "theme" },
  { group: "ink", name: "ink-subdued", key: "inkSubdued", scope: "theme" },
  { group: "surface", name: "surface-page", key: "surfacePage", scope: "theme" },
  { group: "surface", name: "surface-input", key: "surfaceInput", scope: "theme" },
  { group: "surface", name: "surface-panel", key: "surfacePanel", scope: "theme" },
  { group: "surface", name: "surface-panel-footer", key: "surfacePanelFooter", scope: "theme" },
  { group: "surface", name: "surface-window", key: "surfaceWindow", scope: "theme" },
  { group: "surface", name: "surface-float", key: "surfaceFloat", scope: "theme" },
  { group: "surface", name: "surface-chip", key: "surfaceChip", scope: "theme" },
  { group: "surface", name: "surface-inverse", key: "surfaceInverse", scope: "theme" },
  { group: "surface", name: "surface-subdued", key: "surfaceSubdued", scope: "theme" },
  { group: "surface", name: "surface-sunken", key: "surfaceSunken", scope: "theme" },
  { group: "line", name: "line-strong", key: "lineStrong", scope: "theme" },
  { group: "line", name: "line", key: "line", scope: "theme" },
  { group: "line", name: "line-subdued", key: "lineSubdued", scope: "theme" },
  { group: "line", name: "line-width-strong", key: "lineWidthStrong", scope: "constant" },
  { group: "line", name: "line-width", key: "lineWidth", scope: "constant" },
  { group: "line", name: "line-width-double", key: "lineWidthDouble", scope: "constant" },
  { group: "accent", name: "accent", key: "accent", scope: "theme" },
  { group: "accent", name: "accent-subdued", key: "accentSubdued", scope: "theme" },
  { group: "control", name: "control", key: "control", scope: "theme" },
  { group: "control", name: "control-ink", key: "controlInk", scope: "theme" },
  { group: "control", name: "control-foreground", key: "controlForeground", scope: "theme" },
  { group: "control", name: "control-background", key: "controlBackground", scope: "theme" },
  {
    group: "shadow",
    name: "shadow-window-geometry",
    key: "shadowWindowGeometry",
    scope: "constant",
  },
  { group: "shadow", name: "shadow-window-color", key: "shadowWindowColor", scope: "theme" },
  { group: "shadow", name: "shadow-float-geometry", key: "shadowFloatGeometry", scope: "constant" },
  { group: "shadow", name: "shadow-float-color", key: "shadowFloatColor", scope: "theme" },
  {
    group: "shadow",
    name: "shadow-tooltip-geometry",
    key: "shadowTooltipGeometry",
    scope: "constant",
  },
  { group: "shadow", name: "shadow-tooltip-color", key: "shadowTooltipColor", scope: "theme" },
  { group: "shadow", name: "shadow-ring-geometry", key: "shadowRingGeometry", scope: "constant" },
  { group: "shadow", name: "shadow-ring-color", key: "shadowRingColor", scope: "theme" },
] as const;

export type ThemeToken = (typeof themeTokens)[number];
export type ThemeGroup = ThemeToken["group"];
export type ThemeTokenName = ThemeToken["name"];
export type ThemeTokenKey = ThemeToken["key"];
export type ThemeTokenScope = ThemeToken["scope"];
export type ThemeTokensIn<G extends ThemeGroup> = Extract<ThemeToken, { group: G }>;
export type ThemeCssVar<N extends ThemeTokenName = ThemeTokenName> = `--theme-${N}`;
