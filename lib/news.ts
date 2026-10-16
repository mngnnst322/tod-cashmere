import { desc } from "drizzle-orm";
import { getDb } from "./db";
import { news } from "./db/schema";
import type { Lang } from "./i18n";

/** Public read of the news posts from Admin → Мэдээ, newest first. */
export async function listPublicNews() {
  const db = await getDb();
  return db.select().from(news).orderBy(desc(news.createdAt));
}

type NewsRow = typeof news.$inferSelect;

export function newsTitle(n: NewsRow, lang: Lang) {
  if (lang === "en") return n.titleEn || n.titleMn;
  if (lang === "ru") return n.titleRu || n.titleEn || n.titleMn;
  if (lang === "zh") return n.titleZh || n.titleEn || n.titleMn;
  return n.titleMn;
}
