import { type JSX, Index, createMemo } from "solid-js";

export interface SphereProps {
  class?: string;
  size?: number;
  segments?: number;
  style?: JSX.CSSProperties;
}

interface Point {
  x: number;
  y: number;
}

function generateSpherePoints(size: number, segments: number): Point[][] {
  const radius = size * 0.4;
  const points: Point[][] = [];
  for (let lat = 0; lat <= segments; lat++) {
    const row: Point[] = [];
    const phi = (lat * Math.PI) / segments;
    for (let lon = 0; lon <= segments; lon++) {
      const theta = (lon * 2 * Math.PI) / segments;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const scale = 1 + z / (radius * 4);
      row.push({
        x: size / 2 + x * scale,
        y: size / 2 + y * scale,
      });
    }
    points.push(row);
  }
  return points;
}

function createPaths(size: number, segments: number): string[] {
  const spherePoints = generateSpherePoints(size, segments);
  const paths: string[] = [];
  for (let lat = 0; lat <= segments; lat++) {
    let pathString = `M ${spherePoints[lat][0].x},${spherePoints[lat][0].y}`;
    for (let lon = 1; lon <= segments; lon++) {
      pathString += ` L ${spherePoints[lat][lon].x},${spherePoints[lat][lon].y}`;
    }
    paths.push(pathString);
  }
  for (let lon = 0; lon <= segments; lon++) {
    let pathString = `M ${spherePoints[0][lon].x},${spherePoints[0][lon].y}`;
    for (let lat = 1; lat <= segments; lat++) {
      pathString += ` L ${spherePoints[lat][lon].x},${spherePoints[lat][lon].y}`;
    }
    paths.push(pathString);
  }
  return paths;
}

export function Sphere(props: SphereProps) {
  const size = () => props.size || 500;
  const paths = createMemo(() => createPaths(size(), props.segments || 6));

  return (
    <svg
      class={props.class}
      viewBox={`0 0 ${size()} ${size()}`}
      xmlns="http://www.w3.org/2000/svg"
      style={props.style}
    >
      <g fill="none" stroke="currentColor" stroke-width="1">
        <Index each={paths()}>
          {(path) => <path d={path()} vector-effect="non-scaling-stroke" />}
        </Index>
      </g>
    </svg>
  );
}
