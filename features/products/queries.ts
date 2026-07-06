import { db } from "@/lib/db";

import type {
  ProductCategoryOption,
  ProductFilters,
  ProductFormValues,
  ProductListItem,
} from "./types";

function mapProduct(product: {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  price: { toNumber(): number };
  stockQuantity: number;
  lowStockThreshold: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    name: string;
  };
}): ProductListItem {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    description: product.description,
    price: product.price.toNumber(),
    stock: product.stockQuantity,
    lowStockThreshold: product.lowStockThreshold,
    status: product.status,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function getProducts(
  filters: ProductFilters,
): Promise<ProductListItem[]> {
  const products = await db.product.findMany({
    where: {
      ...(filters.query
        ? {
            OR: [
              {
                name: {
                  contains: filters.query,
                  mode: "insensitive",
                },
              },
              {
                sku: {
                  contains: filters.query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
      ...(filters.status !== "ALL"
        ? {
            status: filters.status,
          }
        : {}),
      ...(filters.categoryId
        ? {
            categoryId: filters.categoryId,
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      sku: true,
      description: true,
      price: true,
      stockQuantity: true,
      lowStockThreshold: true,
      status: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        name: "asc",
      },
    ],
  });

  return products.map(mapProduct);
}

export async function getProductById(
  productId: string,
): Promise<ProductFormValues | null> {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      sku: true,
      description: true,
      price: true,
      stockQuantity: true,
      lowStockThreshold: true,
      status: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return product ? mapProduct(product) : null;
}

export async function getCategoriesForProductForm(): Promise<
  ProductCategoryOption[]
> {
  return db.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}
