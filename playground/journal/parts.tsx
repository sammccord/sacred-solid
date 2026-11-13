import type { JSX } from "@solidjs/web";
import { Avatar } from "../../src/components/Avatar.tsx";
import type { Emblem } from "./quests.ts";
import css from "./journal.module.css";

const SVG = {
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 1.6,
  "aria-hidden": "true",
} as const;

export const TAB_ICONS: Record<string, () => JSX.Element> = {
  map: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" {...SVG}>
      <path d="M11 1.5l9.5 9.5-9.5 9.5L1.5 11z" />
      <path d="M11 6l3 5-3 5-3-5z" fill="currentColor" />
    </svg>
  ),
  character: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" {...SVG}>
      <path d="M11 1.5l8 4v10l-8 5-8-5v-10z" />
      <circle cx="11" cy="8" r="2.4" fill="currentColor" />
      <path d="M7 16c0-3 1.6-4.5 4-4.5s4 1.500 4 4.500" />
    </svg>
  ),
  journal: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" {...SVG}>
      <rect x="1.500" y="1.500" width="19" height="19" />
      <path d="M5 6h3M10 6h7M5 10h3M10 10h7M5 14h3M10 14h7" />
    </svg>
  ),
  crafting: () => (
    <svg width="24" height="22" viewBox="0 0 24 22" {...SVG}>
      <path d="M7 2h10l5.500 9L17 20H7L1.500 11z" />
      <path d="M8 9h8M8 13h8" />
    </svg>
  ),
  inventory: () => (
    <svg width="22" height="22" viewBox="0 0 22 22" {...SVG}>
      <path d="M11 1l10 10-10 10L1 11z" />
      <path d="M11 6l5 5-5 5-5-5z" />
    </svg>
  ),
};

export function WeightIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true">
      <path d="M7 6a4 4 0 0 1 8 0h3l3 15H1L4 6z" />
      <circle cx="11" cy="6" r="1.800" fill="var(--theme-surface-page)" />
    </svg>
  );
}

export function WarningIcon() {
  return (
    <svg width="24" height="22" viewBox="0 0 24 22" aria-hidden="true">
      <path d="M2 2h20v13l-5 5H2z" fill="currentColor" />
      <path d="M12 6v6M12 14.500v2" stroke="var(--theme-surface-page)" stroke-width="2.200" />
    </svg>
  );
}

export function TagIcon() {
  return (
    <svg class={css.tag} width="38" height="66" viewBox="0 0 38 66" aria-hidden="true">
      <path
        d="M4 8 30 2l5 5v47l-5 4-26 6z"
        fill="color-mix(in srgb, var(--theme-ink) 20%, transparent)"
        stroke="var(--theme-ink)"
        stroke-width="2"
      />
      <path d="M9 18l16-4M9 48l16-4" stroke="var(--theme-ink)" stroke-width="1.500" />
      <circle cx="17" cy="33" r="7" fill="none" stroke="var(--theme-ink)" stroke-width="3" />
      <path d="M14 33h6" stroke="var(--theme-ink)" stroke-width="3" />
    </svg>
  );
}

export function CabIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.700"
      aria-hidden="true"
    >
      <rect x="2" y="5" width="12" height="12" />
      <path d="M6 2h12v12M9 11l8-8M12 3h5v5" />
    </svg>
  );
}

const DIAMOND = "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)";

export function Emblems(props: { emblem: Emblem }) {
  return (
    <Avatar
      class={css.emblem}
      style={
        props.emblem.shape === "diamond"
          ? { background: props.emblem.fill, "clip-path": DIAMOND }
          : {
              background: props.emblem.fill,
              "box-shadow": `inset 0 0 0 2px ${props.emblem.edge}`,
            }
      }
    />
  );
}

export function MapThumb() {
  return <div class={css.map} aria-hidden="true" />;
}
