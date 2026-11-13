import type { JSX } from "@solidjs/web";
import type { AugProps } from "../../aug/index.ts";
import type { ThemeProps } from "../../style/index.ts";
import { isEmpty } from "../../common/utilities.ts";
import { Button } from "../Button.tsx";
import { Card } from "../Card.tsx";
import { MatrixLoader } from "../MatrixLoader.tsx";
import { useModals } from "../page/ModalContext.tsx";
import styles from "./ModalMatrixModes.module.css";

export interface ModalMatrixModesProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
  buttonText?: JSX.Element;
}

export function ModalMatrixModes(props: ModalMatrixModesProps) {
  const { close } = useModals();

  return (
    <div class={styles.root}>
      <Card title="MATRIX MODES" class={props.class} aug={props.aug} theme={props.theme}>
        <Card title="KATAKANA DEFAULT">
          <MatrixLoader rows={32} mode="katakana" />
        </Card>
        <Card title="GREEK LTR">
          <MatrixLoader direction="left-to-right" rows={8} mode="greek" />
        </Card>
        <br />
        <br />
        <Button onClick={() => close()}>
          {isEmpty(props.buttonText) ? "Close" : props.buttonText}
        </Button>
      </Card>
    </div>
  );
}
