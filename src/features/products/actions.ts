"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Prisma } from "@/src/generated/prisma/client";
import { db } from "@/lib/db";

import {
  createProductSchema,
  initialProductActionState,
  type ProductActionState,
  updateProductSchema,
} from "./schema";

const productsPath = "/products";
const newProductPath = "/products/new";

function buildProductSlug(name: string, sku: string) {
  const normalizedName = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const normalizedSku = sku
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalizedName}-${normalizedSku}`;
}

function getProductPayload(formData: FormData) {
  return {
    id: formData.get("id"),
    name: formData.get("name"),
    sku: formData.get("sku"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    lowStockThreshold: formData.get("lowStockThreshold"),
    status: formData.get("status"),
    categoryId: formData.get("categoryId"),
  };
}

function getValidationErrorState(
  fieldErrors: Record<string, string[] | undefined>,
): ProductActionState {
  return {
    status: "error",
    message: "Please fix the highlighted fields and try again.",
    fieldErrors,
  };
}

function getMutationErrorState(error: unknown): ProductActionState {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return {
      status: "error",
      message: "That SKU is already in use.",
      fieldErrors: {
        sku: ["Choose a unique SKU for this product."],
      },
    };
  }

  return {
    status: "error",
    message: "We could not save that product. Please try again.",
  };
}

export async function createProduct(
  previousState: ProductActionState = initialProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  void previousState;

  const parsed = createProductSchema.safeParse(getProductPayload(formData));

  if (!parsed.success) {
    return getValidationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await db.product.create({
      data: {
        name: parsed.data.name,
        slug: buildProductSlug(parsed.data.name, parsed.data.sku),
        sku: parsed.data.sku,
        description: parsed.data.description,
        price: parsed.data.price,
        stockQuantity: parsed.data.stock,
        lowStockThreshold: parsed.data.lowStockThreshold,
        status: parsed.data.status,
        categoryId: parsed.data.categoryId,
      },
    });
  } catch (error) {
    return getMutationErrorState(error);
  }

  revalidatePath(productsPath);
  revalidatePath(newProductPath);
  redirect(productsPath);
}

export async function updateProduct(
  previousState: ProductActionState = initialProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  void previousState;

  const parsed = updateProductSchema.safeParse(getProductPayload(formData));

  if (!parsed.success) {
    return getValidationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await db.product.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        name: parsed.data.name,
        slug: buildProductSlug(parsed.data.name, parsed.data.sku),
        sku: parsed.data.sku,
        description: parsed.data.description,
        price: parsed.data.price,
        stockQuantity: parsed.data.stock,
        lowStockThreshold: parsed.data.lowStockThreshold,
        status: parsed.data.status,
        categoryId: parsed.data.categoryId,
      },
    });
  } catch (error) {
    return getMutationErrorState(error);
  }

  revalidatePath(productsPath);
  revalidatePath(`/products/${parsed.data.id}/edit`);
  redirect(productsPath);
}

export async function archiveProduct(formData: FormData) {
  const rawId = formData.get("id");

  if (typeof rawId !== "string" || rawId.trim().length === 0) {
    throw new Error("Product id is required.");
  }

  await db.product.update({
    where: {
      id: rawId,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  revalidatePath(productsPath);
  revalidatePath(`/products/${rawId}/edit`);
}

export async function deleteProduct(formData: FormData) {
  const rawId = formData.get("id");

  if (typeof rawId !== "string" || rawId.trim().length === 0) {
    throw new Error("Product id is required.");
  }

  const product = await db.product.findUnique({
    where: {
      id: rawId,
    },
    select: {
      status: true,
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (product.status !== "ARCHIVED") {
    throw new Error("Archive a product before deleting it.");
  }

  await db.product.delete({
    where: {
      id: rawId,
    },
  });

  revalidatePath(productsPath);
}
