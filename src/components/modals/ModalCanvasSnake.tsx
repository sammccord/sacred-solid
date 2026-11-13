import type { JSX } from "@solidjs/web";
import type { AugProps } from "../../aug/index.ts";
import type { ThemeProps } from "../../style/index.ts";
import { isEmpty } from "../../common/utilities.ts";
import { Button } from "../Button.tsx";
import { CanvasSnake } from "../CanvasSnake.tsx";
import { Card } from "../Card.tsx";
import { useModals } from "../page/ModalContext.tsx";
import styles from "./ModalCanvasSnake.module.css";

export interface ModalCanvasSnakeProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  buttonText?: JSX.Element;
}

export function ModalCanvasSnake(props: ModalCanvasSnakeProps) {
  const { close } = useModals();

  return (
    <div class={styles.root}>
      <Card title="CANVAS PLATFORMER" class={props.class} aug={props.aug} theme={props.theme}>
        <CanvasSnake rows={12} />
        <br />
        <br />
        <Button onClick={() => close()}>
          {isEmpty(props.buttonText) ? "Close" : props.buttonText}
        </Button>
      </Card>
    </div>
  );
}
