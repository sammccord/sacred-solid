import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal, flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { BarProgress } from "../src/components/BarProgress.tsx";
import { Button } from "../src/components/Button.tsx";
import { Checkbox } from "../src/components/Checkbox.tsx";
import { DataTable } from "../src/components/DataTable.tsx";
import { DatePicker } from "../src/components/DatePicker.tsx";
import { Dialog } from "../src/components/Dialog.tsx";
import { Input } from "../src/components/Input.tsx";
import { NumberRangeSlider } from "../src/components/NumberRangeSlider.tsx";
import { RadioButtonGroup } from "../src/components/RadioButtonGroup.tsx";
import { Select } from "../src/components/Select.tsx";
import { TextArea } from "../src/components/TextArea.tsx";

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function textBefore(el: Element | null | undefined) {
  let node = el?.previousSibling;
  while (node?.nodeType === Node.COMMENT_NODE) node = node.previousSibling;
  return node?.textContent;
}

function type(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  el.value = value;
  el.setSelectionRange(value.length, value.length);
  fireEvent.input(el);
}

describe("Button", () => {
  test("primary, secondary and disabled variants", () => {
    const onClick = vi.fn();
    const { container } = render(() => (
      <>
        <Button onClick={onClick}>a</Button>
        <Button variant="SECONDARY">b</Button>
        <Button isDisabled>c</Button>
      </>
    ));
    const [primary, secondary, disabled] = Array.from(container.children);
    expect(primary?.tagName).toBe("BUTTON");
    expect(primary?.className).toMatch(/primary/);
    expect(secondary?.className).toMatch(/secondary/);
    expect(disabled?.tagName).toBe("DIV");
    expect(disabled?.className).toMatch(/disabled/);
    fireEvent.click(primary as Element);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("Input", () => {
  test("mirrors typed text, calls onChange, masks passwords", () => {
    const onChange = vi.fn();
    const { container } = render(() => (
      <Input label="Name" name="n" type="password" onChange={onChange} caretChars="_" />
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(container.querySelector("label")?.getAttribute("for")).toBe(input.id);
    type(input, "abc");
    expect(onChange).toHaveBeenCalledTimes(1);
    const displayed = container.querySelector('[class*="displayed"]');
    expect(displayed?.textContent).toBe("•••_");
    expect(input.value).toBe("abc");
  });

  test("shows the placeholder only while empty and tracks focus", () => {
    const { container } = render(() => <Input placeholder="type here" name="n" />);
    const input = container.querySelector("input") as HTMLInputElement;
    const displayed = container.querySelector('[class*="displayed"]') as HTMLElement;
    expect(displayed.textContent).toBe("type here");
    expect(displayed.className).toMatch(/placeholder/);
    fireEvent.focus(input);
    expect((container.firstElementChild as HTMLElement).className).toMatch(/focused/);
    type(input, "x");
    expect(displayed.textContent).toBe("x");
    expect(displayed.className).not.toMatch(/placeholder/);
    fireEvent.blur(input);
    expect((container.firstElementChild as HTMLElement).className).not.toMatch(/focused/);
  });

  test("controlled value prop replaces the text and puts the caret at the end", () => {
    const [value, setValue] = createSignal("one");
    const { container } = render(() => <Input value={value()} name="n" />);
    const displayed = container.querySelector('[class*="displayed"]') as HTMLElement;
    expect(displayed.textContent).toBe("one");
    setValue("three");
    flush();
    expect(displayed.textContent).toBe("three");
    expect((container.querySelector("input") as HTMLInputElement).value).toBe("three");
  });

  test("caret follows selection changes", () => {
    const { container } = render(() => <Input defaultValue="hello" isBlink={false} name="n" />);
    const input = container.querySelector("input") as HTMLInputElement;
    const displayed = container.querySelector('[class*="displayed"]') as HTMLElement;
    input.focus();
    input.setSelectionRange(2, 2);
    fireEvent.keyUp(input, { key: "ArrowLeft" });
    expect(textBefore(displayed.querySelector('[class*="block"]'))).toBe("he");
    expect(displayed.textContent).toBe("hello");
  });

  test("ArrowDown and ArrowUp move focus to the neighbour and park the caret on re-entry", () => {
    const { container } = render(() => (
      <>
        <button id="before">b</button>
        <Input defaultValue="hello" name="n" isBlink={false} />
        <button id="after">a</button>
      </>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    const caretLeftOf = () => textBefore(container.querySelector('[class*="block"]'));
    input.focus();
    const down = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe("after");
    input.focus();
    flush();
    expect(input.selectionStart).toBe(5);
    expect(caretLeftOf()).toBe("hello");

    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }),
    );
    expect(document.activeElement?.id).toBe("before");
    input.focus();
    flush();
    expect(input.selectionStart).toBe(0);
    expect(caretLeftOf()).toBe("");
  });
});

describe("TextArea", () => {
  test("mirrors typed text and calls onChange", () => {
    const onChange = vi.fn();
    const { container } = render(() => <TextArea onChange={onChange} placeholder="notes" />);
    const area = container.querySelector("textarea") as HTMLTextAreaElement;
    const displayed = container.querySelector('[class*="displayed"]') as HTMLElement;
    expect(displayed.textContent).toBe("notes");
    type(area, "line one");
    expect(displayed.textContent).toBe("line one");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("autoPlay types the string out one character per interval and stops", async () => {
    vi.useFakeTimers();
    const { container } = render(() => <TextArea autoPlay="abc" autoPlaySpeedMS={10} />);
    const displayed = container.querySelector('[class*="displayed"]') as HTMLElement;
    expect(displayed.textContent).toBe("");
    await vi.advanceTimersByTimeAsync(10);
    expect(displayed.textContent).toBe("a");
    await vi.advanceTimersByTimeAsync(20);
    expect(displayed.textContent).toBe("abc");
    await vi.advanceTimersByTimeAsync(100);
    expect(displayed.textContent).toBe("abc");
  });

  test("typing cancels autoPlay", async () => {
    vi.useFakeTimers();
    const { container } = render(() => <TextArea autoPlay="abcdef" autoPlaySpeedMS={10} />);
    const area = container.querySelector("textarea") as HTMLTextAreaElement;
    await vi.advanceTimersByTimeAsync(20);
    type(area, "zz");
    await vi.advanceTimersByTimeAsync(100);
    expect(container.querySelector('[class*="displayed"]')?.textContent).toBe("zz");
  });

  test("ArrowDown on the last line moves focus to the next focusable", () => {
    const { container } = render(() => (
      <>
        <TextArea />
        <button id="next">n</button>
      </>
    ));
    const area = container.querySelector("textarea") as HTMLTextAreaElement;
    area.focus();
    fireEvent.keyDown(area, { key: "ArrowDown" });
    expect(document.activeElement?.id).toBe("next");
  });
});

describe("Checkbox", () => {
  test("is a named checkbox that toggles its mark, the checked class and reports changes", () => {
    const onChange = vi.fn();
    const { container } = render(() => (
      <Checkbox name="agree" onChange={onChange}>
        Agree
      </Checkbox>
    ));
    const box = screen.getByRole("checkbox", { name: /Agree/ });
    expect(box.getAttribute("aria-checked")).toBe("false");
    expect(box.textContent).toBe("\u00A0");
    fireEvent.click(box);
    expect(box.getAttribute("aria-checked")).toBe("true");
    expect(box.textContent).toBe("╳");
    expect((container.firstElementChild as HTMLElement).className).toMatch(/checked/);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test("defaultChecked starts checked, a press toggles it, the value submits under name", () => {
    const { container } = render(() => (
      <form>
        <Checkbox name="c" defaultChecked>
          C
        </Checkbox>
      </form>
    ));
    const box = screen.getByRole("checkbox", { name: /C/ });
    expect(box.textContent).toBe("╳");
    expect(new FormData(container.querySelector("form")!).get("c")).toBe("on");
    fireEvent.click(box);
    expect(box.getAttribute("aria-checked")).toBe("false");
    expect(box.textContent).toBe("\u00A0");
  });

  test("ArrowRight focuses the next focusable", () => {
    render(() => (
      <>
        <Checkbox name="c">C</Checkbox>
        <button id="after">a</button>
      </>
    ));
    const box = screen.getByRole("checkbox");
    box.focus();
    fireEvent.keyDown(box, { key: "ArrowRight" });
    expect(document.activeElement?.id).toBe("after");
  });
});

describe("RadioButtonGroup", () => {
  test("names its radios, moves the selection on click and arrows, reports the value", () => {
    const onChange = vi.fn();
    const { container } = render(() => (
      <form>
        <RadioButtonGroup
          name="pick"
          label="Pick one"
          defaultValue="b"
          onChange={onChange}
          options={[
            { value: "a", label: "Alpha" },
            { value: "b", label: "Beta" },
          ]}
        />
      </form>
    ));
    expect(screen.getByRole("radiogroup", { name: "Pick one" })).toBeTruthy();
    const radios = screen.getAllByRole("radio");
    const checked = () => radios.map((radio) => radio.getAttribute("aria-checked"));
    expect(
      radios.map(
        (radio) => radio.textContent === "" && radio.getAttribute("aria-labelledby") !== null,
      ),
    ).toEqual([true, true]);
    expect(screen.getByRole("radio", { name: /Alpha/ })).toBe(radios[0]);
    expect(checked()).toEqual(["false", "true"]);
    fireEvent.click(radios[0]!);
    expect(checked()).toEqual(["true", "false"]);
    expect(onChange).toHaveBeenLastCalledWith("a");
    expect(container.querySelectorAll('[data-slot="radio-indicator"]')).toHaveLength(1);
    radios[0]!.focus();
    fireEvent.keyDown(radios[0]!, { key: "ArrowDown" });
    expect(checked()).toEqual(["false", "true"]);
    expect(document.activeElement).toBe(radios[1]);
    expect(new FormData(container.querySelector("form")!).get("pick")).toBe("b");
  });
});

describe("Select", () => {
  const options = ["red", "green", "blue"];
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

  test("names the trigger, opens on click, selects with a click, reports and closes", async () => {
    const onChange = vi.fn();
    render(() => (
      <Select name="c" label="Color" options={options} placeholder="pick" onChange={onChange} />
    ));
    const trigger = screen.getByRole("combobox", { name: "Color" });
    expect(trigger.textContent).toBe("pick");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const items = screen.getAllByRole("option");
    expect(items.map((i) => i.textContent)).toEqual(options);
    fireEvent.click(items[1]!);
    await settle();
    flush();
    expect(onChange).toHaveBeenCalledWith("green");
    expect(trigger.textContent).toBe("green");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  test("keyboard: ArrowDown opens on the selected option, arrows move, Enter picks", async () => {
    const onChange = vi.fn();
    render(() => (
      <Select name="c" label="Color" options={options} defaultValue="green" onChange={onChange} />
    ));
    const trigger = screen.getByRole("combobox", { name: "Color" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await settle();
    flush();
    const highlighted = () => document.querySelector("[data-highlighted]")?.textContent;
    expect(highlighted()).toBe("green");
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(highlighted()).toBe("blue");
    fireEvent.keyDown(document.activeElement!, { key: "Enter" });
    await settle();
    flush();
    expect(onChange).toHaveBeenCalledWith("blue");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  test("Escape closes the list and returns focus to the trigger", async () => {
    const onChange = vi.fn();
    render(() => <Select name="c" label="Color" options={options} onChange={onChange} />);
    const trigger = screen.getByRole("combobox", { name: "Color" });
    fireEvent.click(trigger);
    await settle();
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await settle();
    flush();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
    expect(onChange).not.toHaveBeenCalled();
  });

  test("the arrow beside the trigger toggles the list and the value submits under name", async () => {
    const { container } = render(() => (
      <form>
        <Select name="color" label="Color" options={options} defaultValue="blue" />
      </form>
    ));
    const trigger = screen.getByRole("combobox", { name: "Color" });
    fireEvent.click(container.querySelector("figure")!);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(container.querySelector("figure")!);
    await settle();
    flush();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector<HTMLInputElement>('[name="color"]')?.value).toBe("blue");
  });
});

describe("DatePicker", () => {
  test("renders a 42 cell grid for the given month and switches months", () => {
    const { container } = render(() => <DatePicker year={2024} month={2} />);
    const days = container.querySelector('[class*="days"]') as HTMLElement;
    expect(days.children.length).toBe(42);
    expect(container.querySelector('[class*="date"]')?.textContent).toBe("2024 FEBRUARY");
    const labelled = days.querySelectorAll("[aria-label]");
    expect(labelled.length).toBe(29);
    expect(labelled[0]?.getAttribute("aria-label")).toBe("2024-02-01");
    expect(days.children[4]?.getAttribute("aria-label")).toBe("2024-02-01");
    fireEvent.click(screen.getByLabelText("Next month"));
    expect(container.querySelector('[class*="date"]')?.textContent).toBe("2024 MARCH");
    expect(days.querySelectorAll("[aria-label]").length).toBe(31);
    expect(days.children.length).toBe(42);
  });

  test("Previous month wraps to December of the previous year", () => {
    const { container } = render(() => <DatePicker year={2024} month={1} />);
    fireEvent.click(screen.getByLabelText("Previous month"));
    expect(container.querySelector('[class*="date"]')?.textContent).toBe("2023 DECEMBER");
    expect(screen.getAllByText("SU").length).toBe(1);
  });
});

describe("NumberRangeSlider", () => {
  test("pads the amount to the width of max and follows the slider", () => {
    const { container } = render(() => <NumberRangeSlider defaultValue={42} max={5000} />);
    const slider = screen.getByRole("slider") as HTMLInputElement;
    const amount = container.querySelector('[class*="amount"]') as HTMLElement;
    expect(amount.textContent).toBe("0042");
    expect(slider.value).toBe("42");
    slider.value = "1234";
    fireEvent.input(slider);
    expect(amount.textContent).toBe("1234");
    expect(slider.getAttribute("max")).toBe("5000");
  });
});

describe("Dialog", () => {
  test("renders title and content and wires OK and Cancel", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(() => (
      <Dialog title="Sure?" onConfirm={onConfirm} onCancel={onCancel}>
        Delete it
      </Dialog>
    ));
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.querySelector("header")?.textContent).toBe("Sure?");
    expect(dialog.querySelector("article")?.textContent).toBe("Delete it");
    expect(dialog.getAttribute("aria-describedby")).toBe(dialog.querySelector("article")?.id);
    fireEvent.click(screen.getByText("OK"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

describe("BarProgress", () => {
  test("fills to the progress fraction of the default ten characters", () => {
    render(() => <BarProgress progress={50} fillChar="#" />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("50");
    expect(bar.textContent).toBe("#" + "#".repeat(5));
  });

  test("intervalRate cycles progress by ten and wraps after 100", async () => {
    vi.useFakeTimers();
    render(() => <BarProgress intervalRate={100} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("0");
    await vi.advanceTimersByTimeAsync(300);
    expect(bar.getAttribute("aria-valuenow")).toBe("30");
    await vi.advanceTimersByTimeAsync(700);
    expect(bar.getAttribute("aria-valuenow")).toBe("100");
    await vi.advanceTimersByTimeAsync(100);
    expect(bar.getAttribute("aria-valuenow")).toBe("0");
  });
});

describe("DataTable", () => {
  const data = [
    ["NAME", "PRICE"],
    ["a", "1"],
    ["b", "2"],
  ];

  test("renders rows and cells with gradient backgrounds", () => {
    const { container } = render(() => <DataTable data={data} />);
    const rows = container.querySelectorAll("tr");
    expect(rows.length).toBe(3);
    expect(rows[1]?.querySelectorAll("td")[1]?.textContent).toBe("1");
    expect(
      (container.querySelectorAll<HTMLElement>("td")[0] as HTMLElement).style.backgroundColor,
    ).toBe("rgba(98, 98, 98, 0.5)");
    expect(
      (container.querySelectorAll<HTMLElement>("td")[1] as HTMLElement).style.backgroundColor,
    ).toBe("rgba(255, 255, 255, 0.45)");
  });

  test("updating a cell keeps the same node and flags it as changed", () => {
    const [rowsData, setRowsData] = createSignal(data);
    const { container } = render(() => <DataTable data={rowsData()} />);
    const cell = container.querySelectorAll("tr")[1]?.querySelectorAll("td")[1] as HTMLElement;
    const sibling = container.querySelectorAll("tr")[2]?.querySelectorAll("td")[1] as HTMLElement;
    expect(cell.className).not.toMatch(/changed/);
    setRowsData([data[0] ?? [], ["a", "9"], data[2] ?? []]);
    flush();
    const after = container.querySelectorAll("tr")[1]?.querySelectorAll("td")[1] as HTMLElement;
    expect(after).toBe(cell);
    expect(cell.textContent).toBe("9");
    expect(cell.className).toMatch(/changed/);
    expect(sibling.className).not.toMatch(/changed/);
  });

  test("rows are focusable and arrow keys are swallowed by the table", () => {
    const { container } = render(() => <DataTable data={data} />);
    const row = container.querySelectorAll("tr")[1] as HTMLElement;
    expect(row.tabIndex).toBe(0);
    row.focus();
    const down = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true,
    });
    row.dispatchEvent(down);
    expect(down.defaultPrevented).toBe(true);
  });

  test("clicking a row alerts", () => {
    const alertSpy = vi.fn();
    vi.stubGlobal("alert", alertSpy);
    const { container } = render(() => <DataTable data={data} />);
    fireEvent.click(container.querySelectorAll("tr")[1] as HTMLElement);
    expect(alertSpy).toHaveBeenCalledWith("testing");
  });
});
