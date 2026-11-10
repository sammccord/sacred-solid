import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { MessagesInterface } from "../src/components/examples/MessagesInterface.tsx";
import { PageConceptOne } from "../src/components/examples/PageConceptOne.tsx";
import pageOneStyles from "../src/components/examples/PageConceptOne.module.css";
import { PageConceptTwo } from "../src/components/examples/PageConceptTwo.tsx";
import pageTwoStyles from "../src/components/examples/PageConceptTwo.module.css";
import { ModalStack } from "../src/components/ModalStack.tsx";
import { Providers } from "../src/components/Providers.tsx";

afterEach(cleanup);

const renderWithModals = (ui: () => import("solid-js").JSX.Element) =>
  render(() => (
    <Providers>
      {ui()}
      <ModalStack />
    </Providers>
  ));

describe("MessagesInterface", () => {
  test("shows the conversation, the sidebar chats, and the menu bar", () => {
    renderWithModals(() => <MessagesInterface />);
    for (const name of ["FILE", "EDIT", "VIEW", "HELP"]) {
      expect(screen.getByText(name)).toBeTruthy();
    }
    for (const name of ["Arthur", "Ariadne", "Eames", "Yusef", "Saito"]) {
      expect(screen.getByText(name, { exact: false })).toBeTruthy();
    }
    expect(screen.getByText("Why are they all looking at me?")).toBeTruthy();
    expect(screen.getByText("Converge?")).toBeTruthy();
    expect(screen.getByText("I bought the airline.")).toBeTruthy();
  });

  test("the message input accepts typing", () => {
    const { container } = renderWithModals(() => <MessagesInterface />);
    const input = container.querySelector<HTMLInputElement>('input[name="test_message_interface"]');
    expect(input).not.toBeNull();
    expect(input?.getAttribute("autocomplete")).toBe("off");
    fireEvent.input(input as HTMLInputElement, { target: { value: "hello" } });
    expect((input as HTMLInputElement).value).toBe("hello");
  });

  test("FILE opens its six items and an item opens the MESSAGES error modal", async () => {
    renderWithModals(() => <MessagesInterface />);
    fireEvent.click(screen.getByText("FILE"));
    const items = await screen.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "⊹Open",
      "⊹New Message",
      "⊹Quick Look",
      "⊹Close Messages",
      "⊹Open Conversation in New Window",
      "⊹Print...",
    ]);
    fireEvent.click(items[0]);
    expect(await screen.findByText(/error FOOLISH/)).toBeTruthy();
    expect(screen.getByRole("heading", { name: /MESSAGES/ })).toBeTruthy();
  });

  test("EDIT lists 21 items and VIEW lists 12", async () => {
    renderWithModals(() => <MessagesInterface />);
    fireEvent.click(screen.getByText("EDIT"));
    expect((await screen.findAllByRole("menuitem")).length).toBe(21);
    fireEvent.keyDown(document.body, { key: "Escape" });
    fireEvent.click(screen.getByText("VIEW"));
    const labels = (await screen.findAllByRole("menuitem")).map((item) => item.textContent);
    expect(labels).toContain("⊹Enter Full Screen");
  });
});

describe("PageConcept layouts", () => {
  test("PageConceptOne lays out fourteen titled sections around the dialog", () => {
    const { container } = renderWithModals(() => <PageConceptOne />);
    expect(container.querySelector(`.${pageOneStyles.root}`)).not.toBeNull();
    expect(container.querySelectorAll(`.${pageOneStyles.col}`).length).toBe(5);
    const titles = "ABCDEFGHIJKLMN".split("").map((letter) => `SECTION ${letter}`);
    for (const title of titles) {
      expect(screen.getByText(title, { exact: false })).toBeTruthy();
    }
    expect(screen.getByText("START SIMULATION", { exact: false })).toBeTruthy();
    expect(screen.getAllByText("HEADING A", { exact: false }).length).toBe(14);
  });

  test("PageConceptTwo swaps the last two columns for the messages window", () => {
    const { container } = renderWithModals(() => <PageConceptTwo />);
    expect(container.querySelector(`.${pageTwoStyles.root}`)).not.toBeNull();
    expect(container.querySelectorAll(`.${pageTwoStyles.col}`).length).toBe(2);
    const col3 = container.querySelector(`.${pageTwoStyles.col3}`);
    expect(col3?.textContent).toContain("SECTION I");
    expect(col3?.textContent).toContain("Why are they all looking at me?");
    expect(screen.getAllByText("HEADING A", { exact: false }).length).toBe(8);
    expect(screen.getAllByText("DATA 31").length).toBe(2);
  });
});
