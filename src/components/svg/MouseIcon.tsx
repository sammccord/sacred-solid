import type { JSX } from "@solidjs/web";
import {} from "solid-js";

export type MouseButton = "left" | "right" | "wheel";

export interface MouseIconProps {
  class?: string;
  button?: MouseButton;
  size?: number;
  style?: JSX.CSSProperties;
}

const FILLED: Record<MouseButton, string> = {
  left: "M2 11V8a6 6 0 0 1 6-6h3v9z",
  right: "M13 2h3a6 6 0 0 1 6 6v3h-9z",
  wheel: "M10 5h4v5h-4z",
};

export function MouseIcon(props: MouseIconProps) {
  const height = () => props.size ?? 30;

  return (
    <svg
      class={props.class}
      viewBox="0 0 24 32"
      height={height()}
      width={(height() * 24) / 32}
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      style={props.style}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="28" rx="9" />
      <path d="M2 12h20M12 2v10" stroke-width="1.5" />
      <path d={FILLED[props.button ?? "left"]} fill="currentColor" stroke="none" />
    </svg>
  );
}
