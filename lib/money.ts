// Regions with their own prices and currencies. Prices are kept in tugrik;
// the visitor sees them converted at the day's exchange rate.

export const REGIONS = ["MN", "RU", "KR", "INTL"] as const;
export type Region = (typeof REGIONS)[number];

export const REGION_LABELS: Record<Region, string> = {
  MN: "Монгол",
  RU: "Орос",
  KR: "Солонгос",
  INTL: "Бусад улс",
};

export const REGION_CURRENCY: Record<Region, "MNT" | "RUB" | "KRW" | "USD"> = {
  MN: "MNT",
  RU: "RUB",
  KR: "KRW",
  INTL: "USD",
};

/** What a page needs to show prices: the region and tugrik → local rate. */
export type Pricing = { region: Region; rate: number };

export const DEFAULT_PRICING: Pricing = { region: "MN", rate: 1 };

export function regionFromCountry(country: string | null | undefined): Region {
  const c = (country ?? "").toUpperCase();
  if (!c || c === "MN" || c === "XX" || c === "T1") return "MN";
  if (c === "RU") return "RU";
  if (c === "KR") return "KR";
  return "INTL";
}

/** A tugrik amount in the visitor's currency, e.g. "20,000₮", "1 230 ₽", "$7". */
export function formatMoney(mnt: number, pricing: Pricing = DEFAULT_PRICING) {
  const currency = REGION_CURRENCY[pricing.region];
  if (currency === "MNT") return `${mnt.toLocaleString("mn-MN")}₮`;
  const amount = mnt * pricing.rate;
  const locale = currency === "RUB" ? "ru-RU" : currency === "KRW" ? "ko-KR" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "USD" ? 2 : 0,
    minimumFractionDigits: 0,
  }).format(currency === "USD" ? Math.round(amount * 100) / 100 : Math.round(amount));
}

/** The tugrik price a region pays for a product (falls back to the base price). */
export function regionalPrice(
  product: { price: number; regionPrices?: string | null },
  region: Region,
) {
  if (region === "MN") return product.price;
  try {
    const map = JSON.parse(product.regionPrices || "{}") as Partial<Record<Region, number>>;
    const v = Number(map[region]);
    return v > 0 ? v : product.price;
  } catch {
    return product.price;
  }
}
