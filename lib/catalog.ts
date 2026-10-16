import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { catalogItems, catalogTypes } from "./db/schema";

export { CATALOG_GENDERS, isCatalogGender, type CatalogGender } from "./catalog-types";

/** Public read of the online catalog for /catalog. */
export async function listCatalog() {
  const db = await getDb();
  return db.select().from(catalogItems).orderBy(catalogItems.sortOrder);
}

/** Garment types of both genders, in menu order. */
export async function listCatalogTypes() {
  const db = await getDb();
  return db.select().from(catalogTypes).orderBy(catalogTypes.sortOrder);
}

export async function getCatalogItem(id: string) {
  const db = await getDb();
  return db.query.catalogItems.findFirst({ where: eq(catalogItems.id, id) });
}

/** An item's photos, cover first; older items only have the cover. */
export function itemImages(item: { image: string | null; images: string }) {
  let list: string[] = [];
  try {
    list = JSON.parse(item.images);
  } catch {
    // treat as empty
  }
  const all = item.image && !list.includes(item.image) ? [item.image, ...list] : list;
  return item.image ? [item.image, ...all.filter((i) => i !== item.image)] : all;
}
