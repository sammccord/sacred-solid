import { type JSX, spread } from "@solidjs/web";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/solid/alert-dialog";
import { children as resolveChildren, Show, untrack } from "solid-js";
import type { AugProps } from "../aug/index.ts";
import { styleAttributes, type ThemeProps } from "../style/index.ts";
import { Block } from "./Block.tsx";
import { Button } from "./Button.tsx";
import styles from "./Dialog.module.css";
import { classNames } from "../common/utilities.ts";

export interface DialogProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  title?: JSX.Element;
  children?: JSX.Element;
  style?: JSX.CSSProperties;
  onConfirm?: () => void;
  onCancel?: () => void;
  trigger?: JSX.Element;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog(props: DialogProps) {
  const isDialog = untrack(
    () =>
      props.trigger !== undefined || props.open !== undefined || props.defaultOpen !== undefined,
  );
  if (!isDialog) return <DialogPanel {...props} />;

  const resolved = resolveChildren(() => props.trigger);
  const trigger = untrack(() =>
    resolved.toArray().find((node): node is HTMLElement => node instanceof HTMLElement),
  );

  return (
    <AlertDialog
      {...(props.open === undefined
        ? { defaultOpen: props.defaultOpen ?? false }
        : {
            get open() {
              return props.open;
            },
          })}
      onOpenChange={(open) => props.onOpenChange?.(open)}
    >
      <Show when={trigger}>
        {(element) => (
          <AlertDialogTrigger
            render={(triggerProps) => {
              spread(element(), triggerProps, true);
              return element();
            }}
          />
        )}
      </Show>
      <AlertDialogContent
        class={classNames(styles.root, styles.popup, props.class)}
        {...styleAttributes(props, props.style)}
      >
        <AlertDialogTitle class={styles.header}>{props.title}</AlertDialogTitle>
        <br />
        <AlertDialogDescription class={styles.message}>{props.children}</AlertDialogDescription>
        <br />
        <div class={styles.actions}>
          <AlertDialogClose
            value="confirm"
            action={() => props.onConfirm?.()}
            render={(closeProps) => (
              <Button {...closeProps} variant="SECONDARY">
                OK
              </Button>
            )}
          />
          <Block style={{ opacity: 0 }} />
          <AlertDialogClose
            value="cancel"
            action={() => props.onCancel?.()}
            render={(closeProps) => (
              <Button {...closeProps} variant="SECONDARY">
                Cancel
              </Button>
            )}
          />
        </div>
        <br />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DialogPanel(props: DialogProps) {
  return (
    <div class={classNames(styles.root, props.class)} {...styleAttributes(props, props.style)}>
      <header class={styles.header}>{props.title}</header>
      <br />
      <article class={styles.message}>{props.children}</article>
      <br />
      <div class={styles.actions}>
        <Button variant="SECONDARY" onClick={props.onConfirm}>
          OK
        </Button>
        <Block style={{ opacity: 0 }} />
        <Button variant="SECONDARY" onClick={props.onCancel}>
          Cancel
        </Button>
      </div>
      <br />
    </div>
  );
}
