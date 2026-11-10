import { expect, test } from "vite-plus/test";
import {
  BREACH_SECONDS,
  buffer,
  initialBreach,
  phase,
  reduce,
  sequenceProgress,
  type Action,
} from "../playground/hacking/breach.ts";

const run = (actions: Action[]) => actions.reduce(reduce, initialBreach());

test("the cursor wraps around the matrix", () => {
  expect(run([{ type: "move", row: -1, col: -1 }]).cursor).toEqual({ row: 3, col: 3 });
  expect(run([{ type: "move", row: 4, col: 5 }]).cursor).toEqual({ row: 0, col: 1 });
});

test("pick pushes the code under the cursor into the buffer once per cell", () => {
  const breach = run([{ type: "pick" }, { type: "pick" }]);
  expect(buffer(breach)).toEqual(["E9"]);
  const hovered = reduce(breach, { type: "pick", cell: { row: 0, col: 3 } });
  expect(buffer(hovered)).toEqual(["E9", "1C"]);
  expect(hovered.cursor).toEqual({ row: 0, col: 3 });
});

test("sequence progress counts the longest matched prefix", () => {
  expect(sequenceProgress(["E9", "BD"])).toBe(0);
  expect(sequenceProgress(["E9", "1C"])).toBe(1);
  expect(sequenceProgress(["1C", "BD", "1C", "55"])).toBe(2);
});

test("matching the sequence uploads and stops the clock", () => {
  const done = run([
    { type: "pick", cell: { row: 0, col: 3 } },
    { type: "pick", cell: { row: 0, col: 2 } },
  ]);
  expect(phase(done)).toBe("uploaded");
  expect(reduce(done, { type: "tick", seconds: 5 })).toBe(done);
  expect(reduce(done, { type: "pick", cell: { row: 1, col: 0 } }).picked).toHaveLength(2);
});

test("time running out or a full buffer fails the breach", () => {
  expect(phase(run([{ type: "tick", seconds: BREACH_SECONDS + 1 }]))).toBe("failed");
  const full = run(
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 0],
    ].map(([row, col]) => ({ type: "pick" as const, cell: { row: row!, col: col! } })),
  );
  expect(phase(full)).toBe("failed");
});

test("tick never goes below zero and reset restores the start", () => {
  const spent = run([{ type: "tick", seconds: 99 }]);
  expect(spent.remaining).toBe(0);
  expect(reduce(spent, { type: "reset" })).toEqual(initialBreach());
});
