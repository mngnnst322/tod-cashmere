import { cache } from "react";
import { cookies, headers } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { siteSettings } from "./db/schema";
import { REGION_CURRENCY, REGIONS, regionFromCountry, type Pricing, type Region } from "./money";

const RATES_KEY = "fx_rates";
const MAX_AGE_MS = 12 * 60 * 60 * 1000;

type Rates = { at: number; rates: Record<string, number> };

/**
 * Tugrik exchange rates, fetched at most twice a day from open.er-api.com and
 * kept in site_settings. On failure the last stored rates are used.
 */
async function getRates(): Promise<Record<string, number>> {
  const db = await getDb();
  const row = await db.query.siteSettings.findFirst({ where: eq(siteSettings.key, RATES_KEY) });
  let stored: Rates | null = null;
  try {
    stored = row ? (JSON.parse(row.value) as Rates) : null;
  } catch {
    stored = null;
  }
  if (stored && Date.now() - stored.at < MAX_AGE_MS) return stored.rates;
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/MNT");
    const data = (await res.json()) as { result?: string; rates?: Record<string, number> };
    if (data.result === "success" && data.rates) {
      const value = JSON.stringify({ at: Date.now(), rates: data.rates } satisfies Rates);
      await db
        .insert(siteSettings)
        .values({ key: RATES_KEY, value })
        .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
      return data.rates;
    }
  } catch {
    // keep the old rates
  }
  return stored?.rates ?? {};
}

/**
 * The visitor's region (from Cloudflare's country header, or a `region`
 * cookie override) and the tugrik → local currency rate.
 */
export const getPricing = cache(async (): Promise<Pricing> => {
  const [h, c] = await Promise.all([headers(), cookies()]);
  const override = c.get("region")?.value as Region | undefined;
  const region =
    override && (REGIONS as readonly string[]).includes(override)
      ? override
      : regionFromCountry(h.get("cf-ipcountry"));
  if (region === "MN") return { region, rate: 1 };
  const rate = (await getRates())[REGION_CURRENCY[region]];
  // Without a rate, fall back to showing tugrik.
  return rate ? { region, rate } : { region: "MN", rate: 1 };
});
