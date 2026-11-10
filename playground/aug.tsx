import "../src/styles/global-fonts.css";
import "../src/styles/global.css";
import "../src/themes/holo.css";

import { createSignal, For, type JSX } from "solid-js";
import { render } from "solid-js/web";
import type { AugProps } from "../src/aug/index.ts";
import {
  onHandleAppearanceChange,
  onHandleAppearanceModeChange,
  SPACE,
} from "../src/common/utilities.ts";
import { ActionBar } from "../src/components/ActionBar.tsx";
import { AlertBanner } from "../src/components/AlertBanner.tsx";
import { Avatar } from "../src/components/Avatar.tsx";
import { Badge } from "../src/components/Badge.tsx";
import { Button } from "../src/components/Button.tsx";
import { Card } from "../src/components/Card.tsx";
import { CardDouble } from "../src/components/CardDouble.tsx";
import { Dialog } from "../src/components/Dialog.tsx";
import { Divider } from "../src/components/Divider.tsx";
import { Drawer } from "../src/components/Drawer.tsx";
import { DropdownMenu } from "../src/components/DropdownMenu.tsx";
import { Input } from "../src/components/Input.tsx";
import { Popover } from "../src/components/Popover.tsx";
import { Providers } from "../src/components/Providers.tsx";
import { Surface } from "../src/components/Surface.tsx";
import { TextArea } from "../src/components/TextArea.tsx";
import { Tooltip } from "../src/components/Tooltip.tsx";
import { Window } from "../src/components/Window.tsx";

const ACCENT = "var(--theme-accent)";

const SHAPE_NAMES = ["clip", "clip-all", "scoop", "round", "step", "none"] as const;
type ShapeName = (typeof SHAPE_NAMES)[number];

const DEFAULT_SIZE = "14px";

const SKIN = {
  border: true,
  inlay: { opacity: 0.85 },
} satisfies AugProps;

const presets = (size: string): Record<ShapeName, AugProps> => ({
  clip: { tl: { mixin: "clip", size }, br: { mixin: "clip", size }, ...SKIN },
  "clip-all": {
    tl: { mixin: "clip", size },
    tr: { mixin: "clip", size },
    br: { mixin: "clip", size },
    bl: { mixin: "clip", size },
    ...SKIN,
  },
  scoop: { tl: { mixin: "scoop", size }, br: { mixin: "scoop", size }, ...SKIN },
  round: { tl: { mixin: "round", size }, br: { mixin: "round", size }, ...SKIN },
  step: { tl: { mixin: "step-inset", size }, br: { mixin: "step-inset", size }, ...SKIN },
  none: {},
});

const SHAPES = presets(DEFAULT_SIZE);

const THEMES = [
  ["light", "theme-light", ""],
  ["dark", "theme-dark", ""],
  ["holo", "theme-holo", ""],
  ["light green tint", "theme-light", "tint-green"],
  ["dark purple tint", "theme-dark", "tint-purple"],
] as const;

const query = new URLSearchParams(location.search);
const initialTheme = THEMES.find(([label]) => label === query.get("theme")) ?? THEMES[2];
onHandleAppearanceChange(initialTheme[1]);
onHandleAppearanceModeChange(initialTheme[2]);

const [themeLabel, setThemeLabel] = createSignal<string>(initialTheme[0]);
const [shape, setShape] = createSignal<ShapeName>(
  SHAPE_NAMES.find((name) => name === query.get("shape")) ?? "clip",
);

function syncUrl() {
  const next = new URLSearchParams({ theme: themeLabel(), shape: shape() });
  history.replaceState(null, "", `?${next}`);
}

function mergeSurface<T extends true | string | object>(base: T | undefined, over: T | undefined) {
  if (over === undefined) return base;
  if (typeof base === "object" && typeof over === "object") return { ...base, ...over };
  return over;
}

function shapeAug(overrides?: AugProps, size?: string): AugProps | undefined {
  const preset = size === undefined ? SHAPES[shape()] : presets(size)[shape()];
  if (Object.keys(preset).length === 0) return undefined;
  if (overrides === undefined) return preset;
  return {
    ...preset,
    ...overrides,
    border: mergeSurface(preset.border, overrides.border),
    inlay: mergeSurface(preset.inlay, overrides.inlay),
  };
}

const TAG_AUG: AugProps = { inlay: { bg: "var(--theme-surface-chip)", opacity: 0.95 } };
const TAG_SIZE = "8px";
const FIELD_SIZE = "5px";
const TAG_PADDING = "0 2ch";
const TAG_LINE = "calc(var(--theme-line-height-base) * 1em)";

const STRIPES = [
  "repeating-linear-gradient(90deg, transparent 0 40px, rgba(255, 60, 0, 0.9) 40px 52px, transparent 52px 130px, rgba(255, 220, 0, 0.9) 130px 142px)",
  "repeating-linear-gradient(0deg, transparent 0 60px, rgba(0, 255, 120, 0.8) 60px 66px)",
  "linear-gradient(135deg, #2b0a5c, #0a4a8a 40%, #b01a6a 75%, #f0a020)",
].join(", ");

function Tag(props: { children: JSX.Element }) {
  return (
    <Badge
      aug={shapeAug(TAG_AUG, TAG_SIZE)}
      style={{
        padding: TAG_PADDING,
        width: "fit-content",
        "line-height": TAG_LINE,
        "min-height": TAG_LINE,
      }}
    >
      {props.children}
    </Badge>
  );
}

function Switcher(props: {
  title: string;
  entries: readonly string[];
  active: string;
  onPick: (entry: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "1ch", "flex-wrap": "wrap", "align-items": "center" }}>
      <Tag>{props.title}</Tag>
      <For each={props.entries}>
        {(entry) => (
          <Button
            variant={props.active === entry ? "PRIMARY" : "SECONDARY"}
            aug={shapeAug(undefined, TAG_SIZE)}
            style={{ width: "auto" }}
            onClick={() => props.onPick(entry)}
          >
            {entry}
          </Button>
        )}
      </For>
    </div>
  );
}

function SwitcherBar() {
  return (
    <Surface
      blur="6px"
      glow="rgba(0, 0, 0, 0.5)"
      aug={shapeAug()}
      style={{ position: "sticky", top: "0", "z-index": 10, padding: "1ch 2ch" }}
    >
      <div style={{ display: "flex", gap: "1ch 4ch", "flex-wrap": "wrap" }}>
        <Switcher
          title="theme"
          entries={THEMES.map(([label]) => label)}
          active={themeLabel()}
          onPick={(label) => {
            const picked = THEMES.find(([name]) => name === label);
            if (!picked) return;
            onHandleAppearanceChange(picked[1]);
            onHandleAppearanceModeChange(picked[2]);
            setThemeLabel(label);
            syncUrl();
          }}
        />
        <Switcher
          title="shape"
          entries={SHAPE_NAMES}
          active={shape()}
          onPick={(name) => {
            const picked = SHAPE_NAMES.find((entry) => entry === name);
            if (!picked) return;
            setShape(picked);
            syncUrl();
          }}
        />
      </div>
    </Surface>
  );
}

function Families(props: { shaped: boolean }) {
  const aug = (overrides?: AugProps, size?: string) =>
    props.shaped ? shapeAug(overrides, size) : undefined;
  const padded = (padding: string) => (props.shaped ? { padding } : undefined);
  return (
    <div style={{ display: "flex", "flex-wrap": "wrap", gap: "3ch", "align-items": "flex-start" }}>
      <div style={{ display: "flex", "flex-direction": "column", gap: "2ch", width: "34ch" }}>
        <Tag>Card</Tag>
        <Card title="CARD" aug={aug()}>
          Card body text for legibility.
        </Card>
        <Tag>CardDouble</Tag>
        <CardDouble title="DOUBLE" aug={aug()}>
          Double card body.
        </CardDouble>
        <Tag>Button primary, secondary, disabled</Tag>
        <Button aug={aug()}>Primary</Button>
        <Button variant="SECONDARY" aug={aug()}>
          Secondary
        </Button>
        <Button isDisabled aug={aug()}>
          Disabled
        </Button>
        <Tag>Input, TextArea, Badge</Tag>
        <Input
          label="NAME"
          placeholder="type here"
          name="family-input"
          aug={aug(undefined, FIELD_SIZE)}
        />
        <TextArea placeholder="textarea placeholder" aug={aug(undefined, FIELD_SIZE)} />
        <div>
          <Badge aug={aug(undefined, TAG_SIZE)} style={padded("0 1.5ch")}>
            v1.2.3
          </Badge>
        </div>
      </div>
      <div style={{ display: "flex", "flex-direction": "column", gap: "2ch", width: "34ch" }}>
        <Tag>Dialog</Tag>
        <Dialog title="CONFIRM" aug={aug()}>
          Delete everything?
        </Dialog>
        <Tag>Popover</Tag>
        <div style={{ padding: "1ch" }}>
          <Popover aug={aug()}>Popover content here</Popover>
        </div>
        <Tag>Tooltip</Tag>
        <div>
          <Tooltip aug={aug(undefined, TAG_SIZE)} style={padded("0 1.5ch")}>
            Tooltip text
          </Tooltip>
        </div>
        <Tag>AlertBanner</Tag>
        <AlertBanner aug={aug()}>Heads up, something happened.</AlertBanner>
        <Tag>Drawer, open</Tag>
        <Drawer defaultValue aug={aug()}>
          <div style={{ padding: "1ch" }}>Drawer content</div>
        </Drawer>
      </div>
      <div style={{ display: "flex", "flex-direction": "column", gap: "2ch", width: "28ch" }}>
        <Tag>DropdownMenu</Tag>
        <DropdownMenu
          aug={aug()}
          items={[{ children: "Item one" }, { children: "Item two" }, { children: "Item three" }]}
        />
        <Tag>ActionBar</Tag>
        <ActionBar
          aug={aug()}
          items={[{ body: "File", hotkey: "⌘F" }, { body: "Edit", hotkey: "⌘E" }, { body: "View" }]}
        />
      </div>
    </div>
  );
}

function Cell(props: { label: string; children: JSX.Element }) {
  return (
    <Window
      role="presentation"
      aug={shapeAug({ inlay: { opacity: 0.6 } })}
      style={{ display: "flex", "flex-direction": "column", gap: "1ch" }}
    >
      <div>
        <Tag>{props.label}</Tag>
      </div>
      {props.children}
    </Window>
  );
}

function Section(props: { title: string; children: JSX.Element }) {
  return (
    <section id={props.title.toLowerCase().replace(/\W+/g, "-")}>
      <h2 style={{ margin: "4ch 0 2ch" }}>
        <Tag>{props.title}</Tag>
      </h2>
      <div
        style={{
          display: "grid",
          "grid-template-columns": "repeat(auto-fill, minmax(34ch, 1fr))",
          gap: "3ch",
          "align-items": "start",
        }}
      >
        {props.children}
      </div>
    </section>
  );
}

function Swatch(props: { aug?: AugProps; children?: JSX.Element }) {
  return (
    <Window
      aug={props.aug}
      role="presentation"
      style={{
        background: ACCENT,
        color: "var(--theme-ink-inverse)",
        padding: "2ch",
        "min-height": "10ch",
      }}
    >
      {props.children}
    </Window>
  );
}

const DEMO_CORNERS = [
  [
    "tl-clip + br-clip",
    { tl: { mixin: "clip", size: "20px" }, br: { mixin: "clip", size: "20px" } },
  ],
  ["tl/tr/br/bl clip", { tl: "clip", tr: "clip", br: "clip", bl: "clip" }],
  ["step-inset corners", { tl: "step-inset", br: "step-inset" }],
  [
    "step-xy edges",
    { t: { mixin: "step-xy", size: "14px" }, b: { mixin: "step-xy", size: "14px" } },
  ],
  ["rect corners", { tl: { mixin: "rect", size: "20px" }, br: { mixin: "rect", size: "20px" } }],
  ["round corners", { tl: { mixin: "round", size: "22px" }, br: { mixin: "round", size: "22px" } }],
  ["scoop corners", { tl: { mixin: "scoop", size: "22px" }, br: { mixin: "scoop", size: "22px" } }],
  [
    "2-position clip",
    {
      tl: { mixin: "2-clip-x", size1: "30px", size2: "10px" },
      br: { mixin: "2-clip-y", size1: "30px", size2: "10px" },
    },
  ],
  [
    "2-position scoop and round",
    {
      tl: { mixin: "2-scoop", size1: "24px", size2: "12px" },
      br: { mixin: "2-round", size1: "24px", size2: "12px" },
    },
  ],
  [
    "edge clip-xy with center and offset",
    {
      t: { mixin: "clip-xy", size: "18px", center: "30%" },
      b: { mixin: "clip-xy", size: "18px", offset: "10px" },
    },
  ],
] satisfies [string, AugProps][];

const Stage = (props: { id: string; title: string; children: JSX.Element }) => (
  <section id={props.id}>
    <Tag>{props.title}</Tag>
    <div
      style={{
        display: "flex",
        gap: "4ch",
        "flex-wrap": "wrap",
        margin: "2ch 0 6ch",
        "align-items": "flex-start",
      }}
    >
      {props.children}
    </div>
  </section>
);

function Gallery() {
  return (
    <main style={{ padding: "0 3ch 8ch", background: STRIPES, "min-height": "100vh" }}>
      <SwitcherBar />
      <h1 style={{ margin: "2ch 0" }}>
        <Tag>augmented-ui props</Tag>
      </h1>
      <Window role="presentation" aug={shapeAug()} style={{ "max-width": "90ch" }}>
        <p>Every box below is a sacred-solid component with an aug prop.</p>
        <p>
          Pick a shape theme and a color theme above and everything below follows. The catalog
          sections show raw mixins.
        </p>
      </Window>

      <h2 style={{ margin: "4ch 0 2ch" }}>
        <Tag>Theming and composition</Tag>
      </h2>

      <section id="a-window-in-window-in-window">
        <Tag>A. Control, Window in Window in Window, no aug and no shape</Tag>
        <Window role="presentation" style={{ margin: "2ch 0 6ch" }}>
          Outer window
          <Window role="presentation" style={{ margin: "3ch 2ch 4ch 0" }}>
            Middle window
            <Window role="presentation" style={{ margin: "3ch 2ch 4ch 0" }}>
              Inner window
            </Window>
          </Window>
        </Window>
      </section>

      <section id="b-every-family">
        <Tag>B. Every family with the current shape</Tag>
        <div style={{ margin: "2ch 0 6ch" }}>
          <Families shaped />
        </div>
        <Tag>B2. Control, the same families with no aug and no shape</Tag>
        <div style={{ margin: "2ch 0 6ch" }}>
          <Families shaped={false} />
        </div>
      </section>

      <Stage id="c-surface" title="C. Surface, glow lives on a wrapper and blur on its own layer">
        <Surface aug={shapeAug()} style={{ width: "30ch", padding: "2ch" }}>
          Plain Surface
        </Surface>
        <Surface
          aug={shapeAug()}
          glow="cyan"
          glowSize="10px"
          style={{ width: "30ch", padding: "2ch" }}
        >
          glow cyan 10px
        </Surface>
        <Surface
          aug={shapeAug()}
          glow="cyan"
          blur="8px"
          theme={{ surfaceFloat: "rgb(0 20 40 / 0.2)" }}
          style={{ width: "30ch", padding: "2ch" }}
        >
          glow and backdrop blur 8px over the stripes
        </Surface>
        <Surface
          glow="cyan"
          blur="8px"
          aug={shapeAug({ inlay: { opacity: 0.4 } })}
          theme={{ surfaceFloat: "rgb(0 20 40 / 0.2)" }}
          style={{ width: "30ch", padding: "2ch" }}
        >
          glow, blur and the shape border, the glow follows the clipped outline
        </Surface>
      </Stage>

      <Stage id="d-nested-aug" title="D. Nested aug, plain components keep their own chrome">
        <Window role="presentation" aug={shapeAug()} style={{ width: "46ch" }}>
          aug Window
          <Card title="INNER AUG" aug={shapeAug({ inlay: { opacity: 0.5 } })}>
            aug Card in an aug Window
          </Card>
        </Window>
        <Card title="AUG OUTER" aug={shapeAug()} style={{ width: "46ch" }}>
          <p>Plain components inside keep their lines.</p>
          <Card title="PLAIN CARD">plain Card</Card>
          <br />
          <Button variant="SECONDARY">plain secondary</Button>
          <br />
          <Input label="PLAIN" placeholder="plain input" name="nested-input" />
        </Card>
      </Stage>

      <Stage id="e-theme-prop" title="E. theme prop re-themes a subtree">
        <Window
          role="presentation"
          aug={shapeAug()}
          theme={{
            inkInverse: "#021",
            surfaceInverse: "#7fffd4",
            surfaceFloat: "rgb(0 30 40 / 0.85)",
          }}
          style={{ width: "46ch" }}
        >
          Window with a theme prop
          <Dialog title="THEMED DIALOG" aug={shapeAug()}>
            The title bar and the panel come from the prop.
          </Dialog>
        </Window>
        <Card
          title="THEMED CARD"
          aug={shapeAug()}
          theme={{ lineStrong: "#ff3df5", surfaceWindow: "rgb(40 0 40 / 0.7)" }}
          style={{ width: "46ch" }}
        >
          Card with a magenta lineStrong.
        </Card>
      </Stage>

      <Section title="Corner mixins on a Window">
        {DEMO_CORNERS.map(([label, aug]) => (
          <Cell label={label}>
            <Swatch aug={aug}>{label}</Swatch>
          </Cell>
        ))}
      </Section>

      <Section title="Whole shapes">
        <Cell label="all-hex">
          <Swatch aug={{ all: { mixin: "hex", width: "20px" } }}>all hex</Swatch>
        </Cell>
        <Cell label="all-hex-alt">
          <Swatch aug={{ all: { mixin: "hex-alt", width: "20px", height: "20px" } }}>
            all hex alt
          </Swatch>
        </Cell>
        <Cell label="all-triangle-up">
          <Swatch aug={{ all: "triangle-up" }}>triangle</Swatch>
        </Cell>
        <Cell label="all-hexangle-right">
          <Swatch aug={{ all: "hexangle-right" }}>hexangle</Swatch>
        </Cell>
      </Section>

      <Section title="Border and inlay with theme tokens">
        <Cell label="border bg var(--theme-line-strong), 3px">
          <Swatch aug={{ tl: "clip", br: "clip", border: "3px" }}>border</Swatch>
        </Cell>
        <Cell label="border plus inlay">
          <Swatch
            aug={{
              tl: { mixin: "clip", size: "24px" },
              br: { mixin: "clip", size: "24px" },
              border: "3px",
              inlay: { all: "8px", bg: "var(--theme-surface-page)", opacity: 0.8 },
            }}
          >
            border and inlay
          </Swatch>
        </Cell>
        <Cell label="shorthand border: true">
          <Card title="BORDER TRUE" aug={{ tl: "clip", br: "clip", border: true }}>
            Default border colour is the element's own background fallback.
          </Card>
        </Cell>
        <Cell label="per-side border widths">
          <Swatch
            aug={{
              tr: "scoop",
              bl: "scoop",
              border: { top: "2px", right: "6px", bottom: "2px", left: "6px" },
            }}
          >
            sides
          </Swatch>
        </Cell>
      </Section>

      <Section title="Components">
        <Cell label="Card">
          <Card title="CARD" aug={shapeAug({ border: { all: "2px" } })}>
            A card with the current shape and a themed border.
          </Card>
        </Cell>
        <Cell label="CardDouble">
          <CardDouble title="DOUBLE" aug={shapeAug({ border: { all: "2px" } })}>
            A double card.
          </CardDouble>
        </Cell>
        <Cell label="Dialog">
          <Dialog title="CONFIRM" aug={shapeAug({ border: { all: "2px", bg: ACCENT } })}>
            Delete everything?
          </Dialog>
        </Cell>
        <Cell label="Button primary">
          <Button aug={shapeAug()}>Primary</Button>
        </Cell>
        <Cell label="Button secondary with border">
          <Button variant="SECONDARY" aug={shapeAug({ border: { all: "2px" } })}>
            Secondary
          </Button>
        </Cell>
        <Cell label="Button disabled">
          <Button isDisabled aug={shapeAug()}>
            Disabled
          </Button>
        </Cell>
        <Cell label="Badge">
          <div>
            <Badge aug={shapeAug(undefined, TAG_SIZE)} style={{ padding: "0 1.5ch" }}>
              v1.2.3
            </Badge>
          </div>
        </Cell>
        <Cell label="Input">
          <Input
            label="NAME"
            placeholder="type here"
            name="aug-input"
            aug={shapeAug({ border: { all: "2px" } }, FIELD_SIZE)}
          />
        </Cell>
        <Cell label="Avatar, image then fallback">
          <div style={{ display: "flex", gap: "2ch" }}>
            <Avatar src="/template-app-icon.png" aug={shapeAug()} />
            <Avatar aug={shapeAug()} />
          </div>
        </Cell>
        <Cell label="Divider">
          <Divider aug={shapeAug(undefined, "4px")} type="GRADIENT" />
        </Cell>
      </Section>

      <Section title="Nested">
        <Cell label="Card with a Button and a Badge inside">
          <Card
            title="OUTER"
            aug={shapeAug(
              {
                border: { all: "3px" },
                inlay: { all: "6px", bg: "var(--theme-surface-panel)" },
              },
              "20px",
            )}
          >
            <p>Inner components take the same shape.</p>
            <Button
              aug={shapeAug({ border: { all: "2px", bg: ACCENT } }, TAG_SIZE)}
              style={{ width: "auto" }}
            >
              Inner button
            </Button>
            {SPACE}
            <Badge aug={shapeAug(undefined, TAG_SIZE)} style={{ padding: "0 1.5ch" }}>
              inner badge
            </Badge>
          </Card>
        </Cell>
        <Cell label="Hex Window around a shaped Window">
          <Window
            aug={{ all: { mixin: "hex", width: "40px" }, border: "3px" }}
            role="presentation"
            style={{ padding: "6ch 8ch", background: "var(--theme-surface-panel)" }}
          >
            <Window role="presentation" aug={shapeAug(undefined, "10px")}>
              child
            </Window>
          </Window>
        </Cell>
      </Section>
    </main>
  );
}

render(
  () => (
    <Providers>
      <Gallery />
    </Providers>
  ),
  document.body,
);
