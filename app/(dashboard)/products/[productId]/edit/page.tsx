import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateProduct } from "@/features/products/actions";
import { ProductForm } from "@/features/products/components/product-form";
import {
  getCategoriesForProductForm,
  getProductById,
} from "@/features/products/queries";

type EditProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = await params;
  const [product, categories] = await Promise.all([
    getProductById(productId),
    getCategoriesForProductForm(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-full bg-zinc-50">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="space-y-2">
          <Badge variant="outline">Edit product</Badge>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {product.name}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Update pricing, category placement, stock levels, and lifecycle
              status.
            </p>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Product details</CardTitle>
            <CardDescription>
              Changes save back to the catalog and return you to the product
              list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm
              action={updateProduct}
              categories={categories}
              initialValues={product}
              submitLabel="Save changes"
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
