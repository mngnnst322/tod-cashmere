import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { categories, products } from "./db/schema";

export async function listCategories() {
  const db = await getDb();
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function listProducts() {
  const db = await getDb();
  return db.select().from(products);
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  return db.query.products.findFirst({ where: eq(products.slug, slug) });
}

export async function getFeaturedProducts() {
  const db = await getDb();
  const all = await db.select().from(products);
  return all.filter((p) => p.badge !== "Хямдрал").slice(0, 5);
}

export async function getSaleProducts() {
  const db = await getDb();
  const all = await db.select().from(products);
  return all.filter((p) => p.compareAtPrice != null);
}

export async function getArrivalProducts() {
  const db = await getDb();
  const all = await db.select().from(products);
  return all.filter((p) => p.collection === "arrival");
}

export async function getRelatedProducts(excludeSlug: string, limit = 4) {
  const db = await getDb();
  const all = await db.select().from(products);
  return all.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export function formatPrice(amount: number) {
  return `${amount.toLocaleString("mn-MN")}₮`;
}

export function discountPercent(price: number, compareAtPrice: number) {
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
