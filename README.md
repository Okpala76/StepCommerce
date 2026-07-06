# StepCommerce

StepCommerce is a Next.js admin dashboard for managing an e-commerce catalog. It is designed as a product-focused assessment project that demonstrates modern frontend architecture, server-rendered pages, reusable UI, validated forms, and a clean feature-based structure.

## Features

- Product management with create, edit, archive, and delete flows
- Category management for organizing the catalog
- Search and filtering for products by name, SKU, status, and category
- Dashboard-style landing page for quick navigation
- Prisma-backed data model with seed data
- Type-safe validation with Zod
- Reusable UI components built with shadcn-style patterns

## Tech stack

- Next.js App Router
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS
- Vitest

## Prerequisites

- Node.js 20+
- npm
- A PostgreSQL database URL

## Setup

1. Clone the repository

   ```bash
   git clone <your-repo-url>
   cd StepCommerce
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Configure environment variables
   Create a `.env` file in the project root and add your database connection string:

   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
   ```

4. Generate Prisma client

   ```bash
   npx prisma generate
   ```

5. Run database migrations and seed data

   ```bash
   npx prisma db push
   npm run db:seed
   ```

6. Start the development server
   ```bash
   npm run dev
   ```

Open http://localhost:3000 to view the app.

## Available scripts

- `npm run dev` - start the local development server
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm run test:run` - run the Vitest test suite
- `npm run db:seed` - seed the database with sample catalog data

## Project structure

- `app/` - route pages and layout
- `features/` - feature-specific business logic, components, queries, and actions
- `components/ui/` - shared UI primitives
- `prisma/` - Prisma schema and seed script
- `test/` - Vitest tests

## Notes

This project is intentionally structured to be easy to explain in an assessment or interview context: the app is feature-driven, the UI is modular, and the data layer is separated from the presentation layer.
