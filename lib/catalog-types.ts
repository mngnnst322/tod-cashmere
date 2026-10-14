// Garment types for the online catalog. Client-safe: no database imports.

// What each gender's dropdown in the /katalog menu lists, in order.
export const CATALOG_MENU_TYPES = {
  women: [
    "Джемпер",
    "Свитер",
    "Пуловер",
    "Кардиган",
    "Цамц",
    "Майк",
    "Жилет",
    "Платье",
    "Өмд",
    "Шорт",
    "Юбка",
  ],
  men: ["Цамц", "Джемпер", "Свитер", "Кардиган", "Бомбер", "Поло", "Майк", "Өмд"],
};

// Every type, in the order of the tabs in Admin → Каталог.
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
  "Джемпер",
  "Свитер",
  "Пуловер",
  "Кардиган",
  "Майк",
  "Жилет",
  "Платье",
  "Шорт",
  "Юбка",
  "Бомбер",
  "Поло",
];

export const CATALOG_GENDERS = [
  { key: "women", label: "Эмэгтэй" },
  { key: "men", label: "Эрэгтэй" },
  { key: "unisex", label: "Хоёуланд" },
] as const;

export type CatalogGender = (typeof CATALOG_GENDERS)[number]["key"];

export const isCatalogGender = (v: unknown): v is CatalogGender =>
  CATALOG_GENDERS.some((g) => g.key === v);

export const catalogGenderLabel = (key: string) =>
  CATALOG_GENDERS.find((g) => g.key === key)?.label ?? "";
