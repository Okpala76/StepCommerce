import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  InventoryMovementType,
  InventoryReason,
  PrismaClient,
  ProductStatus,
} from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the Prisma seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Connected devices, accessories, and everyday tech essentials.",
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Practical home upgrades and kitchen appliances for daily use.",
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Apparel and accessories for casual, work, and travel needs.",
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description: "Skincare and personal care products with repeat-purchase potential.",
  },
] as const;

const products = [
  {
    name: "Wireless Earbuds Pro",
    slug: "wireless-earbuds-pro",
    description: "Noise-canceling Bluetooth earbuds with wireless charging case.",
    sku: "ELEC-1001",
    price: "129.99",
    status: ProductStatus.ACTIVE,
    stockQuantity: 7,
    lowStockThreshold: 10,
    categorySlug: "electronics",
  },
  {
    name: "USB-C GaN Fast Charger",
    slug: "usb-c-gan-fast-charger",
    description: "Compact 65W wall charger for phones, tablets, and lightweight laptops.",
    sku: "ELEC-1002",
    price: "39.99",
    status: ProductStatus.ACTIVE,
    stockQuantity: 32,
    lowStockThreshold: 8,
    categorySlug: "electronics",
  },
  {
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    description: "GPS fitness watch with heart-rate tracking and sleep insights.",
    sku: "ELEC-1003",
    price: "219.00",
    status: ProductStatus.DRAFT,
    stockQuantity: 0,
    lowStockThreshold: 5,
    categorySlug: "electronics",
  },
  {
    name: "Espresso Machine",
    slug: "espresso-machine",
    description: "Countertop espresso machine with milk frother and programmable shot sizes.",
    sku: "HOME-2001",
    price: "349.00",
    status: ProductStatus.ACTIVE,
    stockQuantity: 3,
    lowStockThreshold: 5,
    categorySlug: "home-kitchen",
  },
  {
    name: "Non-Stick Cookware Set",
    slug: "non-stick-cookware-set",
    description: "Ten-piece induction-compatible cookware set for everyday cooking.",
    sku: "HOME-2002",
    price: "159.50",
    status: ProductStatus.ACTIVE,
    stockQuantity: 14,
    lowStockThreshold: 6,
    categorySlug: "home-kitchen",
  },
  {
    name: "Portable Blender Bottle",
    slug: "portable-blender-bottle",
    description: "USB-rechargeable personal blender for smoothies and shakes.",
    sku: "HOME-2003",
    price: "49.95",
    status: ProductStatus.ARCHIVED,
    stockQuantity: 4,
    lowStockThreshold: 4,
    categorySlug: "home-kitchen",
  },
  {
    name: "Running Sneakers",
    slug: "running-sneakers",
    description: "Lightweight running shoes with breathable mesh upper and cushioned sole.",
    sku: "FASH-3001",
    price: "89.99",
    status: ProductStatus.ACTIVE,
    stockQuantity: 11,
    lowStockThreshold: 8,
    categorySlug: "fashion",
  },
  {
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    description: "Structured everyday bag with adjustable strap and zip closure.",
    sku: "FASH-3002",
    price: "119.00",
    status: ProductStatus.ACTIVE,
    stockQuantity: 2,
    lowStockThreshold: 4,
    categorySlug: "fashion",
  },
  {
    name: "Linen Duvet Cover Set",
    slug: "linen-duvet-cover-set",
    description: "Stone-washed linen bedding set designed for year-round comfort.",
    sku: "FASH-3003",
    price: "139.00",
    status: ProductStatus.DRAFT,
    stockQuantity: 9,
    lowStockThreshold: 5,
    categorySlug: "fashion",
  },
  {
    name: "Vitamin C Brightening Serum",
    slug: "vitamin-c-brightening-serum",
    description: "Daily antioxidant serum formulated to improve brightness and texture.",
    sku: "BEAU-4001",
    price: "27.50",
    status: ProductStatus.ACTIVE,
    stockQuantity: 22,
    lowStockThreshold: 10,
    categorySlug: "beauty-personal-care",
  },
  {
    name: "Mineral Sunscreen SPF 50",
    slug: "mineral-sunscreen-spf-50",
    description: "Lightweight broad-spectrum sunscreen suitable for sensitive skin.",
    sku: "BEAU-4002",
    price: "19.99",
    status: ProductStatus.ACTIVE,
    stockQuantity: 6,
    lowStockThreshold: 8,
    categorySlug: "beauty-personal-care",
  },
  {
    name: "Hydrating Shampoo Bar",
    slug: "hydrating-shampoo-bar",
    description: "Travel-friendly shampoo bar with shea butter and coconut oil.",
    sku: "BEAU-4003",
    price: "14.00",
    status: ProductStatus.ARCHIVED,
    stockQuantity: 0,
    lowStockThreshold: 3,
    categorySlug: "beauty-personal-care",
  },
] as const;

const inventoryMovements = [
  {
    productSlug: "wireless-earbuds-pro",
    type: InventoryMovementType.INCREASE,
    reason: InventoryReason.RESTOCK,
    quantity: 20,
    note: "Received weekly supplier shipment for best-selling audio accessories.",
    withUser: true,
  },
  {
    productSlug: "wireless-earbuds-pro",
    type: InventoryMovementType.DECREASE,
    reason: InventoryReason.SALE,
    quantity: 13,
    note: "Weekend campaign orders reconciled from storefront sales.",
    withUser: false,
  },
  {
    productSlug: "espresso-machine",
    type: InventoryMovementType.INCREASE,
    reason: InventoryReason.RESTOCK,
    quantity: 6,
    note: "Small-batch appliance replenishment from vendor.",
    withUser: true,
  },
  {
    productSlug: "espresso-machine",
    type: InventoryMovementType.DECREASE,
    reason: InventoryReason.DAMAGE,
    quantity: 1,
    note: "One unit marked damaged after warehouse inspection.",
    withUser: true,
  },
  {
    productSlug: "running-sneakers",
    type: InventoryMovementType.DECREASE,
    reason: InventoryReason.SALE,
    quantity: 4,
    note: "Popular size run sold through during flash promotion.",
    withUser: false,
  },
  {
    productSlug: "leather-crossbody-bag",
    type: InventoryMovementType.DECREASE,
    reason: InventoryReason.SALE,
    quantity: 2,
    note: "Last two units sold after influencer referral traffic spike.",
    withUser: false,
  },
  {
    productSlug: "portable-blender-bottle",
    type: InventoryMovementType.DECREASE,
    reason: InventoryReason.CORRECTION,
    quantity: 1,
    note: "Inventory adjusted after cycle count discrepancy.",
    withUser: true,
  },
  {
    productSlug: "mineral-sunscreen-spf-50",
    type: InventoryMovementType.INCREASE,
    reason: InventoryReason.RETURN,
    quantity: 2,
    note: "Two sealed units returned to sellable stock.",
    withUser: true,
  },
] as const;

async function main() {
  await prisma.inventoryMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@stepcommerce.local",
      name: "StepCommerce Admin",
      passwordHash: "$2b$10$seededadminaccountplaceholderhashforlocaldev123456",
    },
  });

  await prisma.category.createMany({
    data: categories.map((category) => ({
      name: category.name,
      slug: category.slug,
      description: category.description,
    })),
  });

  const categoryRecords = await prisma.category.findMany();
  const categoryIdBySlug = new Map(categoryRecords.map((category) => [category.slug, category.id]));

  await prisma.product.createMany({
    data: products.map((product) => ({
      name: product.name,
      slug: product.slug,
      description: product.description,
      sku: product.sku,
      price: product.price,
      status: product.status,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
      categoryId: categoryIdBySlug.get(product.categorySlug)!,
    })),
  });

  const productRecords = await prisma.product.findMany();
  const productIdBySlug = new Map(productRecords.map((product) => [product.slug, product.id]));

  await prisma.inventoryMovement.createMany({
    data: inventoryMovements.map((movement) => ({
      productId: productIdBySlug.get(movement.productSlug)!,
      userId: movement.withUser ? adminUser.id : null,
      type: movement.type,
      reason: movement.reason,
      quantity: movement.quantity,
      note: movement.note,
    })),
  });

  console.log("Seeded StepCommerce with 4 categories, 12 products, and 8 inventory movements.");
}

main()
  .catch((error) => {
    console.error("Seeding failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
