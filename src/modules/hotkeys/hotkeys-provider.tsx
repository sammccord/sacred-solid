//NOTE(jimmylee): ported from https://github.com/JohannesKlauss/react-hotkeys-hook/blob/main/src/HotkeysProvider.tsx
import { type Accessor, createContext, createSignal, type JSX, useContext } from "solid-js";
import { deepEqual } from "../../common/utilities.ts";
import type { Hotkey } from "./types.ts";

export interface HotkeysContextValue {
  hotkeys: Accessor<readonly Hotkey[]>;
  enabledScopes: Accessor<string[]>;
  toggleScope: (scope: string) => void;
  enableScope: (scope: string) => void;
  disableScope: (scope: string) => void;
  addHotkey: (hotkey: Hotkey) => void;
  removeHotkey: (hotkey: Hotkey) => void;
}

//NOTE(jimmylee): enabledScopes stays empty (not ['*']) without a provider so callers can tell whether one is mounted.
const HotkeysContext = createContext<HotkeysContextValue>({
  hotkeys: () => [],
  enabledScopes: () => [],
  toggleScope: () => {},
  enableScope: () => {},
  disableScope: () => {},
  addHotkey: () => {},
  removeHotkey: () => {},
});

export function useHotkeysContext(): HotkeysContextValue {
  return useContext(HotkeysContext);
}

export interface HotkeysProviderProps {
  initiallyActiveScopes?: string[];
  children?: JSX.Element;
}

function withoutScope(scopes: string[], scope: string): string[] {
  const remaining = scopes.filter((s) => s !== scope);
  return remaining.length === 0 ? ["*"] : remaining;
}

function withScope(scopes: string[], scope: string): string[] {
  return scopes.includes("*") ? [scope] : Array.from(new Set([...scopes, scope]));
}

export function HotkeysProvider(props: HotkeysProviderProps) {
  const initial = props.initiallyActiveScopes;
  const [enabledScopes, setEnabledScopes] = createSignal<string[]>(
    initial && initial.length > 0 ? initial : ["*"],
  );
  const [hotkeys, setHotkeys] = createSignal<readonly Hotkey[]>([]);

  const value: HotkeysContextValue = {
    enabledScopes,
    hotkeys,
    enableScope: (scope) => setEnabledScopes((prev) => withScope(prev, scope)),
    disableScope: (scope) => setEnabledScopes((prev) => withoutScope(prev, scope)),
    toggleScope: (scope) =>
      setEnabledScopes((prev) =>
        prev.includes(scope) ? withoutScope(prev, scope) : withScope(prev, scope),
      ),
    addHotkey: (hotkey) => setHotkeys((prev) => [...prev, hotkey]),
    removeHotkey: (hotkey) => setHotkeys((prev) => prev.filter((h) => !deepEqual(h, hotkey))),
  };

  return <HotkeysContext.Provider value={value}>{props.children}</HotkeysContext.Provider>;
}
