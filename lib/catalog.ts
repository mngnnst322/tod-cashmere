import { getDb } from "./db";
import { catalogItems } from "./db/schema";

// Garment types shown on the brand's "Онлайн каталог" page, in display order.
export const CATALOG_TYPES = [
  "Оймс",
  "Түрий",
  "Өвдөгөвч",
  "Улавч",
  "Бойтог",
  "Малгай",
  "Ороолт",
  "Хүзүүвч",
  "Бээлий",
  "Цамц",
  "Ханцуйгүй цамц, хүрэм",
  "Нуруувч",
  "Даашинз",
  "Өмд",
  "Богино өмд",
  "Банзал (юбка)",
];

/** Public read of the online catalog for /katalog. */
export async function listCatalog() {
  const db = await getDb();
  return db.select().from(catalogItems).orderBy(catalogItems.sortOrder);
}
