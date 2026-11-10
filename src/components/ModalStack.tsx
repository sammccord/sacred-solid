import { For } from "solid-js";
import { classNames } from "../common/utilities.ts";
import styles from "./ModalStack.module.css";
import { useModals } from "./page/ModalContext.tsx";

export interface ModalStackProps {
  class?: string;
}

export function ModalStack(props: ModalStackProps) {
  const { modalStack } = useModals();

  return (
    <div class={classNames(styles.root, props.class)}>
      <For each={modalStack()}>
        {(modalState, index) => {
          const offsetFromLast = () => modalStack().length - 1 - index();

          return (
            <div
              class={styles.item}
              style={{
                "z-index": 10 + index(),
                transform: `translateY(${-offsetFromLast() * 40}px)`,
                filter: `blur(${offsetFromLast() * 1.1}px)`,
              }}
            >
              {modalState.render()}
            </div>
          );
        }}
      </For>
    </div>
  );
}
