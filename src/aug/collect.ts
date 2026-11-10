import "augmented-ui/augmented-ui.min.css";
import "./aug.css";
import type {
  AugAllValue,
  AugBorderValue,
  AugInlayValue,
  AugProps,
  AugRegion,
  AugRegionValue,
} from "./index.ts";
import { AUG_REGIONS } from "./mixins.generated.ts";
import {
  ALL_SUFFIXES,
  CORNER_REGION_SUFFIXES,
  EDGE_REGION_SUFFIXES,
  SURFACE_SUFFIXES,
  type Suffixes,
} from "./suffixes.ts";

type AugVars = Record<`--aug-${string}`, string>;

interface Collected {
  tokens: string[];
  vars: AugVars;
}

export const CORNER_REGIONS: readonly AugRegion[] = ["tl", "tr", "br", "bl"];

function optionVars(prefix: `--aug-${string}`, suffixes: Suffixes, options: object): AugVars {
  const vars: AugVars = {};
  for (const [key, value] of Object.entries(options)) {
    const suffix = suffixes[key];
    if (suffix !== undefined && value !== undefined) vars[`${prefix}${suffix}`] = String(value);
  }
  return vars;
}

function regionSuffixes(region: AugRegion): Suffixes {
  return CORNER_REGIONS.includes(region) ? CORNER_REGION_SUFFIXES : EDGE_REGION_SUFFIXES;
}

function collectRegion(region: AugRegion, value: AugRegionValue<AugRegion>): Collected {
  if (typeof value === "string") return { tokens: [`${region}-${value}`], vars: {} };
  return {
    tokens: [`${region}-${value.mixin}`],
    vars: optionVars(`--aug-${region}`, regionSuffixes(region), value),
  };
}

function collectAll(value: AugAllValue): Collected {
  if (typeof value === "string") return { tokens: [`all-${value}`], vars: {} };
  return { tokens: [`all-${value.mixin}`], vars: optionVars("--aug-all", ALL_SUFFIXES, value) };
}

function collectSurface(
  surface: "border" | "inlay",
  value: AugBorderValue | AugInlayValue,
): Collected {
  if (value === true) return { tokens: [surface], vars: {} };
  const options = typeof value === "string" ? { all: value } : value;
  return { tokens: [surface], vars: optionVars(`--aug-${surface}`, SURFACE_SUFFIXES, options) };
}

export function collectAug(aug: AugProps): Collected {
  const parts: Collected[] = [];
  if (aug.all !== undefined) parts.push(collectAll(aug.all));
  for (const region of AUG_REGIONS) {
    const value = aug[region];
    if (value !== undefined) parts.push(collectRegion(region, value));
  }
  if (aug.border !== undefined) parts.push(collectSurface("border", aug.border));
  if (aug.inlay !== undefined) parts.push(collectSurface("inlay", aug.inlay));
  const vars: AugVars = {};
  for (const part of parts) Object.assign(vars, part.vars);
  return { tokens: parts.flatMap((part) => part.tokens), vars };
}
