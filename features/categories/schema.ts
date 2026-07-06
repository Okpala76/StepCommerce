import { z } from "zod";

const categorySlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const optionalDescriptionSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().max(240, "Description must be 240 characters or fewer.").optional());

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80, "Name must be 80 characters or fewer."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .max(80, "Slug must be 80 characters or fewer.")
    .regex(
      categorySlugPattern,
      "Use lowercase letters, numbers, and hyphens only.",
    ),
  description: optionalDescriptionSchema,
});

export const updateCategorySchema = categorySchema.extend({
  id: z.string().trim().min(1, "Category id is required."),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export type CategoryFieldErrors = Partial<
  Record<"id" | "name" | "slug" | "description", string[]>
>;

export type CategoryActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: CategoryFieldErrors;
};

export const initialCategoryActionState: CategoryActionState = {
  status: "idle",
};
