// Garment types for the online catalog, grouped the way the /katalog menu
// shows them. Client-safe: no database imports.
export const CATALOG_GROUPS = [
  {
    title: "Хувцас",
    types: [
      "Цамц",
      "Ханцуйгүй цамц, хүрэм",
      "Нуруувч",
      "Даашинз",
      "Өмд",
      "Богино өмд",
      "Банзал (юбка)",
    ],
  },
  {
    title: "Дагалдах хэрэгсэл",
    types: ["Малгай", "Ороолт", "Хүзүүвч", "Бээлий"],
  },
  {
    title: "Оймс, түрий",
    types: ["Оймс", "Түрий", "Өвдөгөвч", "Улавч", "Бойтог"],
  },
];

// Order of the type tabs in Admin → Каталог.
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
