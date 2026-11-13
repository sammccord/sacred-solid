import { type JSX, Portal } from "@solidjs/web";

export function BodyPortal(props: { children?: JSX.Element }) {
  return <Portal mount={document.body}>{props.children}</Portal>;
}
