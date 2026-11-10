import { For, type JSX } from "solid-js";
import css from "./hud.module.css";
import { useStage } from "./Stage.tsx";

export function box(x: number, y: number, w?: number, h?: number): JSX.CSSProperties {
  return {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    ...(w === undefined ? undefined : { width: `${w}px` }),
    ...(h === undefined ? undefined : { height: `${h}px` }),
  };
}

export function Micro(props: { x?: number; y?: number; lines: string[] }) {
  return (
    <div
      style={props.x === undefined || props.y === undefined ? undefined : box(props.x, props.y)}
      class={css.micro}
      data-micro=""
      aria-hidden="true"
    >
      <For each={props.lines}>{(line) => <div>{line}</div>}</For>
    </div>
  );
}

export function DotGrid() {
  return <div class={css.dotGrid} />;
}

export function CursorSquare() {
  const stage = useStage();
  return (
    <div
      class={css.cursor}
      style={box(stage.pointer().x - 19, stage.pointer().y - 19)}
      aria-hidden="true"
    />
  );
}

export function HintBar(props: {
  x: number;
  y: number;
  gap?: number;
  size?: number;
  children?: JSX.Element;
}) {
  return (
    <div
      class={css.keys}
      style={{
        ...box(props.x, props.y),
        gap: `${props.gap ?? 30}px`,
        "font-size": `${props.size ?? 16}px`,
      }}
    >
      {props.children}
    </div>
  );
}
