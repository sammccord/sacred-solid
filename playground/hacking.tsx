import "../src/styles/global-fonts.css";
import "../src/styles/global.css";
import "../src/themes/acid.css";

import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { render } from "solid-js/web";
import { Badge } from "../src/components/Badge.tsx";
import { BarProgress } from "../src/components/BarProgress.tsx";
import { KeyHint } from "../src/components/KeyHint.tsx";
import { Panel } from "../src/components/Panel.tsx";
import { MouseIcon } from "../src/components/svg/MouseIcon.tsx";
import { Sphere } from "../src/components/svg/Sphere.tsx";
import { Table } from "../src/components/Table.tsx";
import { TableColumn } from "../src/components/TableColumn.tsx";
import { TableRow } from "../src/components/TableRow.tsx";
import { Text } from "../src/components/Text.tsx";
import {
  BREACH_SECONDS,
  BUFFER_SIZE,
  buffer,
  initialBreach,
  isPicked,
  MATRIX,
  phase,
  reduce,
  SEQUENCE,
  sequenceProgress,
  type Action,
  type Breach,
  type Cell,
} from "./hacking/breach.ts";
import css from "./hacking/hacking.module.css";
import { Barcode, DatamineIcon, MatrixIcon, SequenceIcon } from "./hacking/parts.tsx";
import { useKeymap } from "./hud/keymap.ts";
import { box, CursorSquare, DotGrid, HintBar, Micro } from "./hud/parts.tsx";
import { Stage } from "./hud/Stage.tsx";

const PAUSED = new URLSearchParams(location.search).has("paused");

const HASH = "DOCUMENT/D/1ILJTZLABKETJGHXCDQOTCIHWMIZ6ZZ7V8TDESD900";
const NOTICE = "CUSTOM GLITCHES ON UI MAY APPEAR, BASED ON THIS ANALYSIS.";

const STATUS = {
  running: "BREACH IN PROGRESS",
  uploaded: "UPLOAD COMPLETE",
  failed: "BREACH FAILED",
} as const;

const FAINT_LEFT = Array.from(
  { length: 6 },
  (_, i) =>
    [
      "BB E9 BD 1C 55 E9",
      "AD 55 55 1C E9 BD",
      "91 BD E9 E9 1C 55",
      "B0 1C BD 55 E9 E9",
      "91 55 1C BD E9 55",
    ][i % 5],
).join("\n");

function Hacking() {
  const [breach, setBreach] = createSignal<Breach>(initialBreach());
  const [note, setNote] = createSignal("");

  const dispatch = (action: Action) => setBreach((state) => reduce(state, action));
  const codes = createMemo(() => buffer(breach()));
  const progress = createMemo(() => sequenceProgress(codes()));
  const current = createMemo(() => phase(breach()));

  const reset = () => {
    dispatch({ type: "reset" });
    setNote("");
  };

  useKeymap({
    ArrowUp: () => dispatch({ type: "move", row: -1, col: 0 }),
    ArrowDown: () => dispatch({ type: "move", row: 1, col: 0 }),
    ArrowLeft: () => dispatch({ type: "move", row: 0, col: -1 }),
    ArrowRight: () => dispatch({ type: "move", row: 0, col: 1 }),
    Enter: () => dispatch({ type: "pick" }),
    f: () => dispatch({ type: "pick" }),
    c: () => reset(),
    Escape: () => reset(),
    h: () => setNote((value) => (value === "" ? "ARROWS MOVE, ENTER OR F PICKS, C RESETS" : "")),
  });

  onMount(() => {
    if (PAUSED) return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      dispatch({ type: "tick", seconds: (now - last) / 1000 });
      last = now;
    }, 50);
    onCleanup(() => clearInterval(timer));
  });

  const cellProps = (cell: Cell) => ({
    "data-cursor":
      breach().cursor.row === cell.row && breach().cursor.col === cell.col ? "" : undefined,
    "data-picked": isPicked(breach(), cell) ? "" : undefined,
    onMouseEnter: () => dispatch({ type: "hover", cell }),
    onClick: () => dispatch({ type: "pick", cell }),
  });

  return (
    <Stage pointer={{ x: 952, y: 621 }}>
      <DotGrid />
      <div class={css.vignette} />
      <div class={css.faint} style={box(690, 770)}>
        {FAINT_LEFT}
      </div>
      <div class={css.faint} style={box(1230, 745)}>
        {FAINT_LEFT}
      </div>

      <div class={css.scan} />
      <div class={css.frame} style={box(125, 113, 1670, 817)} />
      <div class={css.line} style={{ ...box(141, 113, 1, 817) }} />
      <div class={css.line} style={{ ...box(155, 113, 1, 817) }} />
      <div class={css.line} style={{ ...box(1737, 113, 1, 817) }} />
      <div class={css.line} style={{ ...box(1762, 113, 1, 817) }} />
      <div class={css.line} style={box(1777, 113, 1, 862)} />
      <div class={`${css.tick}`} style={box(1229, 976, 8, 8)} />
      <div class={css.tick} style={box(1362, 982, 100, 3)} />
      <Micro x={1238} y={976} lines={["000.00"]} />
      <Micro x={1475} y={976} lines={["MIRRORING INS FROM SERV. 030841.5452.234"]} />
      <div class={css.line} style={box(125, 975, 1670, 2)} />
      <div class={`${css.line} ${css.lineStrong}`} style={box(1804, 138, 3, 150)} />
      <div class={`${css.line} ${css.lineStrong}`} style={box(1804, 728, 3, 24)} />
      <div class={`${css.line} ${css.lineStrong}`} style={box(121, 290, 3, 200)} />
      <div class={css.line} style={box(124, 870, 48, 1)} />
      <div class={css.line} style={box(170, 870, 1, 105)} />

      <div class={css.dots} style={box(515, 38)}>
        <For each={Array.from({ length: 36 })}>{() => <i />}</For>
      </div>

      <div class={css.wordmark} style={box(38, 50)}>
        NET
        <i />
        TECH
      </div>
      <Sphere size={64} segments={7} style={{ ...box(32, 90, 64, 64), opacity: 0.7 }} />

      <Badge class={css.strip} style={box(830, 38, 800, 30)}>
        <Micro
          x={6}
          y={21}
          lines={["ONLY CCSS CERTIFIED AND CHIEF 5TH CLASS OFFICERS ARE ALLOWED TO MANIPULATE"]}
        />
        <span class={css.stripTitle}>BREACH PROTOCOL INTERFACE</span>
        <span class={css.stripSerial}>EKUMER 62UZ-FFLH-9YLT-E3Z7</span>
      </Badge>
      <div style={{ ...box(1633, 38), color: "var(--theme-ink)" }}>
        <Barcode seed={7} width={124} height={19} dense />
      </div>
      <Micro x={1632} y={58} lines={["ABBC 4550 2551 5461 5450"]} />
      <Micro x={1610} y={90} lines={["EKUMER 62UZ-FFLH-9YLT-E3Z7"]} />
      <div class={css.glitch} style={box(1737, 89, 58, 9)} />

      <Micro x={796} y={118} lines={["IIII IIIIIIIIIIIIIIIIIIIIIIIIIIIIII IIII"]} />
      <Text class={css.heading} style={box(796, 134)}>
        BUFFER
      </Text>

      <Micro
        x={230}
        y={173}
        lines={[
          "ONLY CCSS CERTIFIED AND CHIEF 5TH CLASS OFFICERS ARE ALLOWED TO MANIPULATE, ACCESS OR DISABLE THIS DEVICE",
        ]}
      />
      <Text class={css.heading} style={box(230, 194)}>
        BREACH TIME REMAINING
      </Text>
      <Badge class={css.countdown} style={box(695, 189, 101, 44)} aug={{ border: "2px" }}>
        {breach().remaining.toFixed(2)}
      </Badge>
      <div class={css.timer} style={box(230, 240, 570, 8)}>
        <BarProgress variant="solid" progress={(breach().remaining / BREACH_SECONDS) * 100} />
      </div>

      <Panel
        classes={{ body: css.bufferBody }}
        padding="17px 0 0 17px"
        style={box(796, 178, 239, 70)}
        aug={{ border: "2px" }}
      >
        <For each={Array.from({ length: BUFFER_SIZE })}>
          {(_, index) => (
            <span class={css.slot} data-filled={codes()[index()] === undefined ? undefined : ""}>
              {codes()[index()]}
            </span>
          )}
        </For>
      </Panel>

      <Panel
        classes={{ header: css.matrixHeader, title: css.matrixTitle }}
        padding="9px 6px 0"
        style={box(231, 291, 520, 322)}
        tone="filled"
        icon={<MatrixIcon />}
        title="CODE MATRIX"
        meta={
          <Micro
            lines={["REQ0ENS: 3425 1234", "SECTION: 2025 7120", "2412 AUTOCHECK", "DOCUMENT-5455"]}
          />
        }
        aug={{ tl: { mixin: "clip", size: "16px" }, border: "2px" }}
      >
        <Table class={css.matrixTable} classes={{ body: css.matrixTbody }}>
          <For each={MATRIX}>
            {(line, row) => (
              <TableRow
                class={css.matrixRow}
                data-active={breach().cursor.row === row() ? "" : undefined}
              >
                <For each={line}>
                  {(code, col) => (
                    <TableColumn class={css.matrixCell} {...cellProps({ row: row(), col: col() })}>
                      {code}
                    </TableColumn>
                  )}
                </For>
              </TableRow>
            )}
          </For>
        </Table>
      </Panel>
      <Micro x={231} y={622} lines={["", "", "", "", "PROTOCOL", "6520-A44"]} />
      <Micro
        x={434}
        y={624}
        lines={["2.24645  2 . 3  4 8 0", "0.45654  0 . 1  4 0 0", "0.93743  0 . 4  4"]}
      />
      <Micro
        x={572}
        y={624}
        lines={[
          "02:23 1.93743  0 . 4  4 3  3 1  1 .  02:29",
          "02:36 4.93743  0 . 0  0 0  0  0     02:42",
          "02:50",
        ]}
      />

      <Panel
        classes={{ header: css.seqHeader, body: css.seqBody }}
        style={box(796, 288, 924, 149)}
        icon={<SequenceIcon />}
        title="SEQUENCE REQUIRED TO UPLOAD"
        meta={
          <>
            <Micro lines={["MODEL LINE   12.12AA"]} />
            <Micro lines={["MODEL/TYPE: 3425 1234", "MODE/TYPE: 2025 7120"]} />
          </>
        }
        aug={{ tl: { mixin: "clip", size: "8px" }, border: { all: "2px", opacity: 0.7 } }}
      >
        <For each={SEQUENCE}>
          {(code, index) => (
            <div
              class={css.chip}
              style={{ left: `${19 + index() * 43}px` }}
              data-state={
                index() < progress() ? "done" : index() === progress() ? "current" : "todo"
              }
            >
              {code}
            </div>
          )}
        </For>
        <div class={css.datamine}>
          <DatamineIcon />
        </div>
        <p class={css.dmTitle}>DATAMINE_V1</p>
        <p class={css.dmDesc}>
          <span>eurodollars, components and/or quickhacks.</span>
        </p>
      </Panel>

      <Micro x={796} y={447} lines={[NOTICE, HASH, "TYPE: CYBERSPACE"]} />

      <Micro x={124} y={983} lines={[NOTICE, HASH, "TYPE: CYBERSPACE"]} />
      <Show
        when={note() !== "" || current() !== "running"}
        fallback={<Micro x={1240} y={985} lines={["POWERED BY MILITECH.CO GENERATION V"]} />}
      >
        <div class={css.status} data-phase={current()} style={box(1240, 960)}>
          {note() === "" ? STATUS[current()] : note()}
        </div>
      </Show>
      <Micro
        x={1565}
        y={985}
        lines={["DYNAMIC LINK CONNECTION ENABLED // PRE_ALPHA BUILD 2400234 2346 38"]}
      />

      <HintBar x={1163} y={995}>
        <KeyHint
          keys={[<MouseIcon button="wheel" size={30} />, <MouseIcon button="wheel" size={30} />]}
        >
          NAVIGATION
        </KeyHint>
        <KeyHint keys={[<MouseIcon button="left" size={30} />, "↵", "F"]}>SELECT CODE</KeyHint>
        <KeyHint keys={["H"]}>HELP</KeyHint>
        <KeyHint keys={["C", "ESC"]}>CLOSE</KeyHint>
      </HintBar>

      <CursorSquare />
    </Stage>
  );
}

render(() => <Hacking />, document.body);
