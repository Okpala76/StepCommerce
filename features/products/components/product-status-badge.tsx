import { Badge } from "@/components/ui/badge";

import {
  productStatusLabels,
  type ProductStatusValue,
} from "../types";

type ProductStatusBadgeProps = {
  status: ProductStatusValue;
};

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const variant =
    status === "ACTIVE"
      ? "default"
      : status === "DRAFT"
        ? "secondary"
        : "outline";

  return <Badge variant={variant}>{productStatusLabels[status]}</Badge>;
}
