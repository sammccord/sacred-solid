import { readFileSync } from "node:fs";
import { render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { beforeAll, expect, test, vi } from "vite-plus/test";
import { BarProgress } from "../src/components/BarProgress.tsx";

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

function bar(container: HTMLElement) {
  return container.querySelector<HTMLElement>("[role='progressbar']")!;
}

test("the default variant keeps the measure span and the fill characters", () => {
  const { container } = render(() => <BarProgress progress={50} fillChar="#" />);
  const root = bar(container);
  expect(root.children).toHaveLength(1);
  expect(root.firstElementChild?.tagName).toBe("SPAN");
  expect(root.textContent).toBe("#" + "#".repeat(5));
  expect(root.classList).toHaveLength(1);
});

test("solid renders one fill div, no characters, and the same progressbar root", () => {
  const { container } = render(() => <BarProgress variant="solid" progress={40} />);
  const root = bar(container);
  expect(root.getAttribute("aria-valuenow")).toBe("40");
  expect(root.getAttribute("aria-valuemin")).toBe("0");
  expect(root.getAttribute("aria-valuemax")).toBe("100");
  expect(root.textContent).toBe("");
  expect(root.children).toHaveLength(1);
  expect((root.firstElementChild as HTMLElement).style.width).toBe("40%");
});

test("solid caps the fill at 100 percent and follows progress", () => {
  const [progress, setProgress] = createSignal(150);
  const { container } = render(() => <BarProgress variant="solid" progress={progress()} />);
  const fill = bar(container).firstElementChild as HTMLElement;
  expect(fill.style.width).toBe("100%");
  setProgress(25);
  expect(fill.style.width).toBe("25%");
  expect(bar(container).getAttribute("aria-valuenow")).toBe("25");
});

test("solid still takes aug and theme on the root", () => {
  const { container } = render(() => (
    <BarProgress
      variant="solid"
      progress={10}
      aug={{ tl: "clip" }}
      theme={{ surfaceInverse: "red" }}
    />
  ));
  const root = bar(container);
  expect(root.getAttribute("data-augmented-ui")).toBe("tl-clip");
  expect(root.style.getPropertyValue("--theme-surface-inverse")).toBe("red");
});

test("a caller style sets the solid height, the fill follows the root", () => {
  const { container } = render(() => (
    <BarProgress variant="solid" progress={50} style={{ height: "4px", width: "60px" }} />
  ));
  const root = bar(container);
  expect(root.style.height).toBe("4px");
  expect(root.style.width).toBe("60px");
  expect(readFileSync("src/components/BarProgress.module.css", "utf8")).toMatch(
    /\.fill \{[^}]*height: 100%;/,
  );
});
