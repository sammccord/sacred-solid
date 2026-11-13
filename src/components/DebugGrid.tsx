import { onSettled } from "solid-js";

export function DebugGrid(): null {
  onSettled(() => {
    const debugGrid = document.createElement("div");
    let isVisible = false;

    const setGridHeight = () => {
      debugGrid.style.height = `${document.documentElement.scrollHeight}px`;
    };

    const styleProperties: Record<string, string> = {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      "z-index": "-1",
      margin: "0",
      "background-image": `
        repeating-linear-gradient(var(--theme-line) 0 var(--theme-line-width), transparent var(--theme-line-width) 100%),
        repeating-linear-gradient(90deg, var(--theme-line) 0 var(--theme-line-width), transparent var(--theme-line-width) 100%)
      `,
      "background-size": "1ch 1.25rem",
      "pointer-events": "none",
      display: "none",
    };
    for (const [property, value] of Object.entries(styleProperties)) {
      debugGrid.style.setProperty(property, value);
    }

    document.body.appendChild(debugGrid);
    setGridHeight();

    const handleDebugGridToggle = () => {
      isVisible = !isVisible;
      debugGrid.style.display = isVisible ? "block" : "none";
    };

    const observer = new ResizeObserver(setGridHeight);
    observer.observe(document.documentElement);

    window.addEventListener("debugGridToggle", handleDebugGridToggle);
    window.addEventListener("resize", setGridHeight);

    return () => {
      document.body.removeChild(debugGrid);
      window.removeEventListener("resize", setGridHeight);
      window.removeEventListener("debugGridToggle", handleDebugGridToggle);
      observer.disconnect();
    };
  });

  return null;
}

export function toggleDebugGrid(): void {
  window.dispatchEvent(new CustomEvent("debugGridToggle"));
}
