import { render } from "@solidjs/testing-library";
import { expect, test } from "vite-plus/test";
import { Button } from "../src/index.ts";

test("Button renders primary by default and swaps to div when disabled", () => {
  const { container, unmount } = render(() => <Button>go</Button>);
  expect(container.querySelector("button")?.textContent).toBe("go");
  unmount();
  const disabled = render(() => <Button isDisabled>go</Button>);
  expect(disabled.container.querySelector("button")).toBeNull();
  expect(disabled.container.querySelector("div")?.textContent).toBe("go");
});
