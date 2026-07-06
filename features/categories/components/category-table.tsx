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

import type { CategoryListItem } from "../queries";
import type { CategoryActionState } from "../schema";
import { CategoryForm } from "./category-form";

type CategoryTableProps = {
  categories: CategoryListItem[];
  updateAction: (
    state: CategoryActionState,
    formData: FormData,
  ) => Promise<CategoryActionState>;
  deleteAction: (formData: FormData) => Promise<void>;
};

export function CategoryTable({
  categories,
  updateAction,
  deleteAction,
}: CategoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>
          Keep merchandising groupings organized and easy to update.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-8 text-center text-muted-foreground"
                >
                  No categories yet.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.description ?? "No description provided."}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.productCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <details className="group">
                        <summary
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                          )}
                        >
                          Edit
                        </summary>
                        <div className="absolute z-10 mt-2 w-80 rounded-lg border bg-background p-4 shadow-lg">
                          <CategoryForm
                            action={updateAction}
                            submitLabel="Save category"
                            initialValues={category}
                          />
                        </div>
                      </details>
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={category.id} />
                        <button
                          type="submit"
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                          )}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
