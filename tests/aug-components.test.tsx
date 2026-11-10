import { render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { beforeAll, describe, expect, test } from "vite-plus/test";
import type { AugProps } from "../src/aug/index.ts";
import type { ThemeProps } from "../src/style/index.ts";
import { Badge, Card, Providers } from "../src/index.ts";
import { AUG, cases, THEME } from "./component-cases.tsx";
import { stubBrowserApis } from "./stubs.ts";

beforeAll(stubBrowserApis);

describe.each(cases)("%s", (_name, make) => {
  test("without aug or theme the DOM carries no augmented-ui or theme marks", () => {
    const { container, unmount } = render(() => <Providers>{make({})}</Providers>);
    expect(container.querySelectorAll("[data-augmented-ui], [data-aug-border]")).toHaveLength(0);
    expect(container.innerHTML).not.toContain("--aug-");
    expect(container.innerHTML).not.toMatch(/--theme-(?!line-height-base)/);
    unmount();
  });

  test("with aug exactly one element carries the attributes and the vars", () => {
    const { container, unmount } = render(() => <Providers>{make({ aug: AUG })}</Providers>);
    const hosts = container.querySelectorAll<HTMLElement>("[data-augmented-ui]");
    expect(hosts).toHaveLength(1);
    expect(hosts[0]?.getAttribute("data-augmented-ui")).toBe("tl-clip border");
    expect(hosts[0]?.hasAttribute("data-aug-border")).toBe(true);
    expect(hosts[0]?.hasAttribute("data-aug-inlay")).toBe(false);
    expect(hosts[0]?.style.getPropertyValue("--aug-tl")).toBe("9px");
    expect(hosts[0]?.style.getPropertyValue("--aug-border-all")).toBe("2px");
    unmount();
  });

  test("with theme exactly one element carries the vars and no aug marks", () => {
    const { container, unmount } = render(() => <Providers>{make({ theme: THEME })}</Providers>);
    const hosts = container.querySelectorAll<HTMLElement>("[style*='--theme-line:']");
    expect(hosts).toHaveLength(1);
    expect(hosts[0]?.style.getPropertyValue("--theme-line")).toBe("cyan");
    expect(hosts[0]?.style.getPropertyValue("--theme-surface-float")).toBe("rgb(0 0 0 / 0.5)");
    expect(container.querySelectorAll("[data-augmented-ui]")).toHaveLength(0);
    expect(container.querySelectorAll("[theme]")).toHaveLength(0);
    unmount();
  });

  test("aug and theme land on the same element", () => {
    const { container, unmount } = render(() => (
      <Providers>{make({ aug: AUG, theme: THEME })}</Providers>
    ));
    const hosts = container.querySelectorAll<HTMLElement>("[data-augmented-ui]");
    expect(hosts).toHaveLength(1);
    expect(hosts[0]?.style.getPropertyValue("--aug-tl")).toBe("9px");
    expect(hosts[0]?.style.getPropertyValue("--theme-line")).toBe("cyan");
    unmount();
  });
});

test("aug leaves the component's own style intact and wins no conflicts", () => {
  const { container } = render(() => (
    <Card aug={{ tl: { mixin: "clip", size: "9px" } }} style={{ color: "red", "--aug-tl": "3px" }}>
      x
    </Card>
  ));
  const host = container.querySelector<HTMLElement>("[data-augmented-ui]");
  expect(host?.style.color).toBe("red");
  expect(host?.style.getPropertyValue("--aug-tl")).toBe("3px");
});

test("aug follows prop changes", () => {
  const [aug, setAug] = createSignal<AugProps | undefined>({ tl: "clip" });
  const { container } = render(() => <Badge aug={aug()}>x</Badge>);
  const badge = container.querySelector<HTMLElement>("span");
  expect(badge?.getAttribute("data-augmented-ui")).toBe("tl-clip");
  setAug({ br: { mixin: "scoop", size: "4px" } });
  expect(badge?.getAttribute("data-augmented-ui")).toBe("br-scoop");
  expect(badge?.style.getPropertyValue("--aug-br")).toBe("4px");
  setAug(undefined);
  expect(badge?.hasAttribute("data-augmented-ui")).toBe(false);
});

test("theme follows prop changes and component style wins", () => {
  const [theme, setTheme] = createSignal<ThemeProps | undefined>({ line: "cyan" });
  const { container } = render(() => (
    <Badge theme={theme()} style={{ "--theme-ink": "red" }}>
      x
    </Badge>
  ));
  const badge = container.querySelector<HTMLElement>("span");
  expect(badge?.style.getPropertyValue("--theme-line")).toBe("cyan");
  setTheme({ ink: "blue", line: "pink" });
  expect(badge?.style.getPropertyValue("--theme-line")).toBe("pink");
  expect(badge?.style.getPropertyValue("--theme-ink")).toBe("red");
  setTheme(undefined);
  expect(badge?.style.getPropertyValue("--theme-line")).toBe("");
});
