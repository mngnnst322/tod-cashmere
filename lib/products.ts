import { and, eq } from "drizzle-orm";
import { getDb } from "./db";
import { categories, products } from "./db/schema";
import { getPricing } from "./pricing";
import { regionalPrice } from "./money";

export async function listCategories() {
  const db = await getDb();
  return db.select().from(categories).orderBy(categories.sortOrder);
}

type ProductRow = typeof products.$inferSelect;

/**
 * Swaps in the visitor's regional tugrik price (and scales the crossed-out
 * price with it), so everything downstream (cards, cart, orders) uses it.
 */
async function withRegionalPrice<T extends ProductRow | undefined>(product: T): Promise<T> {
  if (!product) return product;
  const { region } = await getPricing();
  const price = regionalPrice(product, region);
  if (price === product.price) return product;
  const compareAtPrice =
    product.compareAtPrice != null
      ? Math.round((product.compareAtPrice * price) / product.price)
      : null;
  return { ...product, price, compareAtPrice };
}

/** Storefront catalogue: everything the admin hasn't hidden, at regional prices. */
export async function listProducts() {
  const db = await getDb();
  const rows = await db.select().from(products).where(eq(products.hidden, false));
  return Promise.all(rows.map(withRegionalPrice));
}

/** Admin view: every product, hidden ones included. */
export async function listAllProducts() {
  const db = await getDb();
  return db.select().from(products).orderBy(products.categorySlug, products.createdAt);
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  return withRegionalPrice(
    await db.query.products.findFirst({
      where: and(eq(products.slug, slug), eq(products.hidden, false)),
    }),
  );
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
