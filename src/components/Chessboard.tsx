import { For } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { classNames } from "../common/utilities.ts";
import styles from "./Chessboard.module.css";

const FILE = ["A", "B", "C", "D", "E", "F", "G", "H"];
const RANK = [8, 7, 6, 5, 4, 3, 2, 1];

const PIECE_SYMBOLS: Record<string, string> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

const getPieceSymbol = (piece: string) => PIECE_SYMBOLS[piece] || "";

export interface ChessboardProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  board: string[][];
}

export function Chessboard(props: ChessboardProps) {
  return (
    <table class={classNames(styles.board, props.class)} {...styleAttributes(props)}>
      <tbody>
        <tr>
          <td class={styles.corner}></td>
          <For each={FILE}>{(file) => <td class={styles.cell}>{file}</td>}</For>
        </tr>
        <For each={RANK}>
          {(rank, rowIndex) => (
            <tr>
              <td class={styles.cell}>{rank}</td>
              <For each={FILE}>
                {(_, colIndex) => {
                  const isDark = () => (rowIndex() + colIndex()) % 2 === 0;
                  return (
                    <td class={classNames(styles.square, isDark() ? styles.dark : styles.light)}>
                      <span class={styles.symbol}>
                        {getPieceSymbol(props.board[rowIndex()][colIndex()])}
                      </span>
                    </td>
                  );
                }}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}
