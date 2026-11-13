import { onSettled } from "solid-js";

export type Keymap = Record<string, () => void>;

export function useKeymap(keymap: Keymap) {
  onSettled(() => {
    const onKey = (event: KeyboardEvent) => {
      const action = keymap[event.key.length === 1 ? event.key.toLowerCase() : event.key];
      if (action === undefined) return;
      event.preventDefault();
      action();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
}
