import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { BarProgress } from "../src/components/BarProgress.tsx";
import { Button } from "../src/components/Button.tsx";
import { Checkbox } from "../src/components/Checkbox.tsx";
import { DataTable } from "../src/components/DataTable.tsx";
import { DatePicker } from "../src/components/DatePicker.tsx";
import { Dialog } from "../src/components/Dialog.tsx";
import { Input } from "../src/components/Input.tsx";
import { NumberRangeSlider } from "../src/components/NumberRangeSlider.tsx";
import { RadioButton } from "../src/components/RadioButton.tsx";
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
    expect(displayed.querySelector('[class*="block"]')?.previousSibling?.textContent).toBe("he");
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
    const caretLeftOf = () =>
      container.querySelector('[class*="block"]')?.previousSibling?.textContent;
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
    expect(input.selectionStart).toBe(5);
    expect(caretLeftOf()).toBe("hello");

    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }),
    );
    expect(document.activeElement?.id).toBe("before");
    input.focus();
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

  test("autoPlay types the string out one character per interval and stops", () => {
    vi.useFakeTimers();
    const { container } = render(() => <TextArea autoPlay="abc" autoPlaySpeedMS={10} />);
    const displayed = container.querySelector('[class*="displayed"]') as HTMLElement;
    expect(displayed.textContent).toBe("");
    vi.advanceTimersByTime(10);
    expect(displayed.textContent).toBe("a");
    vi.advanceTimersByTime(20);
    expect(displayed.textContent).toBe("abc");
    vi.advanceTimersByTime(100);
    expect(displayed.textContent).toBe("abc");
  });

  test("typing cancels autoPlay", () => {
    vi.useFakeTimers();
    const { container } = render(() => <TextArea autoPlay="abcdef" autoPlaySpeedMS={10} />);
    const area = container.querySelector("textarea") as HTMLTextAreaElement;
    vi.advanceTimersByTime(20);
    type(area, "zz");
    vi.advanceTimersByTime(100);
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
  test("toggles the mark and the checked class and reports changes", () => {
    const onChange = vi.fn();
    const { container } = render(() => (
      <Checkbox name="agree" onChange={onChange}>
        Agree
      </Checkbox>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    const label = container.querySelector("label") as HTMLLabelElement;
    expect(label.getAttribute("for")).toBe("agree-checkbox");
    expect(label.textContent).toBe("\u00A0");
    fireEvent.click(input);
    expect(label.textContent).toBe("╳");
    expect((container.firstElementChild as HTMLElement).className).toMatch(/checked/);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain("Agree");
  });

  test("defaultChecked starts checked, Enter toggles it", () => {
    const { container } = render(() => <Checkbox name="c" defaultChecked />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.checked).toBe(true);
    expect(container.querySelector("label")?.textContent).toBe("╳");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input.checked).toBe(false);
    expect(container.querySelector("label")?.textContent).toBe("\u00A0");
  });

  test("ArrowRight focuses the next focusable", () => {
    const { container } = render(() => (
      <>
        <Checkbox name="c" />
        <button id="after">a</button>
      </>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.focus();
    fireEvent.keyDown(input, { key: "ArrowRight" });
    expect(document.activeElement?.id).toBe("after");
  });
});

describe("RadioButton", () => {
  test("selected renders the dot and fires onSelect on change and Enter", () => {
    const onSelect = vi.fn();
    const { container } = render(() => (
      <RadioButton name="g" value="a" selected onSelect={onSelect}>
        A
      </RadioButton>
    ));
    expect(container.querySelector('[class*="dot"]')).not.toBeNull();
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.checked).toBe(true);
    fireEvent.change(input);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith("a");
  });

  test("Tab is captured and moves focus forward", () => {
    const { container } = render(() => (
      <>
        <RadioButton name="g" value="a" />
        <button id="after">a</button>
      </>
    ));
    const input = container.querySelector("input") as HTMLInputElement;
    input.focus();
    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    input.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe("after");
  });
});

describe("RadioButtonGroup", () => {
  test("clicking an option moves the selection", () => {
    const { container } = render(() => (
      <RadioButtonGroup
        defaultValue="b"
        options={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ]}
      />
    ));
    const inputs = Array.from(container.querySelectorAll("input"));
    expect(inputs.map((i) => i.checked)).toEqual([false, true]);
    fireEvent.click(inputs[0] as HTMLInputElement);
    expect(inputs.map((i) => i.checked)).toEqual([true, false]);
    expect(container.querySelectorAll('[class*="dot"]').length).toBe(1);
    expect(container.textContent).toContain("Alpha");
  });
});

describe("Select", () => {
  const options = ["red", "green", "blue"];

  test("opens on click, selects with a click, reports and closes", () => {
    const onChange = vi.fn();
    render(() => <Select name="c" options={options} placeholder="pick" onChange={onChange} />);
    const button = screen.getByRole("button");
    expect(button.textContent).toBe("pick");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    const items = screen.getAllByRole("option");
    expect(items.map((i) => i.textContent)).toEqual(options);
    expect(items[0]?.getAttribute("aria-selected")).toBe("true");
    fireEvent.click(items[1] as HTMLElement);
    expect(onChange).toHaveBeenCalledWith("green");
    expect(button.textContent).toBe("green");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  test("keyboard: ArrowDown opens and focuses the selected option, arrows move, Enter picks", () => {
    const onChange = vi.fn();
    render(() => <Select name="c" options={options} defaultValue="green" onChange={onChange} />);
    const button = screen.getByRole("button");
    button.focus();
    fireEvent.keyDown(button, { key: "ArrowDown" });
    const items = screen.getAllByRole("option");
    expect(document.activeElement).toBe(items[1]);
    fireEvent.keyDown(items[1] as HTMLElement, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[2]);
    expect(items[2]?.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(items[2] as HTMLElement, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[2]);
    fireEvent.keyDown(items[2] as HTMLElement, { key: "ArrowUp" });
    expect(document.activeElement).toBe(items[1]);
    fireEvent.keyDown(items[1] as HTMLElement, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("green");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  test("Escape closes the menu and returns focus to the button", () => {
    render(() => <Select name="c" options={options} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.keyDown(screen.getAllByRole("option")[0] as HTMLElement, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(button);
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

  test("intervalRate cycles progress by ten and wraps after 100", () => {
    vi.useFakeTimers();
    render(() => <BarProgress intervalRate={100} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("0");
    vi.advanceTimersByTime(300);
    expect(bar.getAttribute("aria-valuenow")).toBe("30");
    vi.advanceTimersByTime(700);
    expect(bar.getAttribute("aria-valuenow")).toBe("100");
    vi.advanceTimersByTime(100);
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
