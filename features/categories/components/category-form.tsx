"use client";

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  initialCategoryActionState,
  type CategoryActionState,
} from "../schema";

type CategoryFormAction = (
  state: CategoryActionState,
  formData: FormData,
) => Promise<CategoryActionState>;

type CategoryFormValues = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
};

type CategoryFormProps = {
  action: CategoryFormAction;
  initialValues?: CategoryFormValues;
  submitLabel: string;
  helperText?: string;
  onSuccess?: () => void;
};

export function CategoryForm({
  action,
  initialValues,
  submitLabel,
  helperText,
  onSuccess,
}: CategoryFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    action,
    initialCategoryActionState,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    if (!initialValues?.id) {
      formRef.current?.reset();
    }

    onSuccess?.();
  }, [initialValues?.id, onSuccess, state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {initialValues?.id ? (
        <input type="hidden" name="id" value={initialValues.id} />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor={initialValues?.id ? `name-${initialValues.id}` : "name"}>
          Name
        </Label>
        <Input
          id={initialValues?.id ? `name-${initialValues.id}` : "name"}
          name="name"
          placeholder="Accessories"
          defaultValue={initialValues?.name ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.name?.length)}
        />
        {state.fieldErrors?.name?.length ? (
          <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={initialValues?.id ? `slug-${initialValues.id}` : "slug"}>
          Slug
        </Label>
        <Input
          id={initialValues?.id ? `slug-${initialValues.id}` : "slug"}
          name="slug"
          placeholder="accessories"
          defaultValue={initialValues?.slug ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.slug?.length)}
        />
        <p className="text-xs text-muted-foreground">
          Use lowercase letters, numbers, and hyphens.
        </p>
        {state.fieldErrors?.slug?.length ? (
          <p className="text-sm text-destructive">{state.fieldErrors.slug[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={
            initialValues?.id ? `description-${initialValues.id}` : "description"
          }
        >
          Description
        </Label>
        <Textarea
          id={
            initialValues?.id ? `description-${initialValues.id}` : "description"
          }
          name="description"
          placeholder="Short internal summary for the merchandising team."
          defaultValue={initialValues?.description ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.description?.length)}
        />
        {state.fieldErrors?.description?.length ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.description[0]}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p
          className={
            state.status === "success"
              ? "text-sm text-emerald-600"
              : "text-sm text-destructive"
          }
        >
          {state.message}
        </p>
      ) : helperText ? (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
