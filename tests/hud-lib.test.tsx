import { fireEvent, render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { beforeAll, expect, test } from "vite-plus/test";
import { Accordion } from "../src/components/Accordion.tsx";
import { KeyHint } from "../src/components/KeyHint.tsx";
import { ListItem } from "../src/components/ListItem.tsx";
import { Navigation } from "../src/components/Navigation.tsx";
import { Panel } from "../src/components/Panel.tsx";
import { MouseIcon } from "../src/components/svg/MouseIcon.tsx";
import { Tabs } from "../src/components/Tabs.tsx";
import keyStyles from "../src/components/KeyHint.module.css";
import panelStyles from "../src/components/Panel.module.css";
import { stubBrowserApis } from "./stubs.ts";

beforeAll(stubBrowserApis);

test("Panel classes add to each slot's lib class", () => {
  const { container } = render(() => (
    <Panel
      icon="i"
      title="T"
      meta="m"
      tone="filled"
      classes={{ header: "h", icon: "ic", title: "ti", meta: "me", body: "bo" }}
    >
      x
    </Panel>
  ));
  const header = container.querySelector("header")!;
  expect(header.classList.contains("h")).toBe(true);
  expect(header.classList.contains(panelStyles.header!)).toBe(true);
  expect(header.classList.contains(panelStyles.filled!)).toBe(true);
  expect(container.querySelector(".ic")?.classList.contains(panelStyles.icon!)).toBe(true);
  expect(container.querySelector(".ti")?.tagName).toBe("H2");
  expect(container.querySelector(".me")?.classList.contains(panelStyles.meta!)).toBe(true);
  expect(container.querySelector(".bo")?.classList.contains(panelStyles.body!)).toBe(true);
});

test("KeyHint takes elements as keys, boxed text caps and bare icon caps", () => {
  const { container } = render(() => (
    <KeyHint keys={[<MouseIcon button="left" />, "A", "ESC"]} classes={{ cap: "c", label: "l" }}>
      go
    </KeyHint>
  ));
  const caps = [...container.querySelectorAll("kbd")];
  expect(caps).toHaveLength(3);
  expect(caps[0]?.querySelector("svg")).not.toBeNull();
  expect(caps[0]?.classList.contains(keyStyles.icon!)).toBe(true);
  expect(caps[0]?.classList.contains(keyStyles.cap!)).toBe(false);
  expect(caps[1]?.classList.contains(keyStyles.cap!)).toBe(true);
  expect(caps[2]?.classList.contains(keyStyles.long!)).toBe(true);
  expect(caps.every((cap) => cap.classList.contains("c"))).toBe(true);
  expect(container.querySelector(".l")?.textContent).toBe("go");
});

test("MouseIcon fills the chosen button and sizes from the height", () => {
  const { container } = render(() => <MouseIcon button="right" size={40} />);
  const svg = container.querySelector("svg")!;
  expect(svg.getAttribute("height")).toBe("40");
  expect(svg.getAttribute("width")).toBe("30");
  expect(svg.querySelector("path[fill='currentColor']")?.getAttribute("d")).toContain("h3a6");
});

test("ListItem selected sets a data attribute and forwards handlers and class", () => {
  const [selected, setSelected] = createSignal(false);
  let clicks = 0;
  const { container } = render(() => (
    <ul>
      <ListItem class="row" selected={selected()} onClick={() => clicks++} aug={{ inlay: true }}>
        one
      </ListItem>
    </ul>
  ));
  const item = container.querySelector("li")!;
  expect(item.hasAttribute("data-selected")).toBe(false);
  setSelected(true);
  expect(item.hasAttribute("data-selected")).toBe(true);
  expect(item.classList.contains("row")).toBe(true);
  expect(item.getAttribute("data-augmented-ui")).toBe("inlay");
  fireEvent.click(item);
  expect(clicks).toBe(1);
});

test("Tabs marks the value selected, changes on click and moves with the arrow keys", () => {
  const [value, setValue] = createSignal("a");
  const { container } = render(() => (
    <Tabs
      items={[
        { id: "a", label: "A", icon: <i id="ia" /> },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
      ]}
      value={value()}
      onChange={setValue}
      classes={{ tab: "t", icon: "i", label: "lb" }}
    />
  ));
  const tabs = [...container.querySelectorAll<HTMLElement>("[role='tab']")];
  expect(container.firstElementChild?.getAttribute("role")).toBe("tablist");
  expect(tabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual(["true", "false", "false"]);
  expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1, -1]);
  expect(tabs.every((tab) => tab.classList.contains("t"))).toBe(true);
  expect(tabs[0]?.querySelector(".i #ia")).not.toBeNull();
  expect(tabs[1]?.querySelector(".i")).toBeNull();
  fireEvent.click(tabs[2]!);
  expect(value()).toBe("c");
  fireEvent.keyDown(tabs[2]!, { key: "ArrowRight" });
  expect(value()).toBe("a");
  fireEvent.keyDown(tabs[0]!, { key: "ArrowLeft" });
  expect(value()).toBe("c");
  expect(tabs[2]?.getAttribute("aria-selected")).toBe("true");
});

test("Accordion takes a custom icon and slot classes", () => {
  const { container } = render(() => (
    <Accordion
      title="SIDE"
      defaultValue
      icon={(open) => <b>{open ? "open" : "shut"}</b>}
      classes={{ header: "hd", icon: "ic", title: "ti", body: "bd" }}
    >
      kid
    </Accordion>
  ));
  expect(container.querySelector(".hd")).not.toBeNull();
  expect(container.querySelector(".ic b")?.textContent).toBe("open");
  expect(container.querySelector(".ti")?.textContent).toBe("SIDE");
  expect(container.querySelector(".bd")?.textContent).toBe("kid");
  fireEvent.click(container.querySelector(".hd")!);
  expect(container.querySelector(".ic b")?.textContent).toBe("shut");
  expect(container.querySelector(".bd")).toBeNull();
});

test("Panel padding sets the body padding and nothing else", () => {
  const { container } = render(() => <Panel padding="1ch 2ch">x</Panel>);
  const body = container.querySelector(`.${panelStyles.body}`) as HTMLElement;
  expect(body.style.padding).toBe("1ch 2ch");
  expect(container.querySelector("section")!.hasAttribute("style")).toBe(false);
});

test("Panel without padding leaves the body unstyled", () => {
  const { container } = render(() => <Panel>x</Panel>);
  expect(container.querySelector(`.${panelStyles.body}`)!.hasAttribute("style")).toBe(false);
});

test("Navigation renders its logo button unless logo is false", () => {
  const plain = render(() => <Navigation logo="L" left="l" right="r" />);
  expect(plain.container.querySelector("button")?.textContent).toBe("L");
  expect(plain.container.querySelector("nav")?.children).toHaveLength(4);
  plain.unmount();
  const bare = render(() => (
    <Navigation logo={false} left="l" right="r">
      mid
    </Navigation>
  ));
  expect(bare.container.querySelector("button")).toBeNull();
  expect(bare.container.querySelector("a")).toBeNull();
  expect(bare.container.querySelector("nav")?.children).toHaveLength(3);
  expect(bare.container.querySelector("nav")?.textContent).toBe("lmidr");
});

test("Tabs with panels renders the selected panel with wired ids and works uncontrolled", () => {
  let changes = 0;
  const { container } = render(() => (
    <Tabs
      items={[
        { id: "a", label: "A", panel: <b id="pa">first</b> },
        { id: "b", label: "B", panel: <b id="pb">second</b> },
      ]}
      defaultValue="a"
      onChange={() => changes++}
      classes={{ panel: "pn" }}
    />
  ));
  const tabs = [...container.querySelectorAll<HTMLElement>("[role='tab']")];
  const panel = () => container.querySelector<HTMLElement>("[role='tabpanel']");
  expect(container.querySelectorAll("[role='tabpanel']")).toHaveLength(1);
  expect(panel()?.textContent).toBe("first");
  expect(panel()?.classList.contains("pn")).toBe(true);
  expect(panel()?.getAttribute("aria-labelledby")).toBe(tabs[0]?.id);
  expect(tabs[0]?.getAttribute("aria-controls")).toBe(panel()?.id);
  expect(tabs[0]?.id).not.toBe("");
  fireEvent.keyDown(tabs[0]!, { key: "ArrowRight" });
  expect(changes).toBe(1);
  expect(tabs[1]?.getAttribute("aria-selected")).toBe("true");
  expect(panel()?.textContent).toBe("second");
  expect(panel()?.getAttribute("aria-labelledby")).toBe(tabs[1]?.id);
  expect(container.querySelector("#pa")).toBeNull();
});

test("Tabs mounts a getter panel only while its tab is selected", () => {
  let built = 0;
  const items = [
    { id: "a", label: "A" },
    {
      id: "b",
      label: "B",
      get panel() {
        built++;
        return <i id="lazy" />;
      },
    },
  ];
  const [value, setValue] = createSignal("a");
  const { container } = render(() => <Tabs items={items} value={value()} onChange={setValue} />);
  expect(container.querySelector("[role='tabpanel']")).toBeNull();
  expect(built).toBe(0);
  setValue("b");
  expect(container.querySelector("#lazy")).not.toBeNull();
  expect(built).toBeGreaterThan(0);
});

test("Tabs without any panel renders only the tablist, with no ids", () => {
  const { container } = render(() => <Tabs items={[{ id: "a", label: "A" }]} />);
  expect(container.children).toHaveLength(1);
  expect(container.querySelector("[role='tab']")?.hasAttribute("id")).toBe(false);
  expect(container.querySelector("[role='tab']")?.getAttribute("aria-selected")).toBe("true");
});
