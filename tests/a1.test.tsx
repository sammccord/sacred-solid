import { flush } from "solid-js";
import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { Accordion } from "../src/components/Accordion.tsx";
import { ActionBar } from "../src/components/ActionBar.tsx";
import { ActionButton } from "../src/components/ActionButton.tsx";
import { ActionListItem } from "../src/components/ActionListItem.tsx";
import { AlertBanner } from "../src/components/AlertBanner.tsx";
import { Avatar } from "../src/components/Avatar.tsx";
import { Badge } from "../src/components/Badge.tsx";
import { Block } from "../src/components/Block.tsx";
import { BreadCrumbs } from "../src/components/BreadCrumbs.tsx";
import { Card } from "../src/components/Card.tsx";
import { CardDouble } from "../src/components/CardDouble.tsx";
import { CodeBlock } from "../src/components/CodeBlock.tsx";
import { ContentFluid } from "../src/components/ContentFluid.tsx";
import { Divider } from "../src/components/Divider.tsx";
import { Drawer } from "../src/components/Drawer.tsx";
import { Grid } from "../src/components/Grid.tsx";
import { Indent } from "../src/components/Indent.tsx";
import { ListItem } from "../src/components/ListItem.tsx";
import accordionStyles from "../src/components/Accordion.module.css";
import actionButtonStyles from "../src/components/ActionButton.module.css";
import avatarStyles from "../src/components/Avatar.module.css";
import cardStyles from "../src/components/Card.module.css";
import cardDoubleStyles from "../src/components/CardDouble.module.css";
import dividerStyles from "../src/components/Divider.module.css";

afterEach(cleanup);

describe("Accordion", () => {
  test("click toggles content, icon and aria-expanded", () => {
    render(() => <Accordion title="More">hidden body</Accordion>);
    const header = screen.getByRole("button");
    expect(header.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("hidden body")).toBeNull();
    expect(header.textContent).toBe("▸More");

    fireEvent.click(header);
    expect(header.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("hidden body")).toBeTruthy();
    expect(header.textContent).toBe("▾More");
    expect(header.querySelector(`.${accordionStyles.active}`)).toBeTruthy();

    fireEvent.click(header);
    expect(screen.queryByText("hidden body")).toBeNull();
  });

  test("Enter and Space toggle the section from the keyboard", async () => {
    render(() => (
      <Accordion title="More" defaultValue>
        body
      </Accordion>
    ));
    const header = screen.getByRole("button", { name: /More/ });
    const key = async (value: string) => {
      fireEvent.keyDown(header, { key: value });
      fireEvent.keyUp(header, { key: value });
      await new Promise((resolve) => setTimeout(resolve, 0));
      flush();
    };
    expect(header.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("body")).toBeTruthy();
    await key("Enter");
    expect(header.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("body")).toBeNull();
    await key(" ");
    expect(header.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("body")).toBeTruthy();
    await key("a");
    expect(header.getAttribute("aria-expanded")).toBe("true");
  });
});

describe("ActionBar", () => {
  test("renders a button per item and fires onClick", () => {
    const onClick = vi.fn();
    render(() => (
      <ActionBar
        items={[
          { body: "Save", hotkey: "⌘S", onClick, selected: true },
          { body: "Open", hotkey: "⌘O" },
        ]}
      />
    ));
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual(["⌘SSave", "⌘OOpen"]);
    fireEvent.click(buttons[0]!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("ActionButton", () => {
  test("is a native button that activates on click, hotkey is shown only when non-empty", () => {
    const onClick = vi.fn();
    const { container } = render(() => (
      <ActionButton onClick={onClick} hotkey="⌘K" isSelected>
        Go
      </ActionButton>
    ));
    const root = screen.getByRole("button");
    expect(root.classList.contains(actionButtonStyles.selected!)).toBe(true);
    expect(container.querySelector(`.${actionButtonStyles.hotkey}`)?.textContent).toBe("⌘K");

    expect(root.tagName).toBe("BUTTON");
    expect(root.getAttribute("type")).toBe("button");
    fireEvent.click(root);
    fireEvent.keyDown(root, { key: "x" });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("zero hotkey renders, empty does not", () => {
    const zero = render(() => <ActionButton hotkey={0}>a</ActionButton>);
    expect(zero.container.querySelector(`.${actionButtonStyles.hotkey}`)?.textContent).toBe("0");
    const none = render(() => <ActionButton hotkey="">a</ActionButton>);
    expect(none.container.querySelector(`.${actionButtonStyles.hotkey}`)).toBeNull();
  });

  test("forwards ref", () => {
    let el: HTMLButtonElement | undefined;
    render(() => <ActionButton ref={(node) => (el = node)}>a</ActionButton>);
    expect(el?.tagName).toBe("BUTTON");
    expect(el?.getAttribute("data-slot")).toBe("button");
  });
});

describe("ActionListItem", () => {
  test("without href or a part role it is a native button that activates on click", () => {
    const onClick = vi.fn();
    render(() => <ActionListItem onClick={onClick}>Item</ActionListItem>);
    const item = screen.getByRole("button", { name: "Item" });
    expect(item.tagName).toBe("BUTTON");
    fireEvent.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("menuitem role leaves keyboard activation to the parent", () => {
    const onClick = vi.fn();
    render(() => (
      <ActionListItem role="menuitem" onClick={onClick}>
        Item
      </ActionListItem>
    ));
    fireEvent.keyDown(screen.getByRole("menuitem"), { key: "Enter" });
    expect(onClick).not.toHaveBeenCalled();
  });

  test("href renders a native anchor", () => {
    render(() => (
      <ActionListItem href="/x" target="_blank" icon="i">
        Go
      </ActionListItem>
    ));
    const link = screen.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/x");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.querySelector("figure")?.textContent).toBe("i");
  });
});

describe("AlertBanner", () => {
  test("renders children with style", () => {
    const { container } = render(() => (
      <AlertBanner style={{ "margin-top": "4px" }}>careful</AlertBanner>
    ));
    const div = container.firstElementChild as HTMLElement;
    expect(div.textContent).toBe("careful");
    expect(div.style.marginTop).toBe("4px");
  });
});

describe("Avatar", () => {
  test("src sets background image on a figure", () => {
    const { container } = render(() => <Avatar src="/a.png" />);
    const figure = container.querySelector("figure") as HTMLElement;
    expect(figure.className).toBe(avatarStyles.root);
    expect(figure.style.backgroundImage).toContain("/a.png");
  });

  test("without src uses placeholder, href renders anchor", () => {
    const { container } = render(() => <Avatar href="/me" target="_blank" />);
    const link = container.querySelector("a") as HTMLAnchorElement;
    expect(link.className).toBe(avatarStyles.placeholder);
    expect(link.hasAttribute("role")).toBe(false);
    expect(link.getAttribute("href")).toBe("/me");
  });

  test("children wrap avatar in a parent with a right column", () => {
    const { container } = render(() => <Avatar src="/a.png">Ada</Avatar>);
    const parent = container.firstElementChild as HTMLElement;
    expect(parent.className).toBe(avatarStyles.parent);
    expect(parent.firstElementChild?.tagName).toBe("FIGURE");
    expect(parent.querySelector(`.${avatarStyles.right}`)?.textContent).toBe("Ada");
  });
});

describe("Badge and Block", () => {
  test("Badge forwards attributes", () => {
    render(() => <Badge title="t">new</Badge>);
    const badge = screen.getByText("new");
    expect(badge.tagName).toBe("SPAN");
    expect(badge.getAttribute("title")).toBe("t");
  });

  test("Block forwards attributes", () => {
    render(() => <Block data-x="1">blk</Block>);
    expect(screen.getByText("blk").getAttribute("data-x")).toBe("1");
  });
});

describe("BreadCrumbs", () => {
  test("separators between items only, last link wrapped in a span", () => {
    const { container } = render(() => (
      <BreadCrumbs
        items={[
          { name: "Home", url: "/" },
          { name: "Docs", url: "/docs" },
          { name: "Page", url: "/docs/page" },
        ]}
      />
    ));
    const nav = container.querySelector("nav") as HTMLElement;
    expect(nav.getAttribute("aria-label")).toBe("breadcrumb");
    expect(nav.textContent).toBe("Home ❯ Docs ❯ Page");
    const links = nav.querySelectorAll("a");
    expect(links).toHaveLength(3);
    expect(links[0]?.parentElement?.tagName).toBe("SPAN");
    expect(links[0]?.getAttribute("target")).toBe("_blank");
    expect(links[2]?.parentElement?.parentElement?.parentElement).toBe(nav);
    expect(links[0]?.parentElement?.parentElement).toBe(nav);
  });
});

describe("Card", () => {
  test("default mode shows title only when given", () => {
    const { container } = render(() => <Card>body</Card>);
    expect(container.querySelector("h2")).toBeNull();
    expect(container.querySelector(`.${cardStyles.left}`)).toBeTruthy();
    expect(container.querySelector(`.${cardStyles.right}`)).toBeTruthy();
    expect(container.querySelector(`.${cardStyles.children}`)?.textContent).toBe("body");
  });

  test("left and right modes swap in corner classes and always render the title", () => {
    const left = render(() => <Card mode="left" title="L" />);
    expect(left.container.querySelector(`.${cardStyles.leftCorner}`)).toBeTruthy();
    expect(left.container.querySelector(`.${cardStyles.right}`)).toBeTruthy();
    expect(left.container.querySelector("h2")?.textContent).toBe("L");

    const right = render(() => <Card mode="right" />);
    expect(right.container.querySelector(`.${cardStyles.rightCorner}`)).toBeTruthy();
    expect(right.container.querySelector(`.${cardStyles.left}`)).toBeTruthy();
    expect(right.container.querySelector("h2")).toBeTruthy();
  });
});

describe("CardDouble", () => {
  test("title always rendered, style lands on the inner border section", () => {
    const { container } = render(() => (
      <CardDouble mode="right" style={{ "margin-top": "3px" }}>
        body
      </CardDouble>
    ));
    expect(container.querySelector("h2")).toBeTruthy();
    expect(container.querySelector(`.${cardDoubleStyles.rightCorner}`)).toBeTruthy();
    const inner = container.querySelector(`.${cardDoubleStyles.borderChildren}`) as HTMLElement;
    expect(inner.style.marginTop).toBe("3px");
    expect(inner.textContent).toBe("body");
  });
});

describe("CodeBlock", () => {
  test("numbers each line with zero padding", () => {
    const { container } = render(() => <CodeBlock>{"a\nb\nc"}</CodeBlock>);
    const lines = Array.from(container.querySelectorAll("pre > div")).map((d) => d.textContent);
    expect(lines).toEqual(["001a", "002b", "003c"]);
  });
});

describe("ContentFluid, Grid, Indent", () => {
  test("ContentFluid renders a div around children", () => {
    const { container } = render(() => <ContentFluid>x</ContentFluid>);
    expect(container.firstElementChild?.tagName).toBe("DIV");
    expect(container.textContent).toBe("x");
  });

  test("Grid forwards attributes", () => {
    render(() => <Grid data-testid="g">cells</Grid>);
    expect(screen.getByTestId("g").textContent).toBe("cells");
  });

  test("Indent forwards attributes", () => {
    render(() => <Indent data-testid="i">in</Indent>);
    expect(screen.getByTestId("i").textContent).toBe("in");
  });
});

describe("Divider", () => {
  test("single, double and gradient variants", () => {
    const single = render(() => <Divider />);
    expect(single.container.querySelectorAll(`.${dividerStyles.line}`)).toHaveLength(1);

    const double = render(() => <Divider type="DOUBLE" />);
    const lines = double.container.querySelectorAll<HTMLElement>(`.${dividerStyles.line}`);
    expect(lines).toHaveLength(2);
    expect(lines[0]?.style.marginBottom).toBe("2px");

    const gradient = render(() => <Divider type="GRADIENT" style={{ width: "50%" }} />);
    const el = gradient.container.firstElementChild as HTMLElement;
    expect(el.className).toBe(dividerStyles.gradient);
    expect(el.style.width).toBe("50%");
  });
});

describe("Drawer", () => {
  test("button toggles side content and arrow", () => {
    render(() => <Drawer>side</Drawer>);
    const button = screen.getByRole("button");
    expect(button.textContent).toBe("⭢");
    expect(screen.queryByText("side")).toBeNull();

    fireEvent.click(button);
    expect(screen.getByText("side")).toBeTruthy();
    expect(button.textContent).toBe("⭠");

    fireEvent.click(button);
    expect(screen.queryByText("side")).toBeNull();
  });

  test("defaultValue opens it", () => {
    render(() => <Drawer defaultValue>side</Drawer>);
    expect(screen.getByText("side")).toBeTruthy();
  });
});

describe("ListItem", () => {
  test("Enter clicks, arrows move focus between focusables", () => {
    const onClick = vi.fn();
    render(() => (
      <ul>
        <ListItem>
          <span onClick={onClick}>a</span>
        </ListItem>
        <ListItem>b</ListItem>
        <ListItem>c</ListItem>
      </ul>
    ));
    const items = screen.getAllByRole("listitem");
    items[0]!.focus();
    expect(document.activeElement).toBe(items[0]);

    expect(fireEvent.keyDown(items[0]!, { key: "ArrowDown" })).toBe(false);
    expect(document.activeElement).toBe(items[1]);
    fireEvent.keyDown(items[1]!, { key: "ArrowRight" });
    expect(document.activeElement).toBe(items[2]);
    fireEvent.keyDown(items[2]!, { key: "ArrowUp" });
    expect(document.activeElement).toBe(items[1]);
    fireEvent.keyDown(items[1]!, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(items[0]);

    const clicks = vi.fn();
    items[1]!.addEventListener("click", clicks);
    expect(fireEvent.keyDown(items[1]!, { key: "Enter" })).toBe(false);
    expect(clicks).toHaveBeenCalledTimes(1);
  });
});
