import "../src/styles/global-fonts.css";
import "../src/styles/global.css";
import "../src/themes/redline.css";

import { createMemo, createSignal, For, onSettled, Show } from "solid-js";
import { render } from "@solidjs/web";
import { Accordion } from "../src/components/Accordion.tsx";
import { Badge } from "../src/components/Badge.tsx";
import { BarProgress } from "../src/components/BarProgress.tsx";
import { KeyHint } from "../src/components/KeyHint.tsx";
import { ListItem } from "../src/components/ListItem.tsx";
import { ScrollArea } from "../src/components/ScrollArea.tsx";
import { MouseIcon } from "../src/components/svg/MouseIcon.tsx";
import { Tabs } from "../src/components/Tabs.tsx";
import { Text } from "../src/components/Text.tsx";
import type { ThemeProps } from "../src/style/index.ts";
import { useKeymap } from "./hud/keymap.ts";
import { box, CursorSquare, DotGrid, HintBar, Micro } from "./hud/parts.tsx";
import { Stage } from "./hud/Stage.tsx";
import css from "./journal/journal.module.css";
import {
  CabIcon,
  Emblems,
  MapThumb,
  TAB_ICONS,
  TagIcon,
  WarningIcon,
  WeightIcon,
} from "./journal/parts.tsx";
import {
  DEFAULT_QUEST_ID,
  INITIAL_HOVER_ID,
  questById,
  SECTIONS,
  type Danger,
} from "./journal/quests.ts";

const CYAN: ThemeProps = { ink: "#52dadc" };
const GREEN: ThemeProps = { ink: "#35e57a" };
const AMBER: ThemeProps = { ink: "#f2c230" };
const DANGER_TINT: Record<Danger, ThemeProps> = {
  HIGH: { ink: "#e8742a" },
  MODERATE: { ink: "#e6b030" },
};

const TABS = [
  { id: "map", label: "MAP" },
  { id: "character", label: "CHARACTER" },
  { id: "journal", label: "JOURNAL" },
  { id: "crafting", label: "CRAFTING" },
  { id: "inventory", label: "INVENTORY" },
];

const BINARY = ["1001", "0101", "1011", "1101", "0010"];
const NOTICE = [
  "IMAGE NAME: BLACKARCH 441.454",
  "IMAGE TYPE: KERNEL ISOLATED IMAGE",
  "[CCXS COMPRESSED]",
  "LOAD ADDRESS: 000011244",
];

function Ticks(props: { x: number; y: number; bar: number; tint: ThemeProps }) {
  return (
    <div class={css.ticks} style={box(props.x, props.y)}>
      <BarProgress
        variant="solid"
        progress={88}
        style={{ width: `${props.bar}px`, height: "4px" }}
        theme={{ surfaceInverse: props.tint.ink!, surfaceSubdued: "rgb(138 154 154 / 0.55)" }}
      />
      <i style={{ background: props.tint.ink }} />
      <i style={{ background: props.tint.ink }} />
      <i style={{ background: props.tint.ink }} />
    </div>
  );
}

function Journal() {
  const [selectedId, setSelectedId] = createSignal(DEFAULT_QUEST_ID);
  const [hoveredId, setHoveredId] = createSignal<string | undefined>(INITIAL_HOVER_ID);
  const [tab, setTab] = createSignal("journal");
  const quest = createMemo(() => questById(selectedId()));

  const step = (by: number) => {
    const ids = TABS.map((each) => each.id);
    setTab(ids[(ids.indexOf(tab()) + by + ids.length) % ids.length]!);
  };

  useKeymap({
    "1": () => step(-1),
    "3": () => step(1),
    Escape: () => {
      setSelectedId(DEFAULT_QUEST_ID);
      setHoveredId(undefined);
    },
  });

  const pick = (id: string, from: "hover" | "focus") => {
    setSelectedId(id);
    setHoveredId(from === "hover" ? id : undefined);
  };

  function JournalPanel() {
    let viewport = undefined as HTMLDivElement | undefined;

    onSettled(() => {
      const header = viewport!.querySelector<HTMLElement>("[data-section='side-jobs']")!;
      viewport!.scrollTop = header.offsetTop - 78;
      if (document.activeElement === document.body) {
        viewport!.querySelector<HTMLElement>("li[data-selected]")?.focus({ preventScroll: true });
      }
    });

    return (
      <>
        <ScrollArea
          class={css.list}
          classes={{ rail: css.scrollRail }}
          fade
          scrollbar="rail"
          viewportRef={(element) => (viewport = element)}
          role="listbox"
          onMouseLeave={() => setHoveredId(undefined)}
        >
          <For each={SECTIONS}>
            {(section) => (
              <div class={css.section} data-section={section.id}>
                <Accordion
                  title={section.title}
                  defaultValue
                  aug={{
                    br: { mixin: "clip", size: "16px" },
                    border: { all: "2px", bg: "var(--theme-line)" },
                    inlay: { bg: "var(--theme-surface-sunken)" },
                  }}
                  icon={() => (
                    <>
                      <span class={css.sectionRail} />
                      <span class={css.chevron} />
                    </>
                  )}
                  classes={{
                    header: css.sectionHeader,
                    icon: css.sectionIcon,
                    title: css.sectionTitle,
                    body: css.sectionBody,
                  }}
                >
                  <For each={section.quests}>
                    {(each) => (
                      <div class={css.questRow} role="presentation">
                        <TagIcon />
                        <span
                          class={css.notch}
                          data-marked={each.id === selectedId() ? "" : undefined}
                        >
                          {each.id === selectedId() ? "!" : ""}
                        </span>
                        <ListItem
                          class={css.card}
                          role="option"
                          aria-selected={each.id === selectedId() ? "true" : "false"}
                          selected={each.id === selectedId()}
                          aug={{
                            tr: { mixin: "clip", size: "9px" },
                            br: { mixin: "clip", size: "13px" },
                            border: {
                              all: "2px",
                              bg:
                                each.id === selectedId() || each.id === hoveredId()
                                  ? "var(--theme-line-strong)"
                                  : "var(--theme-line-subdued)",
                            },
                            inlay: true,
                          }}
                          onMouseEnter={(event) => {
                            event.currentTarget.focus({ preventScroll: true });
                            pick(each.id, "hover");
                          }}
                          onFocus={() => pick(each.id, "focus")}
                          onClick={() => pick(each.id, "focus")}
                        >
                          <span class={css.rail} />
                          <Emblems emblem={each.emblem} />
                          <Text class={css.questTitle} theme={CYAN}>
                            {each.title}
                          </Text>
                          <Text class={css.danger} theme={DANGER_TINT[each.danger]}>
                            DANGER: {each.danger}
                          </Text>
                          <Show when={each.isNew}>
                            <Badge class={css.new} theme={AMBER}>
                              NEW
                            </Badge>
                          </Show>
                        </ListItem>
                      </div>
                    )}
                  </For>
                </Accordion>
              </div>
            )}
          </For>
        </ScrollArea>

        <Text class={css.questName} style={box(858, 228)}>
          {quest().title}
        </Text>
        <div class={css.hairline} style={box(858, 274, 612, 1)} />
        <div class={css.warning} style={box(877, 298)}>
          <WarningIcon />
        </div>
        <Text class={css.objective} style={box(929, 296)} theme={CYAN}>
          {quest().objective}
        </Text>
        <div class={css.hairline} style={box(858, 350, 612, 1)} />
        <Text class={css.story} style={box(866, 360, 585)}>
          {quest().description}
        </Text>
        <div class={css.hairline} style={box(858, 918, 612, 1)} />
        <Micro x={858} y={938} lines={NOTICE} />

        <div class={css.mapFrame} style={box(1531, 217, 281, 153)}>
          <MapThumb />
        </div>
        <div class={css.caption} style={box(1538, 376)}>
          <CabIcon />
          <Text>{quest().marker}</Text>
        </div>
      </>
    );
  }

  const items = TABS.map((each) => ({
    id: each.id,
    label: each.label,
    icon: TAB_ICONS[each.id]!(),
    get panel() {
      return each.id === "journal" ? (
        <JournalPanel />
      ) : (
        <Text class={css.stub}>{each.label}: NOTHING TRACKED YET.</Text>
      );
    },
  }));

  return (
    <Stage pointer={{ x: 629, y: 581 }}>
      <div class={css.backdrop} />
      <DotGrid />
      <div class={css.vignette} />

      <Text class={css.stat} style={box(80, 22)} theme={CYAN}>
        <span class={css.statNumber}>9</span> LEVEL
      </Text>
      <Ticks x={105} y={62} bar={60} tint={CYAN} />
      <Text class={css.stat} style={box(225, 22)} theme={GREEN}>
        <span class={css.statNumber}>10</span> STREET CRED
      </Text>
      <Ticks x={262} y={62} bar={66} tint={GREEN} />

      <div class={css.shoulder} style={box(549, 26)}>
        1
      </div>
      <Tabs
        class={css.tabs}
        style={box(618, 30)}
        items={items}
        value={tab()}
        onChange={setTab}
        classes={{ tab: css.tab, icon: css.tabIcon, panel: css.tabPanel }}
      />
      <div class={css.shoulder} style={box(1343, 26)}>
        3
      </div>

      <div class={css.hudRight} style={box(1590, 28)}>
        <WeightIcon />
        <Text class={css.figure}>83/312</Text>
        <Text class={css.currency} theme={AMBER}>
          €$
        </Text>
        <Text class={css.figure}>5457</Text>
      </div>
      <div class={css.rule} />

      <Micro
        x={165}
        y={168}
        lines={[
          "PROTOCOL",
          "6520-A44",
          "ONLY CCSS CERTIFIED AND CHIEF 5TH CLASS",
          "OFFICERS ARE ALLOWED TO MANIPULATE",
        ]}
      />

      <div class={css.binary} style={box(1862, 125)}>
        <Micro lines={BINARY} />
        <Micro lines={BINARY} />
      </div>
      <Micro
        x={34}
        y={1048}
        lines={[
          "0.93743  0 . 4  4 5 2    4",
          "0.46654  0 . 1  4 5 0    1",
          "3.25684  0 . 4  4        4",
        ]}
      />

      <HintBar x={1487} y={1022} gap={22} size={20}>
        <KeyHint keys={[<MouseIcon button="left" size={34} />]}>Select</KeyHint>
        <KeyHint keys={[<MouseIcon button="right" size={34} />]}>Track Objective</KeyHint>
        <KeyHint keys={["ESC"]}>Close</KeyHint>
      </HintBar>

      <CursorSquare />
    </Stage>
  );
}

render(() => <Journal />, document.body);
