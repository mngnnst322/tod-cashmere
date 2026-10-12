import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { siteSettings } from "./db/schema";

/** While on, the public storefront shows only the "coming soon" screen. */
export async function isComingSoon() {
  const db = await getDb();
  const row = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.key, "coming_soon"),
  });
  return row?.value === "1";
}
