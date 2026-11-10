import type { JSX } from "solid-js";
import type { AugProps } from "../../aug/index.ts";
import type { ThemeProps } from "../../style/index.ts";
import { isEmpty } from "../../common/utilities.ts";
import { Button } from "../Button.tsx";
import { Card } from "../Card.tsx";
import { DOMSnake } from "../DOMSnake.tsx";
import { useModals } from "../page/ModalContext.tsx";
import styles from "./ModalCanvasSnake.module.css";

export interface ModalDOMSnakeProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  buttonText?: JSX.Element;
}

export function ModalDOMSnake(props: ModalDOMSnakeProps) {
  const { close } = useModals();

  return (
    <div class={styles.root}>
      <Card title="DOM SNAKE" class={props.class} aug={props.aug} theme={props.theme}>
        <DOMSnake height={14} width={34} />
        <br />
        <br />
        <Button onClick={() => close()}>
          {isEmpty(props.buttonText) ? "Close" : props.buttonText}
        </Button>
      </Card>
    </div>
  );
}
