import { vi } from "vitest";

vi.mock("../config/connectRedis", () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn()
  }
}));