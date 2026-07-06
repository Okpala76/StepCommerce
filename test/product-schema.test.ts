import { describe, expect, it } from "vitest";

import { productSchema } from "@/features/products/validations/product_schema";

describe("productSchema", () => {
  it("accepts a valid product payload", () => {
    const parsed = productSchema.parse({
      name: "Wireless Earbuds Pro",
      slug: "wireless-earbuds-pro",
      description: "Noise-canceling earbuds with charging case.",
      sku: "ELEC-1001",
      price: 129.99,
      status: "ACTIVE",
      stockQuantity: 7,
      lowStockThreshold: 5,
      categoryId: "cat_electronics",
    });

    expect(parsed.status).toBe("ACTIVE");
    expect(parsed.price).toBe(129.99);
  });

  it("rejects invalid inventory and pricing data", () => {
    const result = productSchema.safeParse({
      name: "Bad Product",
      slug: "bad-product",
      sku: "BAD-001",
      price: 0,
      status: "ACTIVE",
      stockQuantity: -1,
      lowStockThreshold: 5,
      categoryId: "cat_electronics",
    });

    expect(result.success).toBe(false);
  });
});
