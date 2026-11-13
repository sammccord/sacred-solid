import { merge } from "solid-js";
//NOTE: Solid merges a literal {" "} into the neighboring text. React renders it as its own text node, which shifts layout by a sub-pixel. Using this identifier keeps the separate node.
export const SPACE = " ";

export function deepEqual(x: unknown, y: unknown): boolean {
  if (x && y && typeof x === "object" && typeof y === "object") {
    const a = x as Record<string, unknown>;
    const b = y as Record<string, unknown>;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every((key) => deepEqual(a[key], b[key]));
  }
  return x === y;
}

function removeBodyClassesWithPrefix(prefix: string) {
  for (const existingClass of Array.from(document.body.classList)) {
    if (existingClass.startsWith(prefix)) {
      document.body.classList.remove(existingClass);
    }
  }
}

export function onHandleAppearanceModeChange(className?: string) {
  removeBodyClassesWithPrefix("tint-");
  if (className) {
    document.body.classList.add(className);
  }
}

export function onHandleAppearanceChange(className?: string) {
  removeBodyClassesWithPrefix("theme-");
  document.body.classList.add(className || "theme-light");
}

export function onHandleFontChange(className?: string) {
  removeBodyClassesWithPrefix("font-");
  if (className) {
    document.body.classList.add(className);
  }
}

export function leftPad(input: string, length: number): string {
  return "0".repeat(Math.max(0, length - input.length)) + input;
}

export function isEmpty(text: unknown): boolean {
  if (text === 0) {
    return false;
  }
  if (!text || typeof text === "object") {
    return true;
  }
  return !(text as string | number | boolean).toString().trim();
}

export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | { [className: string]: unknown };

//NOTE: React default parameters apply only when a prop is undefined. Solid 2's merge lets an explicit undefined win, so each default is re-read through a getter.
export function mergeDefaults<D extends object, P extends object>(defaults: D, props: P) {
  const resolved = {} as D;
  for (const key of Object.keys(defaults) as (keyof D & string)[]) {
    Object.defineProperty(resolved, key, {
      enumerable: true,
      get: () => {
        const value = (props as Record<string, unknown>)[key];
        return value === undefined ? defaults[key] : value;
      },
    });
  }
  return merge(defaults, props, resolved);
}

export type SlotClasses<Slot extends string> = { [K in Slot]?: string };

export function classNames(...args: ClassValue[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      const inner = classNames(...arg);
      if (inner) classes.push(inner);
    } else if (arg !== true) {
      for (const key of Object.keys(arg)) {
        if (arg[key]) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}

const FOCUSABLE_SELECTOR =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

export function isFocusableElement(element: EventTarget | null): element is HTMLElement {
  return element instanceof HTMLElement && element.matches(FOCUSABLE_SELECTOR);
}

export function findNextFocusable(
  element: Element | null,
  direction: "next" | "previous" = "next",
): HTMLElement | null {
  if (!element) return null;

  const focusableElements = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  const currentIndex = focusableElements.indexOf(element as HTMLElement);
  if (currentIndex === -1) return null;

  const count = focusableElements.length;
  const nextIndex =
    direction === "next" ? (currentIndex + 1) % count : (currentIndex - 1 + count) % count;
  return focusableElements[nextIndex] ?? null;
}

export function findFocusableDescendant(
  container: Element | null,
  currentFocused: Element | null = null,
  direction: "next" | "previous" = "next",
): HTMLElement | null {
  if (!container) return null;

  const focusableElements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  if (focusableElements.length === 0) return null;

  let index = 0;
  const currentIndex = currentFocused
    ? focusableElements.indexOf(currentFocused as HTMLElement)
    : -1;
  if (currentIndex !== -1) {
    index = direction === "next" ? currentIndex + 1 : currentIndex - 1;
  }

  return focusableElements[index] ?? null;
}
