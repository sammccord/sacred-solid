import { For } from "solid-js";
import { ActionButton } from "../ActionButton.tsx";
import { Card } from "../Card.tsx";
import { RowSpaceBetween } from "../RowSpaceBetween.tsx";
import { SimpleTable } from "../SimpleTable.tsx";
import { Window } from "../Window.tsx";

const LINE_ITEMS: string[][] = [
  ["#", "DESC.", "UNIT RATE", "COUNT", "AMOUNT (USD)"],
  ["1", "Cloud Infrastructure (Mar)", "4,250.00", "1", "4,250.00"],
  ["2", "Design Software Licenses", "75.00", "2", "150.00"],
  ["3", "Office Supplies", "312.00", "1", "312.00"],
];

const LINE_ITEM_ALIGN: ("left" | "right")[] = ["left", "left", "right", "right", "right"];

const SUMMARY: Array<[string, string]> = [
  ["Subtotal", "$4,712.00"],
  ["Discount", "$-471.20"],
  ["Net Sales Total", "$4,240.80"],
  ["Tax", "$0.00"],
  ["Total", "$4,240.80"],
];

export function InvoiceTemplate(props: { class?: string }) {
  return (
    <Window class={props.class}>
      <Card title="INVOICE #1047" mode="left">
        Holy See — Apostolic Palace
        <br />
        Place du Palais des Papes
        <br />
        84000 Avignon, France
        <br />
        billing@avignon.va
        <br />
        <br />
        Billed To:
        <br />
        Jimmy Lee
        <br />
        Internet Development Studio Company
        <br />
        Green Door
        <br />
        San Francisco, CA
        <br />
        <br />
        Order No.: 1047
        <br />
        Invoice Date: Monday, March 9th 2026, 6:45 PM
      </Card>
      <br />
      <Card title="LINE ITEMS" mode="left">
        <SimpleTable data={LINE_ITEMS} align={LINE_ITEM_ALIGN} />
        <br />
        <For each={SUMMARY}>
          {([label, value]) => (
            <div style={{ display: "flex", "justify-content": "space-between" }}>
              <span>{label}</span>
              <span>{value}</span>
            </div>
          )}
        </For>
      </Card>
      <br />
      <RowSpaceBetween>
        <span>
          <ActionButton hotkey="ESC">EXIT</ActionButton>
        </span>
        <span>
          <ActionButton hotkey="↵">SUBMIT</ActionButton>
        </span>
      </RowSpaceBetween>
    </Window>
  );
}
