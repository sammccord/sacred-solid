import { createSignal, onCleanup } from "solid-js";
import { mapKey } from "./parse-hotkeys.ts";

export function createRecordHotkeys() {
  const [keys, setKeys] = createSignal(new Set<string>());
  const [isRecording, setIsRecording] = createSignal(false);

  const handler = (event: KeyboardEvent) => {
    if (event.key === undefined) return;

    event.preventDefault();
    event.stopPropagation();

    setKeys((prev) => new Set(prev).add(mapKey(event.code)));
  };

  const stop = () => {
    document.removeEventListener("keydown", handler);
    setIsRecording(false);
  };

  const start = () => {
    setKeys(new Set<string>());
    stop();
    document.addEventListener("keydown", handler);
    setIsRecording(true);
  };

  const resetKeys = () => setKeys(new Set<string>());

  onCleanup(stop);

  return [keys, { start, stop, resetKeys, isRecording }] as const;
}
