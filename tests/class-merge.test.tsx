import { render } from "@solidjs/testing-library";
import { beforeAll, describe, expect, test } from "vite-plus/test";
import { Providers } from "../src/index.ts";
import { classCases } from "./component-cases.tsx";
import { stubBrowserApis } from "./stubs.ts";

beforeAll(stubBrowserApis);

const BARE_ROOT: Record<string, string> = {
  IntDevLogo: "an svg with no library class, the caller class is its only class",
  MouseIcon: "an svg with no library class, the caller class is its only class",
  Sphere: "an svg with no library class, the caller class is its only class",
  ModalTrigger: "a span with display contents and no library class",
  OutsideElementEvent: "a detector div with no library class",
};

describe.each(classCases)("%s", (name, make) => {
  test("a caller class is added to the lib class and never replaces it", () => {
    const plain = render(() => <Providers>{make({})}</Providers>);
    const libClasses = [...plain.container.querySelectorAll("[class]")].map((element) =>
      element.getAttribute("class"),
    );
    plain.unmount();

    const { container } = render(() => <Providers>{make({ class: "mine" })}</Providers>);
    const mine = container.querySelectorAll(".mine");
    expect(mine.length, "the class reaches an element").toBeGreaterThan(0);
    const without = mine[0]!
      .getAttribute("class")!
      .split(" ")
      .filter((each) => each !== "mine");
    if (name in BARE_ROOT) {
      expect(without, BARE_ROOT[name]).toEqual([]);
      return;
    }
    expect(without.length, "the lib class survives").toBeGreaterThan(0);
    expect(libClasses).toContain(without.join(" "));
  });

  test("without a class the markup has no stray class text", () => {
    const { container } = render(() => <Providers>{make({})}</Providers>);
    expect(container.querySelectorAll(".mine")).toHaveLength(0);
    expect(container.innerHTML).not.toContain('class="undefined');
    expect(container.innerHTML).not.toContain("undefined undefined");
    expect(container.innerHTML).not.toMatch(/class=""/);
  });
});
