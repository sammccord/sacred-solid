export const CODES = ["E9", "BD", "55", "1C"] as const;
export type Code = (typeof CODES)[number];

export const MATRIX: readonly (readonly Code[])[] = [
  ["E9", "BD", "55", "1C"],
  ["E9", "1C", "BD", "BD"],
  ["1C", "BD", "55", "E9"],
  ["55", "E9", "1C", "BD"],
];

export const SEQUENCE: readonly Code[] = ["1C", "55"];
export const BUFFER_SIZE = 5;
export const BREACH_SECONDS = 45;

export interface Cell {
  row: number;
  col: number;
}

export type Phase = "running" | "uploaded" | "failed";

export interface Breach {
  cursor: Cell;
  picked: readonly Cell[];
  remaining: number;
}

export type Action =
  | { type: "move"; row: number; col: number }
  | { type: "hover"; cell: Cell }
  | { type: "pick"; cell?: Cell }
  | { type: "tick"; seconds: number }
  | { type: "reset" };

export const initialBreach = (): Breach => ({
  cursor: { row: 0, col: 0 },
  picked: [],
  remaining: BREACH_SECONDS,
});

const SIZE = MATRIX.length;
const wrap = (value: number) => (value + SIZE) % SIZE;
const sameCell = (a: Cell, b: Cell) => a.row === b.row && a.col === b.col;

export const codeAt = (cell: Cell): Code => MATRIX[cell.row]![cell.col]!;
export const isPicked = (breach: Breach, cell: Cell) =>
  breach.picked.some((other) => sameCell(other, cell));
export const buffer = (breach: Breach): Code[] => breach.picked.map(codeAt);

export function sequenceProgress(codes: readonly Code[]): number {
  let best = 0;
  for (let start = 0; start < codes.length; start++) {
    let length = 0;
    while (
      length < SEQUENCE.length &&
      start + length < codes.length &&
      codes[start + length] === SEQUENCE[length]
    ) {
      length++;
    }
    best = Math.max(best, length);
  }
  return best;
}

export function phase(breach: Breach): Phase {
  if (sequenceProgress(buffer(breach)) === SEQUENCE.length) return "uploaded";
  if (breach.remaining <= 0 || breach.picked.length >= BUFFER_SIZE) return "failed";
  return "running";
}

export function reduce(breach: Breach, action: Action): Breach {
  switch (action.type) {
    case "reset":
      return initialBreach();
    case "tick":
      return phase(breach) === "running"
        ? { ...breach, remaining: Math.max(0, breach.remaining - action.seconds) }
        : breach;
    case "move":
      return {
        ...breach,
        cursor: {
          row: wrap(breach.cursor.row + action.row),
          col: wrap(breach.cursor.col + action.col),
        },
      };
    case "hover":
      return { ...breach, cursor: action.cell };
    case "pick": {
      const cell = action.cell ?? breach.cursor;
      if (phase(breach) !== "running" || isPicked(breach, cell)) {
        return action.cell === undefined ? breach : { ...breach, cursor: cell };
      }
      return { ...breach, cursor: cell, picked: [...breach.picked, cell] };
    }
  }
}
