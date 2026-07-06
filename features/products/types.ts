export const productStatusValues = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;

export type ProductStatusValue = (typeof productStatusValues)[number];
export type ProductFilterStatus = ProductStatusValue | "ALL";

export type ProductFilters = {
  query: string;
  status: ProductFilterStatus;
  categoryId: string;
};

export type ProductCategoryOption = {
  id: string;
  name: string;
};

export type ProductListItem = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  stock: number;
  lowStockThreshold: number;
  status: ProductStatusValue;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductFormValues = ProductListItem;

export const productStatusLabels: Record<ProductStatusValue, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  ARCHIVED: "Archived",
};

function getSingleSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function normalizeProductFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ProductFilters {
  const query = getSingleSearchParam(searchParams.query).trim();
  const categoryId = getSingleSearchParam(searchParams.categoryId).trim();
  const rawStatus = getSingleSearchParam(searchParams.status).trim().toUpperCase();

  const status = productStatusValues.includes(rawStatus as ProductStatusValue)
    ? (rawStatus as ProductStatusValue)
    : "ALL";

  return {
    query,
    status,
    categoryId,
  };
}

export function formatProductPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function isLowStock(stock: number, lowStockThreshold: number) {
  return stock <= lowStockThreshold;
}
