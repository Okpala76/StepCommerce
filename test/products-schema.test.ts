import { describe, expect, it } from "vitest";

import {
  createProductSchema,
  updateProductSchema,
} from "../features/products/schema";

describe("product schemas", () => {
  it("accepts a valid create payload", () => {
    const result = createProductSchema.safeParse({
      name: "Wireless Earbuds Pro",
      sku: "ELEC-1001",
      description: "Noise-canceling earbuds with charging case.",
      price: "129.99",
      stock: "8",
      lowStockThreshold: "5",
      status: "ACTIVE",
      categoryId: "cat_electronics",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(129.99);
      expect(result.data.stock).toBe(8);
    }
  });

  it("rejects invalid numeric values and missing category", () => {
    const result = createProductSchema.safeParse({
      name: "",
      sku: "",
      price: "-1",
      stock: "-2",
      lowStockThreshold: "-1",
      status: "ACTIVE",
      categoryId: "",
    });

    expect(result.success).toBe(false);
  });

  it("requires an id when updating a product", () => {
    const result = updateProductSchema.safeParse({
      name: "Wireless Earbuds Pro",
      sku: "ELEC-1001",
      price: "129.99",
      stock: "8",
      lowStockThreshold: "5",
      status: "ACTIVE",
      categoryId: "cat_electronics",
    });

    expect(result.success).toBe(false);
  });
});
