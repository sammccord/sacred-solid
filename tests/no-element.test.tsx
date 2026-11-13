import { render } from "@solidjs/testing-library";
import { readFileSync } from "node:fs";
import type { JSX } from "@solidjs/web";
import { beforeAll, expect, test } from "vite-plus/test";
import { BodyPortal, DebugGrid, Providers } from "../src/index.ts";
import { ModalProvider } from "../src/components/page/ModalContext.tsx";
import { NO_ELEMENT_REASONS } from "../scripts/docs/descriptions.ts";
import { classCases } from "./component-cases.tsx";
import { stubBrowserApis } from "./stubs.ts";

beforeAll(stubBrowserApis);

interface Exempt {
  why: string;
  make: (kid: JSX.Element) => JSX.Element;
}

const NO_ELEMENT: Record<string, Exempt> = {
  Providers: {
    why: "mounts the hotkey and modal providers",
    make: (kid) => <Providers>{kid}</Providers>,
  },
  ModalProvider: {
    why: "provides the modal context",
    make: (kid) => <ModalProvider>{kid}</ModalProvider>,
  },
  BodyPortal: {
    why: "moves its children into document.body",
    make: (kid) => <BodyPortal>{kid}</BodyPortal>,
  },
  DebugGrid: { why: "appends an overlay to document.body on demand", make: () => <DebugGrid /> },
};

test("the exemptions are the documented ones", () => {
  expect(Object.keys(NO_ELEMENT).toSorted()).toEqual(Object.keys(NO_ELEMENT_REASONS).toSorted());
});

test("an exempt component renders no element of its own", () => {
  for (const [name, exempt] of Object.entries(NO_ELEMENT)) {
    const { container, unmount } = render(() => exempt.make(<i data-kid="" />));
    const own = [...container.children].filter((child) => !child.hasAttribute("data-kid"));
    expect(
      own,
      `${name} (${exempt.why}) now renders an element, remove it from NO_ELEMENT and give it class`,
    ).toEqual([]);
    unmount();
  }
});

test("every exported component takes class or is a listed exemption", () => {
  const index = readFileSync("src/index.ts", "utf8");
  const exported = [
    ...index.matchAll(/export \{([^}]*)\} from "\.\/components\/([^"]+)";/g),
  ].flatMap((match) =>
    match[1]!
      .split(",")
      .map((item) => item.trim())
      .filter((item) => /^[A-Z]/.test(item) && !item.startsWith("type ")),
  );
  const covered = classCases.map(([name]) => name);
  const missing = exported.filter(
    (name) =>
      !(name in NO_ELEMENT) &&
      !covered.some((each) => each === name || each.startsWith(`${name} `)),
  );
  expect(missing).toEqual([]);
});
