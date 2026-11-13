import type { JSX } from "@solidjs/web";
import type { AugProps } from "../../aug/index.ts";
import type { ThemeProps } from "../../style/index.ts";
import { isEmpty } from "../../common/utilities.ts";
import { createHotkeys } from "../../modules/hotkeys/index.ts";
import { Button } from "../Button.tsx";
import { CardDouble } from "../CardDouble.tsx";
import { Chessboard } from "../Chessboard.tsx";
import { useModals } from "../page/ModalContext.tsx";
import styles from "./ModalChess.module.css";

export interface ModalChessProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  buttonText?: JSX.Element;
  board: string[][];
  title?: string;
}

export function ModalChess(props: ModalChessProps) {
  const { close } = useModals();

  createHotkeys("enter", () => close());

  return (
    <div class={styles.root}>
      <CardDouble
        title={props.title}
        style={{ "text-align": "center" }}
        class={props.class}
        aug={props.aug}
        theme={props.theme}
      >
        <Chessboard board={props.board} />
        <br />
        <br />
        <Button onClick={() => close()}>
          {isEmpty(props.buttonText) ? "CLOSE" : props.buttonText}
        </Button>
      </CardDouble>
    </div>
  );
}
