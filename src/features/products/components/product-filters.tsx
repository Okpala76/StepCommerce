"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  productStatusLabels,
  productStatusValues,
  type ProductCategoryOption,
  type ProductFilters,
  type ProductFilterStatus,
} from "../types";

type ProductFiltersProps = {
  categories: ProductCategoryOption[];
  filters: ProductFilters;
};

export function ProductFilters({
  categories,
  filters,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(filters.query);
  const [status, setStatus] = useState<ProductFilterStatus>(filters.status);
  const [categoryId, setCategoryId] = useState(filters.categoryId);

  function applyFilters(next: {
    query: string;
    status: ProductFilterStatus;
    categoryId: string;
  }) {
    const params = new URLSearchParams();

    if (next.query.trim()) {
      params.set("query", next.query.trim());
    }

    if (next.status !== "ALL") {
      params.set("status", next.status);
    }

    if (next.categoryId) {
      params.set("categoryId", next.categoryId);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <form
      className="grid gap-4 rounded-xl border bg-white p-4 shadow-xs md:grid-cols-[minmax(0,1fr)_12rem_14rem_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(() => {
          applyFilters({ query, status, categoryId });
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="product-query">Search</Label>
        <Input
          id="product-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or SKU"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-status-filter">Status</Label>
        <Select
          value={status}
          onValueChange={(value) =>
            setStatus(((value ?? "ALL") as ProductFilterStatus) || "ALL")
          }
        >
          <SelectTrigger id="product-status-filter" className="w-full">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {productStatusValues.map((productStatus) => (
              <SelectItem key={productStatus} value={productStatus}>
                {productStatusLabels[productStatus]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-category-filter">Category</Label>
        <Select
          value={categoryId || "__all"}
          onValueChange={(value) =>
            setCategoryId(value && value !== "__all" ? value : "")
          }
        >
          <SelectTrigger id="product-category-filter" className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Applying..." : "Apply"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            startTransition(() => {
              setQuery("");
              setStatus("ALL");
              setCategoryId("");
              applyFilters({ query: "", status: "ALL", categoryId: "" });
            });
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
