export const SHARED_REGION_SUFFIXES = {
  size: "",
  size1: "1",
  size2: "2",
  width1: "1-width",
  height1: "1-height",
  width2: "2-width",
  height2: "2-height",
  inset1: "-inset1",
  extend1: "-extend1",
  clipmodX1: "1-clipmod-x",
  clipmodY1: "1-clipmod-y",
  clipmodX2: "2-clipmod-x",
  clipmodY2: "2-clipmod-y",
} as const;

export const CORNER_REGION_SUFFIXES = {
  ...SHARED_REGION_SUFFIXES,
  inset2: "-inset2",
  extend2: "-extend2",
} as const;

export const EDGE_REGION_SUFFIXES = {
  ...SHARED_REGION_SUFFIXES,
  center: "-center",
  offset: "-offset",
} as const;

export const ALL_SUFFIXES = { width: "-width", height: "-height" } as const;

export const SURFACE_SUFFIXES = {
  all: "-all",
  x: "-x",
  y: "-y",
  top: "-top",
  right: "-right",
  bottom: "-bottom",
  left: "-left",
  bg: "-bg",
  opacity: "-opacity",
} as const;

export type Suffixes = Readonly<Record<string, string>>;
