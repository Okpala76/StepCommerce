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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import {
  formatProductPrice,
  isLowStock,
  type ProductListItem,
} from "../types";
import { ProductStatusBadge } from "./product-status-badge";

type ProductMutationAction = (formData: FormData) => Promise<void>;

type ProductTableProps = {
  products: ProductListItem[];
  archiveAction: ProductMutationAction;
  deleteAction: ProductMutationAction;
};

export function ProductTable({
  products,
  archiveAction,
  deleteAction,
}: ProductTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product catalog</CardTitle>
        <CardDescription>
          Review pricing, stock levels, category assignments, and lifecycle
          status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No products match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const lowStock = isLowStock(
                  product.stock,
                  product.lowStockThreshold,
                );

                return (
                  <TableRow key={product.id}>
                    <TableCell className="max-w-80 whitespace-normal">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {product.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>{product.sku}</span>
                          {product.description ? (
                            <>
                              <span aria-hidden="true">•</span>
                              <span className="line-clamp-1">
                                {product.description}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell>{formatProductPrice(product.price)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span>{product.stock}</span>
                        {lowStock ? (
                          <Badge variant="destructive">
                            Low stock at {product.lowStockThreshold}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Threshold {product.lowStockThreshold}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ProductStatusBadge status={product.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                          )}
                        >
                          Edit
                        </Link>

                        {product.status === "ARCHIVED" ? (
                          <form action={deleteAction}>
                            <input type="hidden" name="id" value={product.id} />
                            <button
                              type="submit"
                              className={cn(
                                buttonVariants({
                                  variant: "ghost",
                                  size: "sm",
                                }),
                              )}
                            >
                              Delete
                            </button>
                          </form>
                        ) : (
                          <form action={archiveAction}>
                            <input type="hidden" name="id" value={product.id} />
                            <button
                              type="submit"
                              className={cn(
                                buttonVariants({
                                  variant: "ghost",
                                  size: "sm",
                                }),
                              )}
                            >
                              Archive
                            </button>
                          </form>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
