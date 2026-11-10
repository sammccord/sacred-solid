import "../src/styles/global-fonts.css";
import "../src/styles/global.css";

import type { JSX } from "solid-js";
import { render } from "solid-js/web";
import type { AugProps } from "../src/aug/index.ts";
import { Button } from "../src/components/Button.tsx";
import { Card } from "../src/components/Card.tsx";
import { CardDouble } from "../src/components/CardDouble.tsx";
import { Dialog } from "../src/components/Dialog.tsx";
import { Panel } from "../src/components/Panel.tsx";
import { ListItem } from "../src/components/ListItem.tsx";
import { Input } from "../src/components/Input.tsx";
import { Popover } from "../src/components/Popover.tsx";
import { Providers } from "../src/components/Providers.tsx";
import { Tooltip } from "../src/components/Tooltip.tsx";
import { Window } from "../src/components/Window.tsx";

const VARIANTS: [string, AugProps | undefined][] = [
  ["plain", undefined],
  ["both", { tl: { mixin: "clip", size: "9px" }, border: "1px", inlay: true }],
  ["border", { tl: { mixin: "clip", size: "9px" }, border: "1px" }],
  ["inlay", { tl: { mixin: "clip", size: "9px" }, inlay: true }],
  ["clip", { tl: { mixin: "clip", size: "9px" } }],
];

const CASES: [string, (aug: AugProps | undefined) => JSX.Element][] = [
  ["Card", (aug) => <Card title="CARD" aug={aug} />],
  ["CardDouble", (aug) => <CardDouble title="DOUBLE" aug={aug} />],
  [
    "Dialog",
    (aug) => (
      <Dialog title="DIALOG" aug={aug}>
        body
      </Dialog>
    ),
  ],
  ["Input", (aug) => <Input name="strip" aug={aug} />],
  [
    "Panel",
    (aug) => (
      <Panel title="PANEL" aug={aug}>
        body
      </Panel>
    ),
  ],
  ["Window", (aug) => <Window aug={aug}>window</Window>],
  [
    "Button secondary",
    (aug) => (
      <Button variant="SECONDARY" aug={aug}>
        button
      </Button>
    ),
  ],
  ["Popover", (aug) => <Popover aug={aug}>popover</Popover>],
  ["Tooltip", (aug) => <Tooltip aug={aug}>tooltip</Tooltip>],
];

const NESTED: [string, (aug: AugProps | undefined) => JSX.Element][] = [
  [
    "Card in Card",
    (aug) => (
      <Card title="OUTER" aug={aug}>
        <Card title="INNER" />
        <Button variant="SECONDARY">inner button</Button>
      </Card>
    ),
  ],
  [
    "Window in Window",
    (aug) => (
      <Window aug={aug}>
        <Window>inner</Window>
      </Window>
    ),
  ],
  [
    "CardDouble in Card",
    (aug) => (
      <Card title="OUTER" aug={aug}>
        <CardDouble title="INNER" />
      </Card>
    ),
  ],
];

function Fixture() {
  return (
    <Providers>
      <main style={{ padding: "2ch", display: "grid", gap: "2ch" }}>
        {[...CASES, ...NESTED].map(([name, make]) => (
          <div data-case={name} style={{ display: "flex", gap: "2ch", "align-items": "start" }}>
            {VARIANTS.map(([variant, aug]) => (
              <div data-variant={variant} style={{ width: "40ch" }}>
                {make(aug)}
              </div>
            ))}
          </div>
        ))}
      </main>
      <ul data-listitem="" style={{ padding: "2ch" }}>
        <ListItem
          selected
          aug={{ tl: { mixin: "clip", size: "9px" }, inlay: true }}
          data-row="selected"
        >
          selected with an inlay
        </ListItem>
        <ListItem aug={{ tl: { mixin: "clip", size: "9px" }, inlay: true }} data-row="plain">
          plain with an inlay
        </ListItem>
        <ListItem selected data-row="bare">
          selected without aug
        </ListItem>
      </ul>
    </Providers>
  );
}

render(() => <Fixture />, document.body);
