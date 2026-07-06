"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  initialCategoryActionState,
  type CategoryActionState,
} from "../schema";

type CategoryFormProps = {
  action: (
    state: CategoryActionState,
    formData: FormData,
  ) => Promise<CategoryActionState>;
  submitLabel: string;
  helperText?: string;
  initialValues?: {
    id?: string;
    name?: string;
    description?: string | null;
  };
};

export function CategoryForm({
  action,
  submitLabel,
  helperText,
  initialValues,
}: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialCategoryActionState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {initialValues?.id ? (
        <input type="hidden" name="id" value={initialValues.id} />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="category-name">Name</Label>
        <Input
          id="category-name"
          name="name"
          defaultValue={initialValues?.name ?? ""}
          placeholder="Electronics"
          aria-invalid={Boolean(state.fieldErrors?.name?.length)}
        />
        {state.fieldErrors?.name?.length ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.name[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-description">Description</Label>
        <Textarea
          id="category-description"
          name="description"
          defaultValue={initialValues?.description ?? ""}
          placeholder="Category description"
          aria-invalid={Boolean(state.fieldErrors?.description?.length)}
        />
        {state.fieldErrors?.description?.length ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.description[0]}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}
      {helperText ? (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
