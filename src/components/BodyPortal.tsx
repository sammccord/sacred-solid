import { children, type JSX, onCleanup } from "solid-js";
import { insert } from "solid-js/web";

//NOTE: Solid's Portal wraps its content in a <div>; React's createPortal does not, and that wrapper shows up in the DOM.
export function BodyPortal(props: { children?: JSX.Element }) {
  const resolved = children(() => props.children);
  insert(document.body, resolved);
  onCleanup(() => {
    for (const node of resolved.toArray()) {
      if (!(node instanceof Node)) continue;
      node.parentNode?.removeChild(node);
    }
  });
  return null;
}
