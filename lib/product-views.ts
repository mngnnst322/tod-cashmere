/** The fixed product photos, in the order the product page shows them. */
export const PRODUCT_VIEWS = [
  { key: "front", label: "Урдаас" },
  { key: "right", label: "Баруун талаас" },
  { key: "left", label: "Зүүн талаас" },
  { key: "flat", label: "Моделгүй" },
] as const;

export type ProductView = (typeof PRODUCT_VIEWS)[number]["key"];

/**
 * A product's photo per view. Products saved before views existed fill the
 * slots from their `images` list in order.
 */
export function productViews(product?: { views: string; images: string; image: string } | null) {
  const out: Partial<Record<ProductView, string>> = {};
  if (!product) return out;
  try {
    Object.assign(out, JSON.parse(product.views || "{}"));
  } catch {
    // fall back below
  }
  if (Object.values(out).some(Boolean)) return out;
  let list: string[] = [];
  try {
    list = JSON.parse(product.images || "[]");
  } catch {
    // ignore
  }
  if (!list.length && product.image) list = [product.image];
  PRODUCT_VIEWS.forEach((v, i) => {
    if (list[i]) out[v.key] = list[i];
  });
  return out;
}
