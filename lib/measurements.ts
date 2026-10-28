import type { Lang } from "./i18n";

// Garment measurements for catalog items, in this display order.
export const MEASUREMENTS = [
  { key: "shoulder", unit: "см", names: { mn: "Мөр", en: "Shoulder", ru: "Плечи", zh: "肩宽" } },
  { key: "sleeve", unit: "см", names: { mn: "Гар", en: "Sleeve", ru: "Рукав", zh: "袖长" } },
  { key: "back", unit: "см", names: { mn: "Нуруу", en: "Back length", ru: "Длина спинки", zh: "后背长" } },
  { key: "waist", unit: "см", names: { mn: "Бэлхүүс", en: "Waist", ru: "Талия", zh: "腰围" } },
  { key: "cuff", unit: "см", names: { mn: "Бугуй", en: "Cuff", ru: "Манжета", zh: "袖口" } },
  { key: "weight", unit: "г", names: { mn: "Жин", en: "Weight", ru: "Вес", zh: "重量" } },
] as const;

export type MeasurementKey = (typeof MEASUREMENTS)[number]["key"];

const UNIT: Record<Lang, { cm: string; g: string }> = {
  mn: { cm: "см", g: "г" },
  en: { cm: "cm", g: "g" },
  ru: { cm: "см", g: "г" },
  zh: { cm: "厘米", g: "克" },
};

export function parseMeasurements(raw: string | null | undefined): Partial<Record<MeasurementKey, number>> {
  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

/** Filled-in measurements as label / value rows in the visitor's language. */
export function measurementRows(raw: string | null | undefined, lang: Lang) {
  const m = parseMeasurements(raw);
  return MEASUREMENTS.filter((d) => Number(m[d.key]) > 0).map((d) => ({
    label: d.names[lang],
    value: `${m[d.key]} ${d.key === "weight" ? UNIT[lang].g : UNIT[lang].cm}`,
  }));
}
