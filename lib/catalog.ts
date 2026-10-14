import { getDb } from "./db";
import { catalogItems } from "./db/schema";

export {
  CATALOG_GENDERS,
  CATALOG_MENU_TYPES,
  CATALOG_TYPES,
  catalogGenderLabel,
  isCatalogGender,
} from "./catalog-types";

/** Public read of the online catalog for /katalog. */
export async function listCatalog() {
  const db = await getDb();
  return db.select().from(catalogItems).orderBy(catalogItems.sortOrder);
}
