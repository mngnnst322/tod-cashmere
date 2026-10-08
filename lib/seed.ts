import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "./db";
import { categories, products, user } from "./db/schema";
import { categorySeed, productSeed } from "./seed-data";
import { getAuth } from "./auth";

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

  const { env } = await getCloudflareContext({ async: true });
  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existing = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.email, adminEmail),
    });
    if (!existing) {
      const auth = await getAuth();
      const { user: created } = await auth.api.signUpEmail({
        body: { email: adminEmail, name: "Admin", password: adminPassword },
      });
      await db
        .update(user)
        .set({ role: "admin" })
        .where(eq(user.id, created.id));
      log.push(`admin user created: ${adminEmail}`);
    } else {
      log.push(`admin user already exists: ${adminEmail}`);
    }
  } else {
    log.push(
      "ADMIN_EMAIL / ADMIN_PASSWORD not set in .dev.vars — no admin user created",
    );
  }

  return log;
}

export async function hasAnyUser() {
  const db = await getDb();
  const existing = await db.select().from(user).limit(1);
  return existing.length > 0;
}
