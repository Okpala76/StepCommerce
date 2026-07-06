import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."), // Adjust path to your src folder
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./test/setup.ts"],

    include: ["test/**/*.test.ts"],
  },
});
