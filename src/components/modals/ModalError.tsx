import type { JSX } from "solid-js";
import type { AugProps } from "../../aug/index.ts";
import type { ThemeProps } from "../../style/index.ts";
import { SPACE } from "../../common/utilities.ts";
import { createHotkeys } from "../../modules/hotkeys/index.ts";
import { ActionButton } from "../ActionButton.tsx";
import { CardDouble } from "../CardDouble.tsx";
import { Grid } from "../Grid.tsx";
import { useModals } from "../page/ModalContext.tsx";
import styles from "./ModalError.module.css";

export interface ModalErrorProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  buttonText?: JSX.Element;
  message: JSX.Element;
  title?: string;
}

export function ModalError(props: ModalErrorProps) {
  const { close } = useModals();

  createHotkeys("enter", () => close());

  return (
    <div class={styles.root}>
      <CardDouble title={props.title} class={props.class} aug={props.aug} theme={props.theme}>
        <br />
        {props.message}
        <Grid>
          <ul>
            <li>
              Press{SPACE}
              <ActionButton hotkey="⏎" onClick={() => close()}>
                ENTER
              </ActionButton>
              {SPACE}
              to continue.
            </li>
          </ul>
        </Grid>
      </CardDouble>
    </div>
  );
}
