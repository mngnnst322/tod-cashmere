import { and, desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { lookbookLayers, lookbookModels, products } from "./db/schema";
import { listProducts } from "./products";
import { isSoldOut } from "./format";
import { productColor, productTitle, type Lang } from "./i18n";
import { productViews } from "./product-views";
import {
  LOOKBOOK_GENDERS,
  slotFor,
  type LookbookGender,
  type LookbookItem,
  type LookbookLook,
  type LookbookType,
} from "./lookbook";

/** The newest active model photo for a gender. */
export async function getActiveModel(gender: LookbookGender) {
  const db = await getDb();
  return db.query.lookbookModels.findFirst({
    where: and(eq(lookbookModels.gender, gender), eq(lookbookModels.active, true)),
    orderBy: desc(lookbookModels.createdAt),
  });
}

/**
 * Storefront data for the try-on: per gender, the model photo and every
 * visible product that has an approved layer on that photo. Genders without a
 * model photo or without any approved layer are left out, so the page can fall
 * back to the old look when there is nothing to try on yet.
 */
export async function getLookbookLooks(lang: Lang): Promise<LookbookLook[]> {
  const db = await getDb();
  const [visible, layers] = await Promise.all([
    listProducts(),
    db.select().from(lookbookLayers).where(eq(lookbookLayers.status, "approved")),
  ]);
  const byId = new Map(visible.map((p) => [p.id, p]));
  const looks: LookbookLook[] = [];
  for (const { key: gender } of LOOKBOOK_GENDERS) {
    const model = await getActiveModel(gender);
    if (!model) continue;
    const items: LookbookItem[] = [];
    for (const layer of layers) {
      if (layer.modelId !== model.id) continue;
      const p = byId.get(layer.productId);
      if (!p || p.lookbookGender !== gender) continue;
      const slot = slotFor(p.lookbookType, gender);
      if (!slot) continue;
      const views = productViews(p);
      items.push({
        layerId: layer.id,
        slug: p.slug,
        title: productTitle(p, lang),
        color: productColor(p, lang),
        price: p.price,
        sizes: p.sizes,
        type: p.lookbookType as LookbookType,
        slot,
        layer: layer.image,
        thumb: views.flat || p.image,
        image: p.image,
        soldOut: isSoldOut(p),
      });
    }
    if (items.length) looks.push({ gender, model: model.image, items });
  }
  return looks;
}

/** Admin: every model photo, and every layer with its product. */
export async function getLookbookAdmin() {
  const db = await getDb();
  const [models, layers, all] = await Promise.all([
    db.select().from(lookbookModels).orderBy(desc(lookbookModels.createdAt)),
    db.select().from(lookbookLayers).orderBy(desc(lookbookLayers.createdAt)),
    db.select().from(products).orderBy(products.titleMn),
  ]);
  const byId = new Map(all.map((p) => [p.id, p]));
  return {
    models,
    layers: layers.map((l) => ({ ...l, product: byId.get(l.productId) ?? null })),
    // Products tagged for the lookbook, for the "add layer" picker.
    tagged: all.filter((p) => slotFor(p.lookbookType, p.lookbookGender)),
  };
}
