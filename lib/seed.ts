import { getDb } from "./db";
import { categories, products } from "./db/schema";
import { categorySeed, productSeed } from "./seed-data";

export async function runSeed() {
  const db = await getDb();
  const log: string[] = [];

  for (const category of categorySeed) {
    await db.insert(categories).values(category).onConflictDoNothing();
  }
  log.push(`categories: ${categorySeed.length} ensured`);

  for (const product of productSeed) {
    await db.insert(products).values(product).onConflictDoNothing();
  }
  log.push(`products: ${productSeed.length} ensured`);

  return log;
}
