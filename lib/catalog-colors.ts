import type { Lang } from "./i18n";

type CashmereColor = { name: string; hex: string; names: Record<Lang, string> };

// The natural cashmere colours the admin ticks for catalog items. Items store
// the English `name`s, comma-separated, e.g. "White, Beige, Brown".
export const CASHMERE_COLORS: CashmereColor[] = [
  {
    name: "White",
    hex: "#F4F1EA",
    names: {
      mn: "Цагаан",
      en: "White / Ivory",
      ru: "Белый / слоновая кость",
      zh: "白色 / 象牙白",
    },
  },
  {
    name: "Beige",
    hex: "#CDB89A",
    names: {
      mn: "Цайвар бор / шаргал",
      en: "Beige / Fawn",
      ru: "Бежевый",
      zh: "米色",
    },
  },
  {
    name: "Light Grey",
    hex: "#BEBAB3",
    names: {
      mn: "Цайвар саарал",
      en: "Light Grey",
      ru: "Светло-серый",
      zh: "浅灰色",
    },
  },
  {
    name: "Brown",
    hex: "#7A5C45",
    names: { mn: "Бор", en: "Brown", ru: "Коричневый", zh: "棕色" },
  },
  {
    name: "Charcoal",
    hex: "#3E3732",
    names: {
      mn: "Бараан саарал / хар бор",
      en: "Charcoal / Dark Brown",
      ru: "Графитовый / тёмно-коричневый",
      zh: "炭灰 / 深棕",
    },
  },
  {
    name: "Oatmeal",
    hex: "#D8CFC0",
    names: {
      mn: "Овъёосон шаргал",
      en: "Oatmeal",
      ru: "Овсяный",
      zh: "燕麦色",
    },
  },
  {
    name: "Heather Grey",
    hex: "#C9C5BE",
    names: {
      mn: "Холимог саарал",
      en: "Heather Grey",
      ru: "Серый меланж",
      zh: "麻灰色",
    },
  },
  {
    name: "Ecru",
    hex: "#E3DCCD",
    names: { mn: "Түүхий цагаан", en: "Ecru", ru: "Экрю", zh: "本白色" },
  },
  {
    name: "Mushroom",
    hex: "#A89F91",
    names: { mn: "Мөөгөн бор", en: "Mushroom", ru: "Грибной", zh: "蘑菇色" },
  },
  {
    name: "Taupe",
    hex: "#9E9384",
    names: {
      mn: "Саарал бор",
      en: "Taupe",
      ru: "Серо-коричневый",
      zh: "灰褐色",
    },
  },
];

// Colours already on items from the printed catalog: not offered in the
// picker, but still translated and shown with a swatch.
const EARLIER_COLORS: CashmereColor[] = [
  {
    name: "Camel",
    hex: "#b88a5a",
    names: { mn: "Тэмээн шаргал", en: "Camel", ru: "Кэмел", zh: "驼色" },
  },
  {
    name: "Grey",
    hex: "#a3a19e",
    names: { mn: "Саарал", en: "Grey", ru: "Серый", zh: "灰色" },
  },
  {
    name: "Black",
    hex: "#1c1c1c",
    names: { mn: "Хар", en: "Black", ru: "Чёрный", zh: "黑色" },
  },
];

const ALIASES: Record<string, string> = {
  gray: "Grey",
  ivory: "White",
  "white / ivory": "White",
  "heather gray": "Heather Grey",
  "light gray": "Light Grey",
  fawn: "Beige",
  "beige / fawn": "Beige",
  "dark brown": "Charcoal",
  "charcoal / dark brown": "Charcoal",
};

export function findCashmereColor(name: string) {
  const key = name.trim().toLowerCase();
  const target = (ALIASES[key] ?? key).toLowerCase();
  return [...CASHMERE_COLORS, ...EARLIER_COLORS].find(
    (c) => c.name.toLowerCase() === target,
  );
}

/** Splits a stored "Camel, Ivory" list. */
export const splitColors = (list: string) =>
  list
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
