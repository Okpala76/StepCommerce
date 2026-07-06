import { z } from "zod";

export const productStatusSchema = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);

export const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional(),
  sku: z.string().trim().min(3).max(40),
  price: z.coerce.number().positive(),
  status: productStatusSchema,
  stockQuantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).max(100),
  categoryId: z.string().trim().min(1),
});

export type ProductInput = z.infer<typeof productSchema>;
