import { type JSX, onCleanup, onMount } from "solid-js";

export interface OutsideElementEventProps {
  class?: string;
  children?: JSX.Element;
  onOutsideEvent: (event: MouseEvent | TouchEvent) => void;
  style?: JSX.CSSProperties;
}

export function OutsideElementEvent(props: OutsideElementEventProps) {
  let ref: HTMLDivElement | undefined;

  const handleOutsideEvent = (event: MouseEvent | TouchEvent) => {
    if (!(event.target instanceof Element)) return;

    if (event.target.hasAttribute("data-detector-ignore")) {
      return;
    }

    if (ref && !ref.contains(event.target)) {
      props.onOutsideEvent(event);
    }
  };

  onMount(() => {
    document.addEventListener("mousedown", handleOutsideEvent);
    document.addEventListener("touchstart", handleOutsideEvent);

    onCleanup(() => {
      document.removeEventListener("mousedown", handleOutsideEvent);
      document.removeEventListener("touchstart", handleOutsideEvent);
    });
  });

  return (
    <div ref={(element) => (ref = element)} class={props.class} style={props.style}>
      {props.children}
    </div>
  );
}
