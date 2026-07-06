"use server";

import { revalidatePath } from "next/cache";

import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

import {
  createCategorySchema,
  initialCategoryActionState,
  updateCategorySchema,
  type CategoryActionState,
} from "./schema";

const categoriesPath = "/categories";

function getCategoryPayload(formData: FormData) {
  return {
    id: formData.get("id"),
    name: formData.get("name"),
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
      message: "That category slug is already in use.",
      fieldErrors: {
        name: ["Choose a unique category name."],
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

  const parsed = createCategorySchema.safeParse(getCategoryPayload(formData));

  if (!parsed.success) {
    return getValidationErrorState(parsed.error.flatten().fieldErrors);
  }

  const slug = parsed.data.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    await db.category.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description,
      },
    });
  } catch (error) {
    return getMutationErrorState(error);
  }

  revalidatePath(categoriesPath);
  return initialCategoryActionState;
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

  const slug = parsed.data.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    await db.category.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description,
      },
    });
  } catch (error) {
    return getMutationErrorState(error);
  }

  revalidatePath(categoriesPath);
  return initialCategoryActionState;
}

export async function deleteCategoryAction(formData: FormData) {
  const rawId = formData.get("id");

  if (typeof rawId !== "string" || rawId.trim().length === 0) {
    throw new Error("Category id is required.");
  }

  await db.category.delete({
    where: { id: rawId },
  });

  revalidatePath(categoriesPath);
}
