import { render } from "@solidjs/testing-library";
import { expect, test } from "vite-plus/test";
import { Button } from "../src/index.ts";

test("Button renders primary by default and a disabled native button when disabled", () => {
  const { container, unmount } = render(() => <Button>go</Button>);
  expect(container.querySelector("button")?.textContent).toBe("go");
  unmount();
  const disabled = render(() => <Button isDisabled>go</Button>);
  const button = disabled.container.querySelector("button");
  expect(button?.disabled).toBe(true);
  expect(button?.textContent).toBe("go");
});
