"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  initialProductActionState,
  type ProductActionState,
} from "../schema";
import {
  productStatusLabels,
  productStatusValues,
  type ProductCategoryOption,
  type ProductFormValues,
} from "../types";

type ProductFormAction = (
  state: ProductActionState,
  formData: FormData,
) => Promise<ProductActionState>;

type ProductFormProps = {
  action: ProductFormAction;
  categories: ProductCategoryOption[];
  initialValues?: ProductFormValues;
  submitLabel: string;
  cancelHref?: string;
};

export function ProductForm({
  action,
  categories,
  initialValues,
  submitLabel,
  cancelHref = "/products",
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialProductActionState,
  );
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? "");
  const [status, setStatus] = useState(initialValues?.status ?? "DRAFT");

  const hasCategories = useMemo(() => categories.length > 0, [categories.length]);

  return (
    <form action={formAction} className="space-y-6">
      {initialValues?.id ? (
        <input type="hidden" name="id" value={initialValues.id} />
      ) : null}
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="status" value={status} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="product-name">Name</Label>
          <Input
            id="product-name"
            name="name"
            placeholder="Wireless Earbuds Pro"
            defaultValue={initialValues?.name ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.name?.length)}
          />
          {state.fieldErrors?.name?.length ? (
            <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-sku">SKU</Label>
          <Input
            id="product-sku"
            name="sku"
            placeholder="ELEC-1001"
            defaultValue={initialValues?.sku ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.sku?.length)}
          />
          {state.fieldErrors?.sku?.length ? (
            <p className="text-sm text-destructive">{state.fieldErrors.sku[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-price">Price</Label>
          <Input
            id="product-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="129.99"
            defaultValue={initialValues?.price ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.price?.length)}
          />
          {state.fieldErrors?.price?.length ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.price[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-stock">Stock</Label>
          <Input
            id="product-stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="24"
            defaultValue={initialValues?.stock ?? 0}
            aria-invalid={Boolean(state.fieldErrors?.stock?.length)}
          />
          {state.fieldErrors?.stock?.length ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.stock[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-low-stock-threshold">Low stock threshold</Label>
          <Input
            id="product-low-stock-threshold"
            name="lowStockThreshold"
            type="number"
            min="0"
            step="1"
            placeholder="5"
            defaultValue={initialValues?.lowStockThreshold ?? 5}
            aria-invalid={Boolean(state.fieldErrors?.lowStockThreshold?.length)}
          />
          {state.fieldErrors?.lowStockThreshold?.length ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.lowStockThreshold[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-category">Category</Label>
        <Select
          value={categoryId || "__empty"}
          onValueChange={(value) =>
            setCategoryId(value && value !== "__empty" ? value : "")
          }
        >
            <SelectTrigger
              id="product-category"
              className="w-full"
              aria-invalid={Boolean(state.fieldErrors?.categoryId?.length)}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {hasCategories ? (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="__empty" disabled>
                  No categories available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {state.fieldErrors?.categoryId?.length ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.categoryId[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-status">Status</Label>
        <Select
          value={status}
          onValueChange={(value) =>
            setStatus(((value ?? "DRAFT") as typeof status) || "DRAFT")
          }
        >
            <SelectTrigger
              id="product-status"
              className="w-full"
              aria-invalid={Boolean(state.fieldErrors?.status?.length)}
            >
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {productStatusValues.map((productStatus) => (
                <SelectItem key={productStatus} value={productStatus}>
                  {productStatusLabels[productStatus]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.fieldErrors?.status?.length ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.status[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="product-description">Description</Label>
          <Textarea
            id="product-description"
            name="description"
            placeholder="Short merchandising notes, key features, or selling points."
            defaultValue={initialValues?.description ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.description?.length)}
          />
          {state.fieldErrors?.description?.length ? (
            <p className="text-sm text-destructive">
              {state.fieldErrors.description[0]}
            </p>
          ) : null}
        </div>
      </div>

      {state.message ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending || !hasCategories}>
          {pending ? "Saving..." : submitLabel}
        </Button>
        <Link
          href={cancelHref}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Cancel
        </Link>
        {!hasCategories ? (
          <p className="text-sm text-muted-foreground">
            Create a category first before adding products.
          </p>
        ) : null}
      </div>
    </form>
  );
}
