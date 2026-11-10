import { render } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { AS400 } from "../src/components/examples/AS400.tsx";
import { CLITemplate } from "../src/components/examples/CLITemplate.tsx";
import { DashboardRadar } from "../src/components/examples/DashboardRadar.tsx";
import { Denabase } from "../src/components/examples/Denabase.tsx";
import { InvoiceTemplate } from "../src/components/examples/InvoiceTemplate.tsx";
import { ResultsList } from "../src/components/examples/ResultsList.tsx";
import { UpdatingDataTable } from "../src/components/examples/UpdatingDataTable.tsx";

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("AS400", () => {
  test("renders both menu screens with a blinking prompt", () => {
    const { container } = render(() => <AS400 />);
    const text = container.textContent ?? "";
    expect(text).toContain("Advance Sales Menu");
    expect(text).toContain("24. Sign Off");
    expect(text).toContain("ITEM ACTIVITY INQUIRY");
    expect(text).toContain("95 TACOMA");
    expect(container.querySelectorAll("textarea")).toHaveLength(1);
  });

  test("applies inline min-width to the menu tables", () => {
    const { container } = render(() => <AS400 />);
    const wide = [...container.querySelectorAll<HTMLElement>("[style]")].filter(
      (el) => el.style.minWidth === "71ch",
    );
    expect(wide).toHaveLength(6);
  });
});

describe("CLITemplate", () => {
  test("pads summary keys to 24 columns and shows the primitives table", () => {
    const { container } = render(() => <CLITemplate />);
    const text = container.textContent ?? "";
    expect(text).toContain(`${"PROJECT".padEnd(24, " ")}www-sacred`);
    expect(text).toContain("window.ts");
    expect(text).toContain("EXIT");
    expect(text).toContain("SELECT");
  });
});

describe("InvoiceTemplate", () => {
  test("lays summary rows out as flex space-between pairs", () => {
    const { container } = render(() => <InvoiceTemplate />);
    const rows = [...container.querySelectorAll<HTMLElement>("div")].filter(
      (el) => el.style.display === "flex" && el.style.justifyContent === "space-between",
    );
    expect(rows.map((row) => row.textContent)).toEqual([
      "Subtotal$4,712.00",
      "Discount$-471.20",
      "Net Sales Total$4,240.80",
      "Tax$0.00",
      "Total$4,240.80",
    ]);
    expect(container.textContent).toContain("INVOICE #1047");
    expect(container.textContent).toContain("Cloud Infrastructure (Mar)");
  });
});

describe("ResultsList", () => {
  test("shows the page title, every result and both pagination buttons", () => {
    const { container } = render(() => <ResultsList />);
    const text = container.textContent ?? "";
    expect(text).toContain("RESULTS [Page 1 of 5]");
    expect(text).toContain("Travel Reimbursement");
    expect(text).toContain("PREV");
    expect(text).toContain("NEXT");
  });
});

describe("UpdatingDataTable", () => {
  const DATA = [
    ["SYMBOL", "NAME", "PRICE", "HOLDINGS"],
    ["AAA", "Alpha", "$10.00", "5"],
    ["BBB", "Beta", "$30.00", "7"],
    ["CCC", "Gamma", "$20.00", "9"],
  ];

  test("re-sorts rows by price descending each second and keeps the header", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const { container } = render(() => <UpdatingDataTable data={DATA} />);
    const order = () => (container.textContent ?? "").match(/AAA|BBB|CCC/g);
    expect(order()).toEqual(["AAA", "BBB", "CCC"]);

    vi.advanceTimersByTime(1000);
    expect(order()).toEqual(["BBB", "CCC", "AAA"]);
    expect(container.textContent).toContain("SYMBOL");
    expect(container.textContent).toContain("$30.00");
  });

  test("clamps holdings at one and scales prices by the random factor", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { container } = render(() => <UpdatingDataTable data={DATA} />);
    vi.advanceTimersByTime(1000);
    const text = container.textContent ?? "";
    expect(text).toContain("$28.50");
    expect(text).toContain("$19.00");
    expect(text).toContain("$9.50");
    expect(text).not.toContain("$30.00");
    expect(text.match(/\$\d+\.\d\d1/g)).toHaveLength(3);
  });

  test("stops ticking after unmount", () => {
    vi.useFakeTimers();
    const random = vi.spyOn(Math, "random");
    const { unmount } = render(() => <UpdatingDataTable data={DATA} />);
    unmount();
    vi.advanceTimersByTime(3000);
    expect(random).not.toHaveBeenCalled();
  });
});

describe("DashboardRadar", () => {
  test("renders four radar markers, the sidebar readouts and the sphere", () => {
    const { container } = render(() => <DashboardRadar />);
    expect(container.querySelectorAll('[class*="cross"]')).toHaveLength(4);
    expect(container.querySelectorAll('[class*="square"]')).toHaveLength(16);
    const text = container.textContent ?? "";
    expect(text).toContain("DEORBITAL DESCENT");
    expect(text).toContain("SPEED 78.26");
    expect(text).toContain("N .36");
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

describe("Denabase", () => {
  test("renders the genome block and the record sections", () => {
    const { container } = render(() => <Denabase />);
    const text = container.textContent ?? "";
    expect(text).toContain("TR5342120027455925897981");
    expect(text).toContain("NO DATA");
    expect(text).toContain("MORRILLCOLE");
    expect(container.querySelectorAll('[class*="box"]')).toHaveLength(10);
    expect(container.querySelector('[class*="dna"]')?.querySelectorAll("br")).toHaveLength(20);
  });
});
