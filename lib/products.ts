import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { categories, products } from "./db/schema";

export async function listCategories() {
  const db = await getDb();
  return db.select().from(categories).orderBy(categories.sortOrder);
}

/** Storefront catalogue: everything the admin hasn't hidden. */
export async function listProducts() {
  const db = await getDb();
  return db.select().from(products).where(eq(products.hidden, false));
}

/** Admin view: every product, hidden ones included. */
export async function listAllProducts() {
  const db = await getDb();
  return db.select().from(products).orderBy(products.categorySlug, products.createdAt);
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  return db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.hidden, false)),
  });
}

export async function getFeaturedProducts() {
  const all = await listProducts();
  return all.filter((p) => p.badge !== "Хямдрал").slice(0, 4);
}

export async function getSaleProducts() {
  const all = await listProducts();
  return all.filter((p) => p.compareAtPrice != null);
}

export async function getArrivalProducts() {
  const all = await listProducts();
  return all.filter((p) => p.collection === "arrival");
}

export async function getRelatedProducts(excludeSlug: string, limit = 4) {
  const all = await listProducts();
  return all.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export { formatPrice, discountPercent, isSoldOut } from "./format";
