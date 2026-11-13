import type { JSX } from "@solidjs/web";
import {
  type Accessor,
  type Component,
  createComponent,
  createContext,
  createSignal,
  untrack,
  useContext,
} from "solid-js";

export interface ModalState {
  key: string;
  render: () => JSX.Element;
  returnFocus: HTMLElement | null;
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
      {
        key,
        render: () => createComponent(component, modalProps),
        returnFocus: document.activeElement instanceof HTMLElement ? document.activeElement : null,
      },
    ]);
    return key;
  };

  const close = (key?: string) => {
    const stack = untrack(modalStack);
    const closing = key ? stack.find((modal) => modal.key === key) : stack.at(-1);
    if (!closing) return;
    setModalStack(stack.filter((modal) => modal !== closing));
    //NOTE: The dialog unmounts before ui-sdk can return focus, so focus goes back once the page is no longer inert.
    const target = closing.returnFocus;
    if (target) requestAnimationFrame(() => target.isConnected && target.focus());
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

const ModalTitleContext = createContext<(() => string | undefined) | null>(null);

export function ModalTitle(props: { id: string; children?: JSX.Element }) {
  let claimed = false;
  const claim = () => {
    if (claimed) return undefined;
    claimed = true;
    return props.id;
  };
  return <ModalTitleContext value={claim}>{props.children}</ModalTitleContext>;
}

export function useModalTitleId(): string | undefined {
  return useContext(ModalTitleContext)?.();
}
