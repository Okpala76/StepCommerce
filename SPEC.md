Project: StepCommerce is a full-stack e-commerce admin dashboard built with Next.js App Router, TypeScript, Prisma, Supabase Postgres, shadcn/ui, Zod, and Vitest.

Goal:
Authenticated admin dashboard for managing products, categories, and inventory.

Core features:

- Sign in/sign out
- Dashboard overview
- Product CRUD
- Category CRUD
- Inventory stock adjustment
- Product search/filter
- Low-stock visibility

Architecture:

- Next.js App Router
- Server Components fetch data.
- Client Components handle interactivity.
- Server Actions handle mutations.
- Prisma logic stays in feature-level queries/actions.
- Zod validates all form inputs.
- Vitest tests schemas, utilities, and Client Components.
- Feature folders own business-specific components.
- Shared UI components stay generic.
