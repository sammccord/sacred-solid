import {
  For,
  batch,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { ActionButton } from "./ActionButton.tsx";
import styles from "./DOMSnake.module.css";
import { classNames } from "../common/utilities.ts";

export interface DOMSnakeProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  width?: number;
  height?: number;
  startSpeed?: number;
}

interface Position {
  x: number;
  y: number;
}

const DIRECTIONS: Record<string, Position> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

export function DOMSnake(props: DOMSnakeProps) {
  const gridWidth = () => props.width || 40;
  const gridHeight = () => props.height || 20;
  const startSpeed = () => props.startSpeed || 150;
  const initialSnake = (): Position[] => [
    { x: Math.floor(gridWidth() / 2), y: Math.floor(gridHeight() / 2) },
  ];

  const [snake, setSnake] = createSignal<Position[]>(initialSnake());
  const [food, setFood] = createSignal<Position | null>(null);
  const [direction, setDirection] = createSignal<Position>(DIRECTIONS.ArrowRight);
  const [isGameOver, setIsGameOver] = createSignal(false);
  const [speed, setSpeed] = createSignal(startSpeed());
  let nextDirection: Position = DIRECTIONS.ArrowRight;

  let gameContainer: HTMLDivElement | undefined;

  const cells = createMemo(() => Array.from({ length: gridWidth() * gridHeight() }, (_, i) => i));

  const checkCollision = ({ x, y }: Position): boolean =>
    x < 0 ||
    x >= gridWidth() ||
    y < 0 ||
    y >= gridHeight() ||
    snake().some((segment) => segment.x === x && segment.y === y);

  const generateFood = (): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridWidth()),
        y: Math.floor(Math.random() * gridHeight()),
      };
    } while (snake().some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const moveSnake = () => {
    batch(() => {
      setDirection(nextDirection);
      const current = snake();
      const newHead: Position = {
        x: current[0].x + nextDirection.x,
        y: current[0].y + nextDirection.y,
      };

      if (checkCollision(newHead)) {
        setIsGameOver(true);
        return;
      }

      const newSnake: Position[] = [newHead, ...current];
      const currentFood = food();
      if (currentFood && newHead.x === currentFood.x && newHead.y === currentFood.y) {
        setFood(generateFood());
        setSpeed((prev) => Math.max(prev - 5, 50));
      } else {
        newSnake.pop();
      }
      setSnake(newSnake);
    });
  };

  const restartGame = () => {
    batch(() => {
      const newFood = generateFood();
      setSnake(initialSnake());
      setFood(newFood);
      setDirection(DIRECTIONS.ArrowRight);
      setSpeed(startSpeed());
      nextDirection = DIRECTIONS.ArrowRight;
      setIsGameOver(false);
    });
  };

  const onHandleClick = (keyName: string) => {
    const next = DIRECTIONS[keyName];
    if (next && (next.x !== -direction().x || next.y !== -direction().y)) {
      nextDirection = next;
    }
  };

  onMount(() => {
    setFood(generateFood());
  });

  onMount(() => {
    if (gameContainer) {
      gameContainer.tabIndex = 0;
      gameContainer.focus();
    }
  });

  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!gameContainer?.contains(document.activeElement)) {
        gameContainer?.focus();
      }

      e.preventDefault();
      e.stopPropagation();

      const next = DIRECTIONS[e.key];
      if (next && (next.x !== -direction().x || next.y !== -direction().y)) {
        nextDirection = next;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown));
  });

  createEffect(() => {
    snake();
    if (isGameOver()) return;
    const interval = setInterval(moveSnake, speed());
    onCleanup(() => clearInterval(interval));
  });

  createEffect(on(isGameOver, restartGame));

  return (
    <div class={classNames(styles.container, props.class)} {...styleAttributes(props)}>
      <div>
        <ActionButton hotkey="↑" onClick={() => onHandleClick("ArrowUp")}>
          Up
        </ActionButton>
        <ActionButton hotkey="↓" onClick={() => onHandleClick("ArrowDown")}>
          Down
        </ActionButton>
        <ActionButton hotkey="←" onClick={() => onHandleClick("ArrowLeft")}>
          Left
        </ActionButton>
        <ActionButton hotkey="→" onClick={() => onHandleClick("ArrowRight")}>
          Right
        </ActionButton>
      </div>

      <div
        class={styles.grid}
        ref={(el) => (gameContainer = el)}
        style={{
          "grid-template-columns": `repeat(${gridWidth()}, 10px)`,
          "grid-template-rows": `repeat(${gridHeight()}, 20px)`,
        }}
      >
        <For each={cells()}>
          {(i) => {
            const x = () => i % gridWidth();
            const y = () => Math.floor(i / gridWidth());
            const isSnake = () => snake().some((segment) => segment.x === x() && segment.y === y());
            const isFood = () => {
              const f = food();
              return f ? f.x === x() && f.y === y() : false;
            };
            return (
              <div
                class={`${styles.cell} ${isSnake() ? styles.snake : ""} ${isFood() ? styles.food : ""}`}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
}
