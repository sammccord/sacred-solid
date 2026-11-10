import { vi } from "vite-plus/test";

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

export function stubBrowserApis() {
  vi.stubGlobal("ResizeObserver", NoopObserver);
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.spyOn(console, "warn").mockImplementation(() => {});
}
