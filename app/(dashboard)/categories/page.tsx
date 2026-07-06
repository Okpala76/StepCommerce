import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/features/categories/actions";
import { CategoryForm } from "@/features/categories/components/category-form";
import { CategoryTable } from "@/features/categories/components/category-table";
import { getCategories } from "@/features/categories/queries";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();
  const totalProducts = categories.reduce(
    (sum, category) => sum + category.productCount,
    0,
  );

  return (
    <main className="min-h-full bg-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Badge variant="outline">Catalog management</Badge>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Categories
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Organize the storefront catalog and keep product groupings tidy
                for merchandising.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Card size="sm" className="min-w-32">
              <CardContent className="space-y-1 py-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Categories
                </p>
                <p className="text-2xl font-semibold">{categories.length}</p>
              </CardContent>
            </Card>
            <Card size="sm" className="min-w-32">
              <CardContent className="space-y-1 py-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Products
                </p>
                <p className="text-2xl font-semibold">{totalProducts}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Create category</CardTitle>
              <CardDescription>
                Add a new category with a clean storefront-ready slug.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryForm
                action={createCategoryAction}
                submitLabel="Create category"
                helperText="New categories appear in the table immediately after save."
              />
            </CardContent>
          </Card>

          <CategoryTable
            categories={categories}
            updateAction={updateCategoryAction}
            deleteAction={deleteCategoryAction}
          />
        </section>
      </div>
    </main>
  );
}
