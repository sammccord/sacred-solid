import { For, Show } from "solid-js";

function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function Barcode(props: { seed: number; width: number; height: number; dense?: boolean }) {
  const next = () => seeded(props.seed);
  const cells = () => {
    const random = next();
    const out: { x: number; y: number }[] = [];
    for (let x = 0; x < props.width; x += 2) {
      for (let y = 0; y < props.height; y += 2) {
        if (random() > 0.45) out.push({ x, y });
      }
    }
    return out;
  };
  const bars = () => {
    const random = next();
    const out: { x: number; w: number; h: number }[] = [];
    let x = 0;
    while (x < props.width) {
      const w = 1 + Math.floor(random() * 3);
      if (random() > 0.35) out.push({ x, w, h: props.height * (0.45 + random() * 0.55) });
      x += w + Math.floor(random() * 3);
    }
    return out;
  };
  return (
    <svg width={props.width} height={props.height} fill="currentColor" aria-hidden="true">
      <Show
        when={props.dense}
        fallback={
          <For each={bars()}>{(bar) => <rect x={bar.x} y={0} width={bar.w} height={bar.h} />}</For>
        }
      >
        <For each={cells()}>{(cell) => <rect x={cell.x} y={cell.y} width={2} height={2} />}</For>
      </Show>
    </svg>
  );
}

export function MatrixIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor" aria-hidden="true">
      <path d="M2 2h6l4 8v-8h4l4 10v-10h6v24h-6l-4-10v10h-4l-4-10v10h-6z" />
      <path d="M0 14h28v3h-28z" fill="var(--theme-surface-inverse)" />
    </svg>
  );
}

export function SequenceIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="24"
        height="11"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <text x="13" y="9.5" text-anchor="middle" font-size="8" fill="currentColor">
        A 551
      </text>
      <circle cx="8" cy="19" r="4" fill="currentColor" />
      <circle cx="18" cy="19" r="4" fill="currentColor" />
    </svg>
  );
}

export function DatamineIcon() {
  return (
    <svg width="60" height="72" viewBox="0 0 60 72" aria-hidden="true">
      <g fill="currentColor">
        <rect x="26" y="2" width="4" height="4" />
        <rect x="30" y="8" width="4" height="4" />
        <rect x="26" y="14" width="4" height="4" />
        <rect x="30" y="20" width="4" height="4" />
        <path d="M2 34l14-10h6l8 8 8-8h6l14 10-28 24z" />
      </g>
      <path d="M27 28h6v14h6l-9 9-9-9h6z" fill="var(--theme-ink-inverse)" />
      <text x="30" y="70" text-anchor="middle" font-size="7" fill="currentColor">
        B9V_91A
      </text>
    </svg>
  );
}
