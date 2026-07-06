"use server";

import { revalidatePath } from "next/cache";

import { Prisma } from "@/src/generated/prisma/client";
import { db } from "@/lib/db";

import {
  categorySchema,
  initialCategoryActionState,
  type CategoryActionState,
  updateCategorySchema,
} from "./schema";

const categoriesPath = "/categories";

function getCategoryPayload(formData: FormData) {
  return {
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
  };
}

function getValidationErrorState(
  fieldErrors: Record<string, string[] | undefined>,
): CategoryActionState {
  return {
    status: "error",
    message: "Please fix the highlighted fields and try again.",
    fieldErrors,
  };
}

function getMutationErrorState(error: unknown): CategoryActionState {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return {
      status: "error",
      message: "That slug is already in use.",
      fieldErrors: {
        slug: ["Choose a unique slug for this category."],
      },
    };
  }

  return {
    status: "error",
    message: "We could not save that category. Please try again.",
  };
}

export async function createCategoryAction(
  previousState: CategoryActionState = initialCategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  void previousState;

  const parsed = categorySchema.safeParse(getCategoryPayload(formData));

  if (!parsed.success) {
    return getValidationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await db.category.create({
      data: parsed.data,
    });
  } catch (error) {
    return getMutationErrorState(error);
  }

  revalidatePath(categoriesPath);

  return {
    status: "success",
    message: "Category created successfully.",
  };
}

export async function updateCategoryAction(
  previousState: CategoryActionState = initialCategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  void previousState;

  const parsed = updateCategorySchema.safeParse(getCategoryPayload(formData));

  if (!parsed.success) {
    return getValidationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await db.category.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
      },
    });
  } catch (error) {
    return getMutationErrorState(error);
  }

  revalidatePath(categoriesPath);

  return {
    status: "success",
    message: "Category updated successfully.",
  };
}

export async function deleteCategoryAction(formData: FormData) {
  const rawId = formData.get("id");
  const rawProductCount = formData.get("productCount");

  if (typeof rawId !== "string" || rawId.trim().length === 0) {
    throw new Error("Category id is required.");
  }

  const productCount =
    typeof rawProductCount === "string" ? Number(rawProductCount) : NaN;

  if (Number.isFinite(productCount) && productCount > 0) {
    throw new Error("Remove the products in this category before deleting it.");
  }

  await db.category.delete({
    where: {
      id: rawId,
    },
  });

  revalidatePath(categoriesPath);
}
