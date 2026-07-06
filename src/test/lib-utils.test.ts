import { describe, expect, it } from "vitest";

import { cn } from "../../lib/utils";

describe("cn", () => {
  it("merges and deduplicates class names", () => {
    expect(cn("px-2 py-1", undefined, "px-4", "font-medium")).toBe(
      "py-1 px-4 font-medium",
    );
  });
});
