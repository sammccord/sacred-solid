import type { JSX } from "@solidjs/web";
import {
  type Accessor,
  type Component,
  createComponent,
  createContext,
  createSignal,
  useContext,
} from "solid-js";

export interface ModalState {
  key: string;
  render: () => JSX.Element;
}

export interface ModalContextValue {
  modalStack: Accessor<ModalState[]>;
  open: <P extends object>(component: Component<P>, props: P) => string;
  close: (key?: string) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider(props: { children?: JSX.Element }) {
  const [modalStack, setModalStack] = createSignal<ModalState[]>([]);

  const open: ModalContextValue["open"] = (component, modalProps) => {
    const key = `modal-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    setModalStack((prev) => [
      ...prev,
      { key, render: () => createComponent(component, modalProps) },
    ]);
    return key;
  };

  const close = (key?: string) => {
    setModalStack((prev) => {
      if (prev.length === 0) return prev;
      if (key) return prev.filter((modal) => modal.key !== key);
      return prev.slice(0, -1);
    });
  };

  return <ModalContext value={{ modalStack, open, close }}>{props.children}</ModalContext>;
}

const outsideProvider: ModalContextValue = {
  modalStack: () => [],
  open: () => {
    console.warn("Modal open called outside of ModalProvider - modal will not open");
    return "";
  },
  close: () => {
    console.warn("Modal close called outside of ModalProvider - modal will not close");
  },
};

export function useModals(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    console.warn("useModals must be used within a ModalProvider");
    return outsideProvider;
  }
  return context;
}
