import { Dialog, DialogContent } from "@ui-sdk/solid/dialog";
import { createUniqueId, For } from "solid-js";
import { classNames } from "../common/utilities.ts";
import styles from "./ModalStack.module.css";
import { ModalTitle, useModals } from "./page/ModalContext.tsx";

export interface ModalStackProps {
  class?: string;
}

export function ModalStack(props: ModalStackProps) {
  const { modalStack, close } = useModals();

  return (
    <div class={classNames(styles.root, props.class)}>
      <For each={modalStack()}>
        {(modalState, index) => {
          const titleId = createUniqueId();
          const offsetFromLast = () => modalStack().length - 1 - index();

          return (
            <Dialog
              open
              modal
              closeOnOutsidePress={false}
              onOpenChange={(open) => {
                if (!open) close(modalState.key);
              }}
            >
              <DialogContent
                class={styles.item}
                aria-labelledby={titleId}
                style={{
                  transform: `translateY(${-offsetFromLast() * 40}px)`,
                  filter: `blur(${offsetFromLast() * 1.1}px)`,
                }}
              >
                <ModalTitle id={titleId}>{modalState.render()}</ModalTitle>
              </DialogContent>
            </Dialog>
          );
        }}
      </For>
    </div>
  );
}
