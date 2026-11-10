import { onCleanup, onMount } from "solid-js";

export type Keymap = Record<string, () => void>;

export function useKeymap(keymap: Keymap) {
  onMount(() => {
    const onKey = (event: KeyboardEvent) => {
      const action = keymap[event.key.length === 1 ? event.key.toLowerCase() : event.key];
      if (action === undefined) return;
      event.preventDefault();
      action();
    };
    window.addEventListener("keydown", onKey);
    onCleanup(() => window.removeEventListener("keydown", onKey));
  });
}
