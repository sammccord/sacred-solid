import type { JSX } from "@solidjs/web";
import type * as Lib from "../src/index.ts";

const TABLE = [
  ["A", "B"],
  ["1", "2"],
];

type Case = [string, () => JSX.Element];

export function markupCases(c: typeof Lib): Case[] {
  return [
    [
      "Accordion",
      () => (
        <c.Accordion title="t" defaultValue>
          x
        </c.Accordion>
      ),
    ],
    ["ActionBar", () => <c.ActionBar items={[{ body: "x" }]} />],
    ["ActionButton", () => <c.ActionButton hotkey="a">x</c.ActionButton>],
    ["AlertBanner", () => <c.AlertBanner>x</c.AlertBanner>],
    ["Avatar", () => <c.Avatar src="/a.png">name</c.Avatar>],
    ["Badge", () => <c.Badge>x</c.Badge>],
    ["BarProgress", () => <c.BarProgress progress={10} />],
    ["BarProgress solid", () => <c.BarProgress variant="solid" progress={10} />],
    ["Button", () => <c.Button>x</c.Button>],
    ["Card", () => <c.Card title="t">x</c.Card>],
    ["CardDouble", () => <c.CardDouble title="t">x</c.CardDouble>],
    ["Checkbox", () => <c.Checkbox name="c">x</c.Checkbox>],
    ["DataTable", () => <c.DataTable data={TABLE} />],
    ["Dialog", () => <c.Dialog title="t">x</c.Dialog>],
    ["Divider", () => <c.Divider />],
    ["Divider double", () => <c.Divider type="DOUBLE" />],
    ["Grid", () => <c.Grid>x</c.Grid>],
    ["Input", () => <c.Input name="i" label="l" />],
    ["ListItem", () => <c.ListItem>x</c.ListItem>],
    ["Message", () => <c.Message>x</c.Message>],
    [
      "Navigation",
      () => (
        <c.Navigation logo="L" left="l" right="r">
          x
        </c.Navigation>
      ),
    ],
    [
      "Panel",
      () => (
        <c.Panel title="t" icon="i" meta="m">
          x
        </c.Panel>
      ),
    ],
    [
      "RadioButton",
      () => (
        <c.RadioButton name="r" value="v">
          x
        </c.RadioButton>
      ),
    ],
    ["Row", () => <c.Row>x</c.Row>],
    ["SimpleTable", () => <c.SimpleTable data={TABLE} />],
    ["Surface", () => <c.Surface>x</c.Surface>],
    ["Table", () => <c.Table>x</c.Table>],
    ["Tabs", () => <c.Tabs items={[{ id: "a", label: "A" }]} value="a" onChange={() => {}} />],
    ["Text", () => <c.Text>x</c.Text>],
    ["TextArea", () => <c.TextArea name="t" />],
    [
      "TreeView",
      () => (
        <c.TreeView title="t" defaultValue>
          x
        </c.TreeView>
      ),
    ],
    ["Window", () => <c.Window>x</c.Window>],
  ];
}
