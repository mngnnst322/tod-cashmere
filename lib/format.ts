// Pure helpers, safe to import from client components.

export function formatPrice(amount: number) {
  return `${amount.toLocaleString("mn-MN")}₮`;
}

export function discountPercent(price: number, compareAtPrice: number) {
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/** Out of stock when switched off, or when tracked stock has hit zero. */
export function isSoldOut(p: { inStock: boolean; stock: number | null }) {
  return !p.inStock || (p.stock != null && p.stock <= 0);
}
