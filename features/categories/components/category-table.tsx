"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { CategoryListItem } from "../queries";
import type { CategoryActionState } from "../schema";
import { CategoryForm } from "./category-form";

type CategoryFormAction = (
  state: CategoryActionState,
  formData: FormData,
) => Promise<CategoryActionState>;

type DeleteCategoryAction = (formData: FormData) => Promise<void>;

type CategoryTableProps = {
  categories: CategoryListItem[];
  updateAction: CategoryFormAction;
  deleteAction: DeleteCategoryAction;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function EditCategoryDialog({
  category,
  updateAction,
}: {
  category: CategoryListItem;
  updateAction: CategoryFormAction;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Edit
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>
            Update the category details used across the catalog.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          action={updateAction}
          initialValues={category}
          submitLabel="Save changes"
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function CategoryTable({
  categories,
  updateAction,
  deleteAction,
}: CategoryTableProps) {
  const totalProducts = useMemo(
    () => categories.reduce((sum, category) => sum + category.productCount, 0),
    [categories],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category catalog</CardTitle>
        <CardDescription>
          {categories.length} categories across {totalProducts} products.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No categories yet. Create your first category to organize the
                  catalog.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="max-w-72 whitespace-normal">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.description || "No description added yet."}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.slug}</Badge>
                  </TableCell>
                  <TableCell>{category.productCount}</TableCell>
                  <TableCell>{formatDate(category.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditCategoryDialog
                        category={category}
                        updateAction={updateAction}
                      />

                      {category.productCount === 0 ? (
                        <form action={deleteAction}>
                          <input type="hidden" name="id" value={category.id} />
                          <input
                            type="hidden"
                            name="productCount"
                            value={category.productCount}
                          />
                          <Button type="submit" variant="ghost" size="sm">
                            Delete
                          </Button>
                        </form>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          Remove products first
                        </Button>
                      )}
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
