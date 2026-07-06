import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { archiveProduct, deleteProduct } from "@/features/products/actions";
import { ProductFilters } from "@/features/products/components/product-filters";
import { ProductTable } from "@/features/products/components/product-table";
import {
  getCategoriesForProductForm,
  getProducts,
} from "@/features/products/queries";
import { isLowStock, normalizeProductFilters } from "@/features/products/types";
import { cn } from "@/lib/utils";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const filters = normalizeProductFilters(await searchParams);
  const [products, categories] = await Promise.all([
    getProducts(filters),
    getCategoriesForProductForm(),
  ]);

  const lowStockCount = products.filter((product) =>
    isLowStock(product.stock, product.lowStockThreshold),
  ).length;

  return (
    <main className="min-h-full bg-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              ← Back
            </Link>
            <Badge variant="outline">Catalog management</Badge>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Products
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Manage the storefront assortment, keep pricing current, and flag
                products that need replenishment.
              </p>
            </div>
          </div>
          <Link
            href="/products/new"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Add product
          </Link>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <Card size="sm">
            <CardContent className="space-y-1 py-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Results
              </p>
              <p className="text-2xl font-semibold">{products.length}</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Low stock
              </p>
              <p className="text-2xl font-semibold">{lowStockCount}</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="space-y-1 py-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Categories
              </p>
              <p className="text-2xl font-semibold">{categories.length}</p>
            </CardContent>
          </Card>
        </section>

        <ProductFilters
          key={`${filters.query}:${filters.status}:${filters.categoryId}`}
          categories={categories}
          filters={filters}
        />

        <ProductTable
          products={products}
          archiveAction={archiveProduct}
          deleteAction={deleteProduct}
        />
      </div>
    </main>
  );
}
