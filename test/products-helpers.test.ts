import { describe, expect, it } from "vitest";

import {
  formatProductPrice,
  isLowStock,
  normalizeProductFilters,
} from "../features/products/types";

describe("product helpers", () => {
  it("normalizes shareable filter params", () => {
    const filters = normalizeProductFilters({
      query: ["earbuds"],
      status: "active",
      categoryId: "cat_audio",
    });

    expect(filters).toEqual({
      query: "earbuds",
      status: "ACTIVE",
      categoryId: "cat_audio",
    });
  });

  it("formats prices for display", () => {
    expect(formatProductPrice(129.99)).toBe("$129.99");
  });

  it("detects low stock correctly", () => {
    expect(isLowStock(3, 5)).toBe(true);
    expect(isLowStock(8, 5)).toBe(false);
  });
});
