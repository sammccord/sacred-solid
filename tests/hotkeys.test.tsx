import { cleanup, render } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import {
  createHotkeys,
  HotkeysProvider,
  isHotkeyPressed,
  useHotkeysContext,
} from "../src/modules/hotkeys/index.ts";
import { mapKey, parseHotkey } from "../src/modules/hotkeys/parse-hotkeys.ts";
import { isHotkeyMatchingKeyboardEvent, isScopeActive } from "../src/modules/hotkeys/validators.ts";

afterEach(cleanup);

const press = (init: KeyboardEventInit, target: EventTarget = document) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }));
  target.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, ...init }));
};

describe("parseHotkey", () => {
  test("splits modifiers from keys and maps aliases", () => {
    expect(parseHotkey("ctrl+shift+Esc")).toMatchObject({
      ctrl: true,
      shift: true,
      alt: false,
      keys: ["escape"],
    });
    expect(mapKey("ArrowDown")).toBe("down");
    expect(mapKey("KeyG")).toBe("g");
  });
});

describe("isHotkeyMatchingKeyboardEvent", () => {
  test("requires the exact modifier set", () => {
    const hotkey = parseHotkey("ctrl+g");
    const base = { key: "g", code: "KeyG" };
    expect(
      isHotkeyMatchingKeyboardEvent(
        new KeyboardEvent("keydown", { ...base, ctrlKey: true }),
        hotkey,
      ),
    ).toBe(true);
    expect(isHotkeyMatchingKeyboardEvent(new KeyboardEvent("keydown", base), hotkey)).toBe(false);
    expect(
      isHotkeyMatchingKeyboardEvent(
        new KeyboardEvent("keydown", { ...base, ctrlKey: true, shiftKey: true }),
        hotkey,
      ),
    ).toBe(false);
  });
});

describe("isScopeActive", () => {
  test("star scope activates every hotkey, a named scope only its own", () => {
    expect(isScopeActive(["*"], ["menu"])).toBe(true);
    expect(isScopeActive(["menu"], ["menu"])).toBe(true);
    expect(isScopeActive(["other"], ["menu"])).toBe(false);
  });
});

describe("createHotkeys", () => {
  test("fires on a matching keydown and stops after unmount", () => {
    const callback = vi.fn();
    const view = render(() => {
      createHotkeys("ctrl+g", callback);
      return <div />;
    });
    press({ key: "g", code: "KeyG", ctrlKey: true });
    expect(callback).toHaveBeenCalledTimes(1);
    view.unmount();
    press({ key: "g", code: "KeyG", ctrlKey: true });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("ignores keys typed into form fields unless enabled", () => {
    const callback = vi.fn();
    const enabled = vi.fn();
    render(() => {
      createHotkeys("enter", callback);
      createHotkeys("enter", enabled, { enableOnFormTags: true });
      return <input />;
    });
    const input = document.querySelector("input")!;
    press({ key: "Enter", code: "Enter" }, input);
    expect(callback).not.toHaveBeenCalled();
    expect(enabled).toHaveBeenCalledTimes(1);
  });

  test("rebinds when the keys accessor changes", () => {
    const callback = vi.fn();
    const [keys, setKeys] = createSignal("a");
    render(() => {
      createHotkeys(keys, callback);
      return <div />;
    });
    press({ key: "a", code: "KeyA" });
    expect(callback).toHaveBeenCalledTimes(1);
    setKeys("b");
    press({ key: "a", code: "KeyA" });
    expect(callback).toHaveBeenCalledTimes(1);
    press({ key: "b", code: "KeyB" });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("honours scopes from the provider and follows enableScope", () => {
    const inMenu = vi.fn();
    const inOther = vi.fn();
    let context!: ReturnType<typeof useHotkeysContext>;
    const Binder = () => {
      context = useHotkeysContext();
      createHotkeys("y", inMenu, { scopes: ["menu"] });
      createHotkeys("z", inOther, { scopes: ["other"] });
      return null;
    };
    render(() => (
      <HotkeysProvider initiallyActiveScopes={["menu"]}>
        <Binder />
      </HotkeysProvider>
    ));
    press({ key: "y", code: "KeyY" });
    press({ key: "z", code: "KeyZ" });
    expect(inMenu).toHaveBeenCalledTimes(1);
    expect(inOther).not.toHaveBeenCalled();
    context.enableScope("other");
    press({ key: "z", code: "KeyZ" });
    expect(inOther).toHaveBeenCalledTimes(1);
  });

  test("provider registry tracks bound hotkeys and drops them on cleanup", () => {
    let registry!: ReturnType<typeof useHotkeysContext>;
    const Inner = () => {
      registry = useHotkeysContext();
      return <div />;
    };
    const [mounted, setMounted] = createSignal(true);
    const Binder = () => {
      createHotkeys("ctrl+k", () => {}, { description: "palette" });
      return null;
    };
    render(() => (
      <HotkeysProvider>
        <Inner />
        {mounted() ? <Binder /> : null}
      </HotkeysProvider>
    ));
    expect(registry.hotkeys().map((h) => h.description)).toEqual(["palette"]);
    setMounted(false);
    expect(registry.hotkeys()).toEqual([]);
  });

  test("isHotkeyPressed tracks held keys", () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "q", code: "KeyQ" }));
    expect(isHotkeyPressed("q")).toBe(true);
    document.dispatchEvent(new KeyboardEvent("keyup", { key: "q", code: "KeyQ" }));
    expect(isHotkeyPressed("q")).toBe(false);
  });
});
