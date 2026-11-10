import type { JSX } from "solid-js";
import type { AugProps } from "../../aug/index.ts";
import type { ThemeProps } from "../../style/index.ts";
import { isEmpty } from "../../common/utilities.ts";
import { Button } from "../Button.tsx";
import { CanvasPlatformer } from "../CanvasPlatformer.tsx";
import { Card } from "../Card.tsx";
import { useModals } from "../page/ModalContext.tsx";
import styles from "./ModalCanvasPlatformer.module.css";

export interface ModalCanvasPlatformerProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  buttonText?: JSX.Element;
}

export function ModalCanvasPlatformer(props: ModalCanvasPlatformerProps) {
  const { close } = useModals();

  return (
    <div class={styles.root}>
      <Card title="ALERT" class={props.class} aug={props.aug} theme={props.theme}>
        <CanvasPlatformer rows={12} />
        <br />
        <br />
        <Button onClick={() => close()}>
          {isEmpty(props.buttonText) ? "Close" : props.buttonText}
        </Button>
      </Card>
    </div>
  );
}
