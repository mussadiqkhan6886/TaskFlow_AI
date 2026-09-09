import { vi } from "vitest";

vi.mock("@/config/redis", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn()
  }
}));