//NOTE(jimmylee): ported from https://github.com/JohannesKlauss/react-hotkeys-hook/blob/main/src/index.ts
export { createHotkeys } from "./create-hotkeys.ts";
export { createRecordHotkeys } from "./create-record-hotkeys.ts";
export {
  HotkeysProvider,
  type HotkeysProviderProps,
  useHotkeysContext,
} from "./hotkeys-provider.tsx";
export { isHotkeyPressed } from "./is-hotkey-pressed.ts";
export type { HotkeyCallback, Keys, Options } from "./types.ts";
