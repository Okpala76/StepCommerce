import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategories } from "@/features/categories/queries";
import { getProducts } from "@/features/products/queries";
import { isLowStock } from "@/features/products/types";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts({ query: "", status: "ALL", categoryId: "" }),
    getCategories(),
  ]);

  const activeProducts = products.filter(
    (product) => product.status === "ACTIVE",
  ).length;
  const lowStockCount = products.filter((product) =>
    isLowStock(product.stock, product.lowStockThreshold),
  ).length;

  return (
    <main className="min-h-full bg-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <Badge variant="outline">CommerceOps admin</Badge>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Manage the catalog with a clear, product-first admin
                  experience.
                </h1>
                <p className="text-base text-muted-foreground sm:text-lg">
                  Review products, organize categories, monitor low-stock items,
                  and keep merchandising decisions moving without friction.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Open products
              </Link>
              <Link
                href="/categories"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                )}
              >
                Manage categories
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Live catalog inventory and status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{products.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active</CardTitle>
              <CardDescription>
                Products currently available in the catalog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeProducts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Low stock</CardTitle>
              <CardDescription>
                Products that need replenishment attention.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{lowStockCount}</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>
                Jump into the most common catalog management tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/products/new"
                className="rounded-xl border p-4 transition-colors hover:bg-zinc-50"
              >
                <p className="font-medium">Create a product</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a new SKU, pricing, and stock settings.
                </p>
              </Link>
              <Link
                href="/products"
                className="rounded-xl border p-4 transition-colors hover:bg-zinc-50"
              >
                <p className="font-medium">Review products</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Filter by category, status, and stock health.
                </p>
              </Link>
              <Link
                href="/categories"
                className="rounded-xl border p-4 transition-colors hover:bg-zinc-50"
              >
                <p className="font-medium">Organize categories</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keep the storefront taxonomy clean and consistent.
                </p>
              </Link>
              <div className="rounded-xl border p-4">
                <p className="font-medium">Catalog health</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {categories.length} categories and {lowStockCount} low-stock
                  products currently need attention.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What this app covers</CardTitle>
              <CardDescription>
                The core workflows expected for this assessment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-lg border p-3">
                <p className="font-medium text-foreground">Product CRUD</p>
                <p>
                  Create, update, archive, and delete products from one flow.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium text-foreground">
                  Category management
                </p>
                <p>Group products into structured merchandising categories.</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium text-foreground">
                  Inventory awareness
                </p>
                <p>
                  Low-stock signals and catalog-level visibility are built in.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
