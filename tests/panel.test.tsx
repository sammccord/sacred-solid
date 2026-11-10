import { render } from "@solidjs/testing-library";
import { readFileSync } from "node:fs";
import { createSignal } from "solid-js";
import { expect, test } from "vite-plus/test";
import { topLevelRules } from "../scripts/docs/css.ts";
import { KeyHint } from "../src/components/KeyHint.tsx";
import { Panel } from "../src/components/Panel.tsx";
import styles from "../src/components/Panel.module.css";
import keyStyles from "../src/components/KeyHint.module.css";

function root(container: HTMLElement) {
  return container.firstElementChild as HTMLElement;
}

test("a Panel without title, icon or meta renders only the body", () => {
  const { container } = render(() => <Panel>content</Panel>);
  expect(root(container).tagName).toBe("SECTION");
  expect(root(container).children).toHaveLength(1);
  expect(container.querySelector("header")).toBeNull();
  expect(root(container).textContent).toBe("content");
});

test.each([
  ["title", { title: "T" }],
  ["icon", { icon: <i /> }],
  ["meta", { meta: "m" }],
])("a %s alone renders the header", (_name, props) => {
  const { container } = render(() => <Panel {...props}>x</Panel>);
  expect(container.querySelector("header")).not.toBeNull();
  expect(root(container).children).toHaveLength(2);
});

test("the header orders icon, title, gap and meta", () => {
  const { container } = render(() => (
    <Panel icon={<i id="i" />} title="T" meta={<b id="m" />}>
      x
    </Panel>
  ));
  const header = container.querySelector("header")!;
  expect(header.children).toHaveLength(4);
  expect(header.children[0]?.querySelector("#i")).not.toBeNull();
  expect(header.children[1]?.tagName).toBe("H2");
  expect(header.children[1]?.textContent).toBe("T");
  expect(header.children[3]?.querySelector("#m")).not.toBeNull();
});

test("tone picks the header class and defaults to outline", () => {
  const [tone, setTone] = createSignal<"outline" | "filled" | undefined>(undefined);
  const { container } = render(() => (
    <Panel title="T" tone={tone()}>
      x
    </Panel>
  ));
  const header = container.querySelector("header")!;
  expect(header.classList.contains(styles.outline!)).toBe(true);
  expect(header.classList.contains(styles.filled!)).toBe(false);
  setTone("filled");
  expect(header.classList.contains(styles.filled!)).toBe(true);
  expect(header.classList.contains(styles.outline!)).toBe(false);
});

test("aug and theme land on the root section only", () => {
  const { container } = render(() => (
    <Panel
      title="T"
      class="mine"
      aug={{ tl: "clip", border: true, inlay: true }}
      theme={{ line: "cyan" }}
    >
      x
    </Panel>
  ));
  const hosts = container.querySelectorAll("[data-augmented-ui]");
  expect(hosts).toHaveLength(1);
  expect(hosts[0]).toBe(root(container));
  expect(root(container).getAttribute("data-augmented-ui")).toBe("tl-clip border inlay");
  expect(root(container).hasAttribute("data-aug-border")).toBe(true);
  expect(root(container).hasAttribute("data-aug-inlay")).toBe(true);
  expect(root(container).style.getPropertyValue("--theme-line")).toBe("cyan");
  expect(root(container).classList.contains("mine")).toBe(true);
  expect(root(container).classList.contains(styles.root!)).toBe(true);
});

test("the module strips its line, fill and elevation through :where rules at the end", () => {
  const rules = topLevelRules(readFileSync("src/components/Panel.module.css", "utf8"));
  const stripped = rules.filter((rule) => rule.selector.includes(":where([data-aug"));
  expect(stripped.map((rule) => rule.selector)).toEqual([
    ".root:where([data-aug-border])",
    ".root:where([data-aug-inlay]) > .body",
    ".root:where([data-augmented-ui])",
  ]);
  expect(rules.slice(-3).map((rule) => rule.selector)).toEqual(
    stripped.map((rule) => rule.selector),
  );
});

test("KeyHint renders one cap per key and a label, long names get the small class", () => {
  const { container } = render(() => (
    <KeyHint keys={["C", "ESC"]} aug={{ tl: "clip" }} theme={{ controlForeground: "cyan" }}>
      CLOSE
    </KeyHint>
  ));
  const hint = container.firstElementChild as HTMLElement;
  const caps = hint.querySelectorAll("kbd");
  expect([...caps].map((cap) => cap.textContent)).toEqual(["C", "ESC"]);
  expect(caps[0]?.classList.contains(keyStyles.long!)).toBe(false);
  expect(caps[1]?.classList.contains(keyStyles.long!)).toBe(true);
  expect(hint.lastElementChild?.textContent).toBe("CLOSE");
  expect(hint.getAttribute("data-augmented-ui")).toBe("tl-clip");
  expect(hint.style.getPropertyValue("--theme-control-foreground")).toBe("cyan");
  expect(container.querySelectorAll("[data-augmented-ui]")).toHaveLength(1);
});

test("KeyHint follows key changes", () => {
  const [keys, setKeys] = createSignal(["H"]);
  const { container } = render(() => <KeyHint keys={keys()}>HELP</KeyHint>);
  expect(container.querySelectorAll("kbd")).toHaveLength(1);
  setKeys(["H", "F"]);
  expect(container.querySelectorAll("kbd")).toHaveLength(2);
});
