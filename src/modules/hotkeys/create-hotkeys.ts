//NOTE(jimmylee): ported from https://github.com/JohannesKlauss/react-hotkeys-hook/blob/main/src/useHotkeys.ts
import { type Accessor, createEffect, createMemo, onCleanup } from "solid-js";
import { deepEqual } from "../../common/utilities.ts";
import { useHotkeysContext } from "./hotkeys-provider.tsx";
import {
  isReadonlyArray,
  pushToCurrentlyPressedKeys,
  removeFromCurrentlyPressedKeys,
} from "./is-hotkey-pressed.ts";
import { mapKey, parseHotkey, parseKeysHookInput } from "./parse-hotkeys.ts";
import type { HotkeyCallback, Keys, Options } from "./types.ts";
import {
  isHotkeyEnabled,
  isHotkeyEnabledOnTag,
  isHotkeyMatchingKeyboardEvent,
  isKeyboardEventTriggeredByInput,
  isScopeActive,
  maybePreventDefault,
} from "./validators.ts";

type MaybeAccessor<T> = T | Accessor<T>;

function read<T>(value: MaybeAccessor<T>): T {
  return typeof value === "function" ? (value as Accessor<T>)() : value;
}

export function createHotkeys(
  keys: MaybeAccessor<Keys>,
  callback: HotkeyCallback,
  options?: MaybeAccessor<Options | undefined>,
): void {
  const { enabledScopes, addHotkey, removeHotkey } = useHotkeysContext();
  const memoisedOptions = createMemo(() => read(options), undefined, { equals: deepEqual });
  const keyString = createMemo(() => {
    const resolved = read(keys);
    return isReadonlyArray(resolved)
      ? (resolved as readonly string[]).join(memoisedOptions()?.splitKey)
      : (resolved as string);
  });

  let hasTriggered = false;

  createEffect(() => {
    const opts = memoisedOptions();
    const joinedKeys = keyString();

    if (opts?.enabled === false || !isScopeActive(enabledScopes(), opts?.scopes)) {
      return;
    }

    const listener = (e: KeyboardEvent, isKeyUp = false) => {
      if (isKeyboardEventTriggeredByInput(e) && !isHotkeyEnabledOnTag(e, opts?.enableOnFormTags)) {
        return;
      }

      if ((e.target as HTMLElement | null)?.isContentEditable && !opts?.enableOnContentEditable) {
        return;
      }

      for (const key of parseKeysHookInput(joinedKeys, opts?.splitKey)) {
        const hotkey = parseHotkey(key, opts?.combinationKey);

        if (
          !(
            isHotkeyMatchingKeyboardEvent(e, hotkey, opts?.ignoreModifiers) ||
            hotkey.keys?.includes("*")
          )
        ) {
          continue;
        }

        if (opts?.ignoreEventWhen?.(e)) continue;
        if (isKeyUp && hasTriggered) continue;

        maybePreventDefault(e, hotkey, opts?.preventDefault);

        if (!isHotkeyEnabled(e, hotkey, opts?.enabled)) {
          e.stopPropagation();
          e.preventDefault();
          e.stopImmediatePropagation();
          continue;
        }

        callback(e, hotkey);

        if (!isKeyUp) {
          hasTriggered = true;
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      //NOTE(jimmylee): Synthetic events (e.g. Chrome autofill) have no key.
      if (event.key === undefined) return;

      pushToCurrentlyPressedKeys(mapKey(event.code));

      if ((opts?.keydown === undefined && opts?.keyup !== true) || opts?.keydown) {
        listener(event);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === undefined) return;

      removeFromCurrentlyPressedKeys(mapKey(event.code));
      hasTriggered = false;

      if (opts?.keyup) {
        listener(event, true);
      }
    };

    const target = opts?.document ?? document;
    target.addEventListener("keyup", handleKeyUp);
    target.addEventListener("keydown", handleKeyDown);

    const registered = parseKeysHookInput(joinedKeys, opts?.splitKey).map((key) =>
      parseHotkey(key, opts?.combinationKey, opts?.description),
    );
    registered.forEach(addHotkey);

    onCleanup(() => {
      target.removeEventListener("keyup", handleKeyUp);
      target.removeEventListener("keydown", handleKeyDown);
      registered.forEach(removeHotkey);
    });
  });
}
