import { describe, expect, it } from "vitest";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../features/categories/schema";

describe("category schemas", () => {
  it("accepts a valid create payload", () => {
    const result = createCategorySchema.safeParse({
      name: "Electronics",
      description: "Phones, laptops, and accessories",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty category name", () => {
    const result = createCategorySchema.safeParse({
      name: "",
      description: "",
    });

    expect(result.success).toBe(false);
  });

  it("requires an id when updating a category", () => {
    const result = updateCategorySchema.safeParse({
      name: "Electronics",
      description: "Phones, laptops, and accessories",
    });

    expect(result.success).toBe(false);
  });
});
