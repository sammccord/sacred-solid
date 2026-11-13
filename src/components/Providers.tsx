import type { JSX } from "@solidjs/web";
import { HotkeysProvider } from "../modules/hotkeys/index.ts";
import { ModalProvider } from "./page/ModalContext.tsx";

export function Providers(props: { children?: JSX.Element }) {
  return (
    <HotkeysProvider>
      <ModalProvider>{props.children}</ModalProvider>
    </HotkeysProvider>
  );
}
