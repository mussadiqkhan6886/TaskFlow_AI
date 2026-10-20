import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    hookTimeout: 120000,
    testTimeout: 30000,
    setupFiles: [
      "./__tests__/setup.ts"
    ],
    exclude: [
      "dist/**",
      "node_modules/**"
    ]
  }
});
