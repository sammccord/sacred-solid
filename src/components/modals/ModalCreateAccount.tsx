import type { AugProps } from "../../aug/index.ts";
import type { ThemeProps } from "../../style/index.ts";
import { Button } from "../Button.tsx";
import { CardDouble } from "../CardDouble.tsx";
import { Checkbox } from "../Checkbox.tsx";
import { Input } from "../Input.tsx";
import { useModals } from "../page/ModalContext.tsx";
import { RadioButtonGroup } from "../RadioButtonGroup.tsx";
import styles from "./ModalAlert.module.css";

export interface ModalCreateAccountProps {
  class?: string;
  aug?: AugProps;
  theme?: ThemeProps;
}

export function ModalCreateAccount(props: ModalCreateAccountProps) {
  const { close } = useModals();

  return (
    <div class={styles.root}>
      <CardDouble title="NEW ACCOUNT" class={props.class} aug={props.aug} theme={props.theme}>
        Create a new MakeBelieve™ account, where anything is possible at your command line in the
        browser.
        <br />
        <br />
        <RadioButtonGroup
          defaultValue="modal_developer"
          options={[
            { value: "modal_individual", label: "I’m using this for personal use." },
            { value: "modal_developer", label: "I’m building or creating something for work." },
            { value: "modal_company", label: "We’re using this as a team or organization." },
          ]}
        />
        <br />
        <Input
          autocomplete="off"
          label="USERNAME"
          placeholder="Choose a username (e.g., SurfGirl29)"
          name="modal_username"
        />
        <Input
          autocomplete="off"
          label="PASSWORD"
          placeholder="Create a password (8+ characters)"
          type="password"
          name="modal_password"
        />
        <Input
          autocomplete="off"
          label="CONFIRM"
          placeholder="Type it again"
          type="password"
          name="modal_confirm"
        />
        <br />
        <Checkbox name="modal_terms">
          I agree to the Terms of Service, Data Privacy Policy, and Acceptable Use Guidelines.
        </Checkbox>
        <Checkbox name="modal_goodwill">
          I agree not to use this service for unlawful purposes.
        </Checkbox>
        <br />
        <Button onClick={() => close()}>Create an account</Button>
      </CardDouble>
    </div>
  );
}
