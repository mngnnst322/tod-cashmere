// Client-safe lookbook try-on constants: no database imports.

export type LookbookGender = "women" | "men";
export type LookbookSlot = "head" | "top" | "bottom";

/** Garment types the try-on knows, which body slot each fills, and who wears it. */
export const LOOKBOOK_TYPES = [
  { key: "hat", label: "Малгай", slot: "head", genders: ["women"] },
  { key: "tshirt", label: "Майк", slot: "top", genders: ["women", "men"] },
  { key: "shirt", label: "Цамц", slot: "top", genders: ["women", "men"] },
  { key: "pants", label: "Өмд", slot: "bottom", genders: ["women", "men"] },
  { key: "skirt", label: "Юбка", slot: "bottom", genders: ["women"] },
  // A dress fills the top slot and also takes the bottom off: its layer
  // covers the legs down to the shoes, so trousers or a skirt must not show.
  { key: "dress", label: "Даашинз", slot: "top", genders: ["women"], fullBody: true },
] as const satisfies readonly {
  key: string;
  label: string;
  slot: LookbookSlot;
  genders: readonly LookbookGender[];
  fullBody?: boolean;
}[];

export type LookbookType = (typeof LOOKBOOK_TYPES)[number]["key"];

export const LOOKBOOK_GENDERS: { key: LookbookGender; label: string }[] = [
  { key: "women", label: "Эмэгтэй" },
  { key: "men", label: "Эрэгтэй" },
];

/** Bottom first, so tops fall over waistbands and hats/hoods over tops. */
export const SLOT_ORDER: LookbookSlot[] = ["bottom", "top", "head"];

export const isLookbookGender = (v: unknown): v is LookbookGender => v === "women" || v === "men";

export function lookbookType(key: string | null | undefined) {
  return LOOKBOOK_TYPES.find((t) => t.key === key);
}

/** True for a garment that is worn instead of both a top and a bottom (a dress). */
export function isFullBody(type: string | null | undefined) {
  const t = lookbookType(type);
  return Boolean(t && "fullBody" in t && t.fullBody);
}

/** The slot a product's type fills, or null if the type doesn't apply to that gender. */
export function slotFor(type: string | null | undefined, gender: string | null | undefined) {
  const t = lookbookType(type);
  if (!t || !isLookbookGender(gender)) return null;
  return (t.genders as readonly string[]).includes(gender) ? t.slot : null;
}

/** One garment as the storefront try-on receives it. */
export type LookbookItem = {
  layerId: string;
  slug: string;
  title: string;
  color: string;
  price: number;
  sizes: string;
  type: LookbookType;
  slot: LookbookSlot;
  /** Transparent layer, same size as the model photo. */
  layer: string;
  /** Photo for the card: the garment alone if there is one, else the cover. */
  thumb: string;
  /** Cover photo for the cart line. */
  image: string;
  soldOut: boolean;
};

export type LookbookLook = { gender: LookbookGender; model: string; items: LookbookItem[] };
