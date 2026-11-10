import styles from "./PageConceptOne.module.css";
import { Card } from "../Card.tsx";
import { DataTable } from "../DataTable.tsx";
import { Dialog } from "../Dialog.tsx";
import { classNames } from "../../common/utilities.ts";

const sampleRows = (count: number) => [
  ["HEADING A", "HEADING B"],
  ...Array.from({ length: count }, (_, i) => [`DATA ${2 * i + 1}`, `DATA ${2 * i + 2}`]),
];

export function PageConceptOne(props: { class?: string }) {
  return (
    <div class={classNames(styles.root, props.class)}>
      <div class={styles.top}>
        <div class={styles.heading}>
          <div class={styles.left}>
            <Card title="SECTION A">
              <DataTable data={sampleRows(5)} />
            </Card>
          </div>
          <div class={styles.center}></div>
          <div class={styles.right}>
            <Card title="SECTION B">
              <DataTable data={sampleRows(5)} />
            </Card>
          </div>
        </div>

        <div class={styles.middle}>
          <Dialog title="START SIMULATION">
            There are unsaved changes.
            <br />
            Are you sure you want to start a new simulation?
          </Dialog>
        </div>

        <div class={styles.base}>
          <div class={styles.left}>
            <Card title="SECTION C">
              <DataTable data={sampleRows(5)} />
            </Card>
          </div>
          <div class={styles.center}></div>
          <div class={styles.right}>
            <Card title="SECTION D">
              <DataTable data={sampleRows(5)} />
            </Card>
          </div>
        </div>
      </div>
      <div class={styles.bottom}>
        <div class={styles.col}>
          <Card title="SECTION E">
            <DataTable data={sampleRows(5)} />
          </Card>
          <Card title="SECTION F">
            <DataTable data={sampleRows(5)} />
          </Card>
        </div>
        <div class={styles.col}>
          <Card title="SECTION G">
            <DataTable data={sampleRows(5)} />
          </Card>
          <Card title="SECTION H">
            <DataTable data={sampleRows(5)} />
          </Card>
        </div>
        <div class={styles.col}>
          <Card title="SECTION I">
            <DataTable data={sampleRows(5)} />
          </Card>
          <Card title="SECTION J">
            <DataTable data={sampleRows(5)} />
          </Card>
        </div>
        <div class={styles.col}>
          <Card title="SECTION K">
            <DataTable data={sampleRows(5)} />
          </Card>
          <Card title="SECTION L">
            <DataTable data={sampleRows(5)} />
          </Card>
        </div>
        <div class={styles.col}>
          <Card title="SECTION M">
            <DataTable data={sampleRows(5)} />
          </Card>
          <Card title="SECTION N">
            {" "}
            <DataTable data={sampleRows(5)} />
          </Card>
        </div>
      </div>
    </div>
  );
}
