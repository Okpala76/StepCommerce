import { z } from "zod";

const categoryBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(80, "Name must be 80 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer.")
    .optional()
    .or(z.literal("")),
});

export const createCategorySchema = categoryBaseSchema;
export const updateCategorySchema = categoryBaseSchema.extend({
  id: z.string().trim().min(1, "Category id is required."),
});

export type CategoryActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "description" | "id", string[]>>;
};

export const initialCategoryActionState: CategoryActionState = {
  status: "idle",
};
