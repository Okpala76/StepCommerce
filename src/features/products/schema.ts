import { z } from "zod";

import { productStatusValues } from "./types";

const optionalDescriptionSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().max(500, "Description must be 500 characters or fewer.").optional());

const productBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name must be 120 characters or fewer."),
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required.")
    .max(60, "SKU must be 60 characters or fewer."),
  description: optionalDescriptionSchema,
  price: z.coerce
    .number()
    .min(0, "Price must be greater than or equal to 0."),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number.")
    .min(0, "Stock must be greater than or equal to 0."),
  lowStockThreshold: z.coerce
    .number()
    .int("Low stock threshold must be a whole number.")
    .min(0, "Low stock threshold must be greater than or equal to 0."),
  status: z.enum(productStatusValues, {
    message: "Select a valid product status.",
  }),
  categoryId: z.string().trim().min(1, "Category is required."),
});

export const createProductSchema = productBaseSchema;

export const updateProductSchema = productBaseSchema.extend({
  id: z.string().trim().min(1, "Product id is required."),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export type ProductFieldErrors = Partial<
  Record<
    | "id"
    | "name"
    | "sku"
    | "description"
    | "price"
    | "stock"
    | "lowStockThreshold"
    | "status"
    | "categoryId",
    string[]
  >
>;

export type ProductActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: ProductFieldErrors;
};

export const initialProductActionState: ProductActionState = {
  status: "idle",
};
