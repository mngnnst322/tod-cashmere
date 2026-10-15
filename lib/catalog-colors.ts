import type { Lang } from "./i18n";

type CashmereColor = { name: string; hex: string; names: Record<Lang, string> };

// The natural cashmere colours the admin ticks for catalog items. Items store
// the English `name`s, comma-separated, e.g. "White, Beige, Brown".
export const CASHMERE_COLORS: CashmereColor[] = [
  { name: "White", hex: "#f7f4ee", names: { mn: "Цагаан", en: "White", ru: "Белый", zh: "白色" } },
  {
    name: "Beige",
    hex: "#d6c3a3",
    names: { mn: "Цайвар бор / шаргал", en: "Beige / Fawn", ru: "Бежевый", zh: "米色" },
  },
  {
    name: "Light Grey",
    hex: "#c4c2bd",
    names: { mn: "Цайвар саарал", en: "Light Grey", ru: "Светло-серый", zh: "浅灰色" },
  },
  { name: "Brown", hex: "#6b4f3c", names: { mn: "Бор", en: "Brown", ru: "Коричневый", zh: "棕色" } },
  {
    name: "Charcoal",
    hex: "#3b3633",
    names: {
      mn: "Бараан саарал / хар бор",
      en: "Charcoal / Dark Brown",
      ru: "Графитовый / тёмно-коричневый",
      zh: "炭灰 / 深棕",
    },
  },
];

// Colours already on items from the printed catalog: not offered in the
// picker, but still translated and shown with a swatch.
const EARLIER_COLORS: CashmereColor[] = [
  { name: "Ivory", hex: "#f4efe3", names: { mn: "Цайвар цагаан", en: "Ivory", ru: "Слоновая кость", zh: "象牙白" } },
  { name: "Oatmeal", hex: "#cdbfa8", names: { mn: "Цайвар бор", en: "Oatmeal", ru: "Овсяный", zh: "燕麦色" } },
  { name: "Camel", hex: "#b88a5a", names: { mn: "Тэмээн шаргал", en: "Camel", ru: "Кэмел", zh: "驼色" } },
  { name: "Grey", hex: "#a3a19e", names: { mn: "Саарал", en: "Grey", ru: "Серый", zh: "灰色" } },
  { name: "Black", hex: "#1c1c1c", names: { mn: "Хар", en: "Black", ru: "Чёрный", zh: "黑色" } },
];

const ALIASES: Record<string, string> = {
  gray: "Grey",
  "light gray": "Light Grey",
  fawn: "Beige",
  "beige / fawn": "Beige",
  "dark brown": "Charcoal",
  "charcoal / dark brown": "Charcoal",
};

export function findCashmereColor(name: string) {
  const key = name.trim().toLowerCase();
  const target = (ALIASES[key] ?? key).toLowerCase();
  return [...CASHMERE_COLORS, ...EARLIER_COLORS].find((c) => c.name.toLowerCase() === target);
}

/** Splits a stored "Camel, Ivory" list. */
export const splitColors = (list: string) =>
  list
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
