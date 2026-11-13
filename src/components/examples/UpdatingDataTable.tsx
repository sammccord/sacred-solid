import { createSignal, onSettled } from "solid-js";
import { DataTable } from "../DataTable.tsx";

export interface UpdatingDataTableProps {
  data: string[][];
  class?: string;
}

function priceOf(row: string[]): number {
  return parseFloat((row[2] ?? "").replace("$", ""));
}

function tick(prevData: string[][]): string[][] {
  const [header = [], ...rows] = prevData;

  const updatedRows = rows.map((row) => {
    const currentPrice = priceOf(row);
    const currentHoldings = parseInt(row[3] ?? "", 10);
    const priceChangeFactor = 1 + (Math.random() - 0.5) * 0.1;
    const newPrice = currentPrice * priceChangeFactor;
    const holdingsChange = Math.floor((Math.random() - 0.5) * 20);
    const newHoldings = Math.max(1, currentHoldings + holdingsChange);

    return [row[0] ?? "", row[1] ?? "", `$${newPrice.toFixed(2)}`, newHoldings.toString()];
  });

  updatedRows.sort((a, b) => priceOf(b) - priceOf(a));

  return [header, ...updatedRows];
}

export function UpdatingDataTable(props: UpdatingDataTableProps) {
  const [tableData, setTableData] = createSignal(props.data);

  onSettled(() => {
    const interval = setInterval(() => setTableData(tick), 1000);
    return () => clearInterval(interval);
  });

  return <DataTable class={props.class} data={tableData()} />;
}
