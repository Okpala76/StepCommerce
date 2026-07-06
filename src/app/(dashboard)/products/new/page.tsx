import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createProduct } from "@/src/features/products/actions";
import { ProductForm } from "@/src/features/products/components/product-form";
import { getCategoriesForProductForm } from "@/src/features/products/queries";

export default async function NewProductPage() {
  const categories = await getCategoriesForProductForm();

  return (
    <main className="min-h-full bg-zinc-50">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-2">
          <Badge variant="outline">New product</Badge>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Create product
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Add a new catalog item with pricing, inventory settings, and a
              category assignment.
            </p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Product details</CardTitle>
            <CardDescription>
              Keep the setup concise so the merchandising team can publish
              quickly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm
              action={createProduct}
              categories={categories}
              submitLabel="Create product"
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
