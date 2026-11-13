import type { JSX } from "@solidjs/web";
import { type Component } from "solid-js";
import { useModals } from "./page/ModalContext.tsx";

export interface ModalTriggerProps<P extends object = object> {
  children?: JSX.Element;
  modal: Component<P>;
  modalProps?: P;
  class?: string;
}

export function ModalTrigger<P extends object = object>(props: ModalTriggerProps<P>) {
  const { open } = useModals();

  return (
    <span
      class={props.class}
      onClick={() => open(props.modal, (props.modalProps ?? {}) as P)}
      style={{ display: "contents" }}
    >
      {props.children}
    </span>
  );
}
