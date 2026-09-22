import "@testing-library/jest-dom/vitest";
Object.defineProperty(
  window.HTMLElement.prototype,
  "scrollIntoView",
  {
    value: vi.fn(),
    writable: true,
  }
);