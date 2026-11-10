import {
  ALL_SUFFIXES,
  CORNER_REGION_SUFFIXES,
  EDGE_REGION_SUFFIXES,
  SURFACE_SUFFIXES,
  type Suffixes,
} from "./suffixes.ts";
import { AUG_ALL_MIXINS, AUG_REGION_MIXINS, AUG_REGIONS } from "./mixins.generated.ts";

export type AugRegion = (typeof AUG_REGIONS)[number];
export type AugCornerRegion = "tl" | "tr" | "br" | "bl";
export type AugEdgeRegion = Exclude<AugRegion, AugCornerRegion>;
export type AugRegionMixin<R extends AugRegion> = (typeof AUG_REGION_MIXINS)[R][number];
export type AugAllMixin = (typeof AUG_ALL_MIXINS)[number];

type OptionsOf<S extends Suffixes> = {
  [K in keyof S]?: K extends `clipmod${string}` | "opacity" ? number | string : string;
};

export type AugCornerOptions = OptionsOf<typeof CORNER_REGION_SUFFIXES>;
export type AugEdgeOptions = OptionsOf<typeof EDGE_REGION_SUFFIXES>;

export type AugRegionOptions<R extends AugRegion> = {
  mixin: AugRegionMixin<R>;
} & (R extends AugCornerRegion ? AugCornerOptions : AugEdgeOptions);

export type AugRegionValue<R extends AugRegion> = AugRegionMixin<R> | AugRegionOptions<R>;

export type AugAllValue = AugAllMixin | ({ mixin: AugAllMixin } & OptionsOf<typeof ALL_SUFFIXES>);

export type AugSurfaceOptions = OptionsOf<typeof SURFACE_SUFFIXES>;
export type AugBorderOptions = AugSurfaceOptions;
export type AugInlayOptions = AugSurfaceOptions;
export type AugBorderValue = true | string | AugBorderOptions;
export type AugInlayValue = true | string | AugInlayOptions;

export type AugProps = {
  [R in AugRegion]?: AugRegionValue<R>;
} & {
  all?: AugAllValue;
  border?: AugBorderValue;
  inlay?: AugInlayValue;
};
