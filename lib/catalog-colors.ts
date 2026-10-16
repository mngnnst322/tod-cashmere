import type { Lang } from "./i18n";

type CashmereColor = {
  name: string;
  /** The yarn colour number shown beside the swatch, e.g. "02". */
  code: string;
  /** Pantone TCX reference the colour matches. */
  pantone: string;
  hex: string;
  names: Record<Lang, string>;
};

// The cashmere colours the admin ticks for catalog items. Items store the
// English `name`s, comma-separated, e.g. "Jet Black, Merlot".
export const CASHMERE_COLORS: CashmereColor[] = [
  {
    name: "Jet Black",
    code: "81",
    pantone: "19-0303 TCX",
    hex: "#2D2C2F",
    names: { mn: "Хар", en: "Jet Black", ru: "Чёрный", zh: "黑色" },
  },
  {
    name: "Antique White",
    code: "02",
    pantone: "11-0105 TCX",
    hex: "#EDE3D2",
    names: { mn: "Цайвар шаргал", en: "Antique White", ru: "Античный белый", zh: "古董白" },
  },
  {
    name: "Coca Mocha",
    code: "57",
    pantone: "18-1019 TCX",
    hex: "#8A6F5C",
    names: { mn: "Кофе бор", en: "Coca Mocha", ru: "Мокко", zh: "摩卡棕" },
  },
  {
    name: "Merlot",
    code: "46",
    pantone: "19-1534 TCX",
    hex: "#72262C",
    names: { mn: "Улаан хүрэн", en: "Merlot", ru: "Мерло", zh: "酒红色" },
  },
];

export function findCashmereColor(name: string) {
  const key = name.trim().toLowerCase();
  return CASHMERE_COLORS.find((c) => c.name.toLowerCase() === key);
}

/** Splits a stored "Camel, Ivory" list. */
export const splitColors = (list: string) =>
  list
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

/** Whether text on this colour should be dark (light colours) or white. */
export function isLightColor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 160;
}

/**
 * A text colour for a number written on this colour: a light tint of it on
 * dark colours, a deep shade of it on light ones, so it reads in its own hue.
 */
export function numberColorOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const mix = isLightColor(hex)
    ? rgb.map((c) => Math.round(c * 0.45))
    : rgb.map((c) => Math.round(c + (255 - c) * 0.75));
  return `rgb(${mix.join(", ")})`;
}
