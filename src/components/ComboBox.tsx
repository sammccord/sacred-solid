import { createMemo, createSignal, For } from "solid-js";
import { AlertBanner } from "./AlertBanner.tsx";
import { ButtonGroup } from "./ButtonGroup.tsx";
import { CardDouble } from "./CardDouble.tsx";
import styles from "./ComboBox.module.css";
import { Input } from "./Input.tsx";
import { classNames } from "../common/utilities.ts";

export interface ComboBoxProps {
  class?: string;
  data: string[][];
  label?: string;
}

const MAX_DISPLAYED = 5;

export function ComboBox(props: ComboBoxProps) {
  const [searchTerm, setSearchTerm] = createSignal("");

  const filtered = createMemo(() => {
    const term = searchTerm();
    if (!term) return [];
    return props.data
      .slice(1)
      .filter((entry) => entry[0]?.toLowerCase().includes(term.toLowerCase()));
  });

  const displayed = createMemo(() => {
    const sliced = props.data.slice(1);
    const matches = filtered();
    if (matches.length >= MAX_DISPLAYED) return matches.slice(0, MAX_DISPLAYED);
    if (matches.length === 0 && searchTerm()) return sliced.slice(0, MAX_DISPLAYED);
    if (matches.length > 0 && matches.length < MAX_DISPLAYED) {
      const needed = MAX_DISPLAYED - matches.length;
      const remainder = sliced.filter((entry) => !matches.includes(entry));
      return [...matches, ...remainder.slice(0, needed)];
    }
    return sliced.slice(0, MAX_DISPLAYED);
  });

  return (
    <>
      <div class={classNames(styles.root, props.class)}>
        <Input
          autocomplete="off"
          isBlink
          label={props.label}
          name="input_test_blink"
          value={searchTerm()}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
        />
      </div>
      <For each={displayed()}>
        {(entry) => (
          <CardDouble title={entry[0]}>
            <AlertBanner>{entry[1]}</AlertBanner>
            <br />
            <ButtonGroup
              isFull
              items={[{ body: "FAVORITE" }, { body: "DONATE" }, { body: "LEARN MORE" }]}
            />
          </CardDouble>
        )}
      </For>
    </>
  );
}
