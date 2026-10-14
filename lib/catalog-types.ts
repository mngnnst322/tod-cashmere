// Client-safe catalog constants: no database imports. The garment types
// themselves live in the catalog_types table (Admin → Каталог).
export const CATALOG_GENDERS = [
  { key: "women", label: "Эмэгтэй" },
  { key: "men", label: "Эрэгтэй" },
] as const;

export type CatalogGender = (typeof CATALOG_GENDERS)[number]["key"];

export const isCatalogGender = (v: unknown): v is CatalogGender =>
  CATALOG_GENDERS.some((g) => g.key === v);
