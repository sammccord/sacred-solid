import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, expect, test } from "vite-plus/test";

import { Message } from "../src/components/Message.tsx";
import { MessageViewer } from "../src/components/MessageViewer.tsx";
import { Navigation } from "../src/components/Navigation.tsx";
import { Popover } from "../src/components/Popover.tsx";
import { Row } from "../src/components/Row.tsx";
import { RowEllipsis } from "../src/components/RowEllipsis.tsx";
import { RowSpaceBetween } from "../src/components/RowSpaceBetween.tsx";
import { SidebarLayout } from "../src/components/SidebarLayout.tsx";
import { SimpleTable } from "../src/components/SimpleTable.tsx";
import { Table } from "../src/components/Table.tsx";
import { TableColumn } from "../src/components/TableColumn.tsx";
import { TableRow } from "../src/components/TableRow.tsx";
import { Text } from "../src/components/Text.tsx";
import { Tooltip } from "../src/components/Tooltip.tsx";
import { TreeView } from "../src/components/TreeView.tsx";
import { Window } from "../src/components/Window.tsx";
import { DefaultLayout } from "../src/components/page/DefaultLayout.tsx";
import { IntDevLogo } from "../src/components/svg/IntDevLogo.tsx";
import { Sphere } from "../src/components/svg/Sphere.tsx";

afterEach(cleanup);

test("Message puts the triangle left and the bubble right", () => {
  const { container } = render(() => <Message>hi</Message>);
  const root = container.firstElementChild!;
  expect(root.children[0].querySelector("figure")).not.toBeNull();
  expect(root.children[1].textContent).toBe("hi");
});

test("MessageViewer puts the bubble left and the triangle right", () => {
  const { container } = render(() => <MessageViewer>hi</MessageViewer>);
  const root = container.firstElementChild!;
  expect(root.children[0].textContent).toBe("hi");
  expect(root.children[1].querySelector("figure")).not.toBeNull();
});

test("Navigation renders a link when logoHref is set and a clickable button otherwise", () => {
  const first = render(() => (
    <Navigation logoHref="/home" logoTarget="_blank" logo="L" left="a" right="b">
      mid
    </Navigation>
  ));
  const link = first.container.querySelector("a")!;
  expect(link.getAttribute("href")).toBe("/home");
  expect(link.getAttribute("target")).toBe("_blank");
  expect(first.container.querySelector("nav")!.querySelectorAll("section")).toHaveLength(3);
  expect(first.container.textContent).toBe("Lamidb");
  first.unmount();

  let clicks = 0;
  const second = render(() => <Navigation logo="L" onClickLogo={() => clicks++} />);
  expect(second.container.querySelector("a")).toBeNull();
  fireEvent.click(second.container.querySelector("button")!);
  expect(clicks).toBe(1);
});

test("Popover and Tooltip pass style, attributes and children through", () => {
  const { container } = render(() => (
    <>
      <Popover style={{ "margin-top": "8px" }} data-x="1">
        p
      </Popover>
      <Tooltip title="t">t</Tooltip>
    </>
  ));
  const popover = container.children[0] as HTMLElement;
  expect(popover.style.marginTop).toBe("8px");
  expect(popover.dataset.x).toBe("1");
  expect(container.children[1].getAttribute("title")).toBe("t");
});

test("Row variants render sections and forward refs", () => {
  let ref: HTMLElement | undefined;
  const { container } = render(() => (
    <>
      <Row ref={(el) => (ref = el)}>a</Row>
      <RowEllipsis>b</RowEllipsis>
      <RowSpaceBetween>c</RowSpaceBetween>
    </>
  ));
  const sections = container.querySelectorAll("section");
  expect([...sections].map((s) => s.textContent)).toEqual(["a", "b", "c"]);
  expect(ref).toBe(sections[0]);
});

test("Table, TableRow and TableColumn nest into a focusable table body", () => {
  const { container } = render(() => (
    <Table>
      <TableRow>
        <TableColumn>x</TableColumn>
      </TableRow>
    </Table>
  ));
  const row = container.querySelector("table > tbody > tr")!;
  expect(row.getAttribute("tabindex")).toBe("0");
  expect(row.querySelector("td")!.textContent).toBe("x");
});

test("Text renders a paragraph and Window a dialog section", () => {
  const { container } = render(() => (
    <>
      <Text>hello</Text>
      <Window aria-label="w">body</Window>
    </>
  ));
  expect(container.querySelector("p")!.textContent).toBe("hello");
  const win = container.querySelector("section")!;
  expect(win.getAttribute("role")).toBe("dialog");
  expect(win.getAttribute("aria-label")).toBe("w");
});

test("DefaultLayout renders the preview pixel before children", () => {
  const { container } = render(() => <DefaultLayout previewPixelSRC="/p.png">kid</DefaultLayout>);
  const img = container.querySelector("img")!;
  expect(img.getAttribute("src")).toBe("/p.png");
  expect(img.getAttribute("alt")).toBe("");
  expect(container.firstElementChild!.textContent).toBe("kid");
});

test("IntDevLogo is an aria-hidden svg that accepts overrides", () => {
  const { container } = render(() => <IntDevLogo class="logo" />);
  const svg = container.querySelector("svg")!;
  expect(svg.getAttribute("aria-hidden")).toBe("true");
  expect(svg.getAttribute("viewBox")).toBe("0 0 494.25 80.29");
  expect(svg.getAttribute("class")).toBe("logo");
});

test("Sphere draws segments+1 latitude and longitude paths and follows props", () => {
  const { container } = render(() => <Sphere size={100} segments={3} />);
  const svg = container.querySelector("svg")!;
  expect(svg.getAttribute("viewBox")).toBe("0 0 100 100");
  const paths = svg.querySelectorAll("path");
  expect(paths).toHaveLength(8);
  expect(paths[0].getAttribute("vector-effect")).toBe("non-scaling-stroke");
  expect(svg.querySelector("g")!.getAttribute("stroke-width")).toBe("1");
});

test("SimpleTable renders header, rows, alignment and status classes", () => {
  const { container } = render(() => (
    <SimpleTable
      data={[
        ["NAME", "STATE"],
        ["a", "ACTIVE"],
        ["b", "CLOSED"],
        ["c", "other"],
      ]}
      align={["left", "right"]}
    />
  ));
  expect(container.querySelectorAll("thead td")).toHaveLength(2);
  const rows = container.querySelectorAll("tbody tr");
  expect(rows).toHaveLength(3);
  expect(rows[0].getAttribute("tabindex")).toBe("0");
  const cells = [...rows].map((r) => r.children[1]);
  expect(cells[0].className).toContain("alignRight");
  expect(cells[0].className).toContain("statusOk");
  expect(cells[1].className).toContain("statusOff");
  expect(cells[2].className).toContain("alignRight");
  expect(cells[2].className).not.toContain("status");
  expect(rows[0].children[0].hasAttribute("class")).toBe(false);
});

test("SimpleTable renders nothing for empty data", () => {
  const { container } = render(() => <SimpleTable data={[]} />);
  expect(container.innerHTML).toBe("");
});

test("SidebarLayout drag resizes the sidebar in character steps", () => {
  const { container } = render(() => (
    <SidebarLayout sidebar="side" isShowingHandle defaultSidebarWidth={20}>
      main
    </SidebarLayout>
  ));
  const root = container.firstElementChild!;
  const sidebar = root.children[0] as HTMLElement;
  const handle = screen.getByRole("button");
  expect(sidebar.style.width).toBe("20ch");
  expect(root.children).toHaveLength(3);

  fireEvent.mouseDown(handle, { clientX: 100 });
  fireEvent.mouseMove(document, { clientX: 100 + 9.6 * 3 });
  expect(sidebar.style.width).toBe("23ch");
  fireEvent.mouseMove(document, { clientX: -1000 });
  expect(sidebar.style.width).toBe("9.6ch");
  fireEvent.mouseUp(document);
  fireEvent.mouseMove(document, { clientX: 500 });
  expect(sidebar.style.width).toBe("9.6ch");
});

test("SidebarLayout without handle omits it and reversed puts the sidebar last", () => {
  const plain = render(() => <SidebarLayout sidebar="side">main</SidebarLayout>);
  expect(plain.container.firstElementChild!.children).toHaveLength(2);
  expect(screen.queryByRole("button")).toBeNull();
  plain.unmount();

  const { container } = render(() => (
    <SidebarLayout sidebar="side" isReversed>
      main
    </SidebarLayout>
  ));
  const root = container.firstElementChild!;
  expect(root.children[0].textContent).toBe("main");
  expect(root.children[1].textContent).toBe("side");
  expect(root.textContent).toBe("main\u00a0side");
});

const settle = async () => {
  for (let i = 0; i < 4; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    flush();
  }
};

test("TreeView is a named tree that draws the prefix and toggles branches by press and arrows", async () => {
  const { container } = render(() => (
    <TreeView title="root" defaultValue>
      <TreeView title="a" defaultValue>
        <TreeView title="a1" isFile />
        <TreeView title="a2" isFile />
      </TreeView>
      <TreeView title="b" />
    </TreeView>
  ));
  await settle();
  const labels = () =>
    [...container.querySelectorAll('[data-slot="tree-label"]')].map((n) => n.textContent);
  expect(screen.getByRole("tree", { name: "root" })).toBeTruthy();
  expect(labels()).toEqual([
    "├───╦ root",
    "│ . ├───╦ a",
    "│ . │ . ├─── a1",
    "│ . │ . └─── a2",
    "│ . └───╤ b",
  ]);

  const rootItem = screen.getAllByRole("treeitem")[0]!;
  expect(rootItem.getAttribute("aria-expanded")).toBe("true");
  fireEvent.click(container.querySelector('[data-slot="tree-label"]')!);
  await settle();
  expect(rootItem.getAttribute("aria-expanded")).toBe("false");
  expect(labels()).toEqual(["├───╤ root"]);

  rootItem.focus();
  fireEvent.keyDown(rootItem, { key: "ArrowRight" });
  await settle();
  expect(labels()).toHaveLength(5);
  fireEvent.keyDown(rootItem, { key: "ArrowLeft" });
  await settle();
  expect(labels()).toHaveLength(1);
});

test("TreeView files are leaves and last-child marks follow the final child", async () => {
  const { container } = render(() => (
    <TreeView title="root" isLastChild defaultValue>
      <TreeView title="file" isFile />
    </TreeView>
  ));
  await settle();
  const labels = [...container.querySelectorAll('[data-slot="tree-label"]')];
  expect(labels.map((n) => n.textContent)).toEqual(["└───╦ root", ". . └─── file"]);
  expect(screen.getAllByRole("treeitem")[1]!.hasAttribute("aria-expanded")).toBe(false);
});
