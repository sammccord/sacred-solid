import type { JSX } from "@solidjs/web";
import { type Accessor, createContext, createSignal, onSettled, useContext } from "solid-js";
import css from "./hud.module.css";

export interface Point {
  x: number;
  y: number;
}

interface StageContext {
  pointer: Accessor<Point>;
}

const StageContext = createContext<StageContext>();

export function useStage(): StageContext {
  return useContext(StageContext);
}

export interface StageProps {
  width?: number;
  height?: number;
  pointer?: Point;
  children?: JSX.Element;
}

export function Stage(props: StageProps) {
  const width = () => props.width ?? 1920;
  const height = () => props.height ?? 1080;
  const [scale, setScale] = createSignal(1);
  const [pointer, setPointer] = createSignal(props.pointer ?? { x: width() / 2, y: height() / 2 });
  const [viewport, setViewport] = createSignal({ width: width(), height: height() });
  let stageRef = undefined as HTMLDivElement | undefined;

  const fit = () => {
    setViewport({ width: window.innerWidth, height: window.innerHeight });
    setScale(Math.min(window.innerWidth / width(), window.innerHeight / height()));
  };

  onSettled(() => {
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  });

  const track = (event: MouseEvent) => {
    const rect = stageRef!.getBoundingClientRect();
    setPointer({
      x: (event.clientX - rect.left) / scale(),
      y: (event.clientY - rect.top) / scale(),
    });
  };

  return (
    <div class={css.viewport}>
      <div
        ref={stageRef}
        class={css.stage}
        style={{
          width: `${width()}px`,
          height: `${height()}px`,
          left: `${(viewport().width - width() * scale()) / 2}px`,
          top: `${(viewport().height - height() * scale()) / 2}px`,
          transform: `scale(${scale()})`,
        }}
        onMouseMove={track}
      >
        <StageContext value={{ pointer }}>{props.children}</StageContext>
      </div>
    </div>
  );
}
