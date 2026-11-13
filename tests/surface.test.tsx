import { render } from "@solidjs/testing-library";
import { createSignal, flush } from "solid-js";
import { expect, test } from "vite-plus/test";
import { Surface } from "../src/components/Surface.tsx";

function dropShadow(filter: string, color: string, size: string) {
  expect(filter).toMatch(/^drop-shadow\(/);
  expect(filter).toContain(color);
  expect(filter).toContain(size);
}

function parts(container: HTMLElement) {
  const root = container.firstElementChild as HTMLElement;
  const backdrop = root.children[0] as HTMLElement;
  const outer = root.children[1] as HTMLElement;
  const inner = outer.firstElementChild as HTMLElement;
  return { root, backdrop, outer, inner };
}

test("renders a root, a backdrop layer, a glow wrapper and the surface", () => {
  const { container } = render(() => <Surface>hello</Surface>);
  const { root, backdrop, outer, inner } = parts(container);
  expect(container.children).toHaveLength(1);
  expect(root.children).toHaveLength(2);
  expect(backdrop.getAttribute("aria-hidden")).toBe("true");
  expect(backdrop.children).toHaveLength(0);
  expect(outer.children).toHaveLength(1);
  expect(inner.textContent).toBe("hello");
});

test("without props there is no filter, no backdrop filter and no inline style", () => {
  const { container } = render(() => <Surface>x</Surface>);
  const { root, backdrop, outer, inner } = parts(container);
  for (const element of [root, backdrop, outer, inner]) {
    expect(element.hasAttribute("style")).toBe(false);
    expect(element.hasAttribute("data-augmented-ui")).toBe(false);
  }
});

test("glow puts a drop shadow with the default size on the outer element only", () => {
  const { container } = render(() => <Surface glow="cyan">x</Surface>);
  const { outer, inner } = parts(container);
  dropShadow(outer.style.filter, "cyan", "6px");
  expect(inner.style.filter).toBe("");
});

test("glowSize replaces the default blur radius", () => {
  const { container } = render(() => (
    <Surface glow="rgb(0 255 255 / 0.5)" glowSize="14px">
      x
    </Surface>
  ));
  dropShadow(parts(container).outer.style.filter, "0.5", "14px");
});

test("glowSize without glow draws nothing", () => {
  const { container } = render(() => <Surface glowSize="14px">x</Surface>);
  expect(parts(container).outer.hasAttribute("style")).toBe(false);
});

test("blur puts a backdrop filter on the backdrop layer, outside the glow wrapper", () => {
  const { container } = render(() => <Surface blur="8px">x</Surface>);
  const { backdrop, outer, inner } = parts(container);
  expect(backdrop.style.getPropertyValue("backdrop-filter")).toBe("blur(8px)");
  expect(outer.hasAttribute("style")).toBe(false);
  expect(inner.hasAttribute("style")).toBe(false);
});

test("the backdrop layer takes the clip of the aug and never its border or inlay", () => {
  const { container } = render(() => (
    <Surface aug={{ tl: { mixin: "clip", size: "9px" }, border: "1px", inlay: true }} blur="4px">
      x
    </Surface>
  ));
  const { backdrop, inner } = parts(container);
  expect(backdrop.getAttribute("data-augmented-ui")).toBe("tl-clip");
  expect(backdrop.hasAttribute("data-aug-border")).toBe(false);
  expect(backdrop.hasAttribute("data-aug-inlay")).toBe(false);
  expect(backdrop.style.getPropertyValue("--aug-tl")).toBe("9px");
  expect(backdrop.style.getPropertyValue("--aug-border-all")).toBe("");
  expect(inner.getAttribute("data-augmented-ui")).toBe("tl-clip border inlay");
});

test("an aug with only a border leaves the backdrop layer unclipped", () => {
  const { container } = render(() => <Surface aug={{ border: "1px" }}>x</Surface>);
  expect(parts(container).backdrop.hasAttribute("data-augmented-ui")).toBe(false);
});

test("the inner element carries aug, theme, style, class and forwarded attributes", () => {
  const { container } = render(() => (
    <Surface
      aug={{ tl: "clip", border: "1px" }}
      theme={{ surfaceFloat: "rgb(0 0 0 / 0.4)" }}
      blur="4px"
      class="mine"
      style={{ color: "red" }}
      id="s"
      role="note"
    >
      x
    </Surface>
  ));
  const { backdrop, outer, inner } = parts(container);
  expect(inner.getAttribute("data-augmented-ui")).toBe("tl-clip border");
  expect(inner.hasAttribute("data-aug-border")).toBe(true);
  expect(inner.style.getPropertyValue("--theme-surface-float")).toBe("rgb(0 0 0 / 0.4)");
  expect(inner.style.getPropertyValue("--aug-border-all")).toBe("1px");
  expect(inner.style.color).toBe("red");
  expect(backdrop.style.getPropertyValue("backdrop-filter")).toBe("blur(4px)");
  expect(inner.style.getPropertyValue("backdrop-filter")).toBe("");
  expect(inner.classList.contains("mine")).toBe(true);
  expect(inner.id).toBe("s");
  expect(inner.getAttribute("role")).toBe("note");
  expect(outer.hasAttribute("data-augmented-ui")).toBe(false);
  expect(outer.id).toBe("");
});

test("glow and blur follow prop changes", () => {
  const [glow, setGlow] = createSignal<string | undefined>("cyan");
  const [blur, setBlur] = createSignal<string | undefined>("4px");
  const { container } = render(() => (
    <Surface glow={glow()} blur={blur()}>
      x
    </Surface>
  ));
  const { backdrop, outer } = parts(container);
  dropShadow(outer.style.filter, "cyan", "6px");
  setGlow("pink");
  flush();
  setBlur("9px");
  flush();
  dropShadow(outer.style.filter, "pink", "6px");
  expect(backdrop.style.getPropertyValue("backdrop-filter")).toBe("blur(9px)");
  setGlow(undefined);
  flush();
  setBlur(undefined);
  flush();
  expect(outer.style.filter).toBe("");
  expect(backdrop.style.getPropertyValue("backdrop-filter")).toBe("");
});
