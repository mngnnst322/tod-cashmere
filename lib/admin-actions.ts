"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, desc, eq, inArray, notInArray } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "./db";
import {
  ORDER_STATUSES,
  catalogItems,
  catalogTypes,
  categories,
  news,
  orders,
  products,
  siteSettings,
  type OrderStatus,
} from "./db/schema";
import { isStaffRole, requireAdmin, requireRole } from "./auth-guard";
import { isCatalogGender } from "./catalog-types";
import { translateFromMongolian } from "./translate";
import { MEASUREMENTS } from "./measurements";

/** Stores an uploaded photo in R2 and returns its public path. */
async function uploadImage(file: File) {
  const { env } = await getCloudflareContext({ async: true });
  const ext = file.name.split(".").pop() || "jpg";
  const key = `${crypto.randomUUID()}.${ext}`;
  await env.PRODUCT_IMAGES.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });
  return `/api/images/${key}`;
}

async function requireImagePath(formData: FormData, fallback?: string | null) {
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) return uploadImage(file);
  const pasted = String(formData.get("imagePath") || "").trim();
  return pasted || fallback || "";
}

// Optional fields: blank inputs are stored as null so the storefront falls
// back to English / the Mongolian original.
function optional(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim() || null;
}

function optionalInt(formData: FormData, key: string) {
  const value = optional(formData, key);
  return value == null ? null : Math.max(0, Math.round(Number(value)));
}

/**
 * Product form fields. Only the Mongolian name and colour are entered; the
 * English, Russian and Chinese ones are machine-translated when the
 * Mongolian text is new or changed (otherwise the stored ones are kept).
 */
async function productFields(
  formData: FormData,
  existing?: { titleMn: string; titleEn: string; titleRu: string | null; titleZh: string | null; color: string; colorEn: string | null; colorRu: string | null; colorZh: string | null },
) {
  const titleMn = String(formData.get("titleMn")).trim();
  const color = String(formData.get("color")).trim();
  // Names typed in the EN/RU/ZH tabs win; empty ones (or ones left as they
  // were while the Mongolian name changed) are translated.
  const typed = (key: string) => String(formData.get(key) || "").trim();
  const nameChanged = !existing || existing.titleMn !== titleMn;
  const keepTyped = (key: "titleEn" | "titleRu" | "titleZh") => {
    const v = typed(key);
    return v && !(nameChanged && existing && v === (existing[key] ?? "")) ? v : "";
  };
  const typedTitle = { en: keepTyped("titleEn"), ru: keepTyped("titleRu"), zh: keepTyped("titleZh") };
  const needsTranslation = !typedTitle.en || !typedTitle.ru || !typedTitle.zh;
  const [title, colour] = await Promise.all([
    needsTranslation
      ? translateFromMongolian(titleMn).then((t) => ({
          en: typedTitle.en || t.en,
          ru: typedTitle.ru || t.ru,
          zh: typedTitle.zh || t.zh,
        }))
      : typedTitle,
    existing && existing.color === color
      ? { en: existing.colorEn ?? "", ru: existing.colorRu ?? "", zh: existing.colorZh ?? "" }
      : translateFromMongolian(color),
  ]);
  return {
    slug: String(formData.get("slug")),
    titleMn,
    titleEn: title.en || titleMn,
    titleRu: title.ru || null,
    titleZh: title.zh || null,
    price: Number(formData.get("price")),
    compareAtPrice: optionalInt(formData, "compareAtPrice"),
    color,
    colorEn: colour.en || null,
    colorRu: colour.ru || null,
    colorZh: colour.zh || null,
    sizes: String(formData.get("sizes") || "").trim(),
    modelHeight: optionalInt(formData, "modelHeight"),
    modelSize: optional(formData, "modelSize"),
    measurements: JSON.stringify(
      Object.fromEntries(
        MEASUREMENTS.map((d) => [d.key, Number(formData.get(`m-${d.key}`) || 0)] as const).filter(
          ([, v]) => v > 0,
        ),
      ),
    ),
    regionPrices: JSON.stringify(
      Object.fromEntries(
        (["RU", "KR", "INTL"] as const)
          .map((r) => [r, Number(formData.get(`price-${r}`) || 0)] as const)
          .filter(([, v]) => v > 0),
      ),
    ),
    categorySlug: String(formData.get("categorySlug")),
    collection: String(formData.get("collection") || "catalog"),
    badge: optional(formData, "badge"),
    stock: optionalInt(formData, "stock"),
    inStock: formData.get("inStock") === "on",
    hidden: formData.get("hidden") === "on",
  };
}

function categoryFields(formData: FormData) {
  return {
    slug: String(formData.get("slug")),
    nameMn: String(formData.get("nameMn")),
    nameEn: String(formData.get("nameEn") || formData.get("nameMn")),
    nameRu: optional(formData, "nameRu"),
    nameZh: optional(formData, "nameZh"),
    meta: String(formData.get("meta") || ""),
    metaMn: optional(formData, "metaMn"),
    metaRu: optional(formData, "metaRu"),
    metaZh: optional(formData, "metaZh"),
    sortOrder: Number(formData.get("sortOrder") || 0),
  };
}

// ---- Products ----

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const fields = await productFields(formData);
  await db.insert(products).values({
    id: crypto.randomUUID(),
    ...fields,
    code: fields.slug,
    ...(await galleryPhotos(formData, true)),
  });
  revalidatePath("/admin", "layout");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  const photos = await galleryPhotos(formData, true);
  await db
    .update(products)
    .set({
      ...(await productFields(formData, existing)),
      images: photos.images,
      image: photos.image || existing?.image || "",
    })
    .where(eq(products.id, id));
  revalidatePath("/admin", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin", "layout");
}

/** Copies a product as a hidden draft so it can be edited before going live. */
export async function duplicateProduct(id: string) {
  await requireAdmin();
  const db = await getDb();
  const source = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  if (!source) return;
  const suffix = Date.now().toString(36);
  await db.insert(products).values({
    ...source,
    id: crypto.randomUUID(),
    slug: `${source.slug}-${suffix}`,
    code: `${source.code}-${suffix}`,
    titleMn: `${source.titleMn} (хуулбар)`,
    hidden: true,
    createdAt: new Date(),
  });
  revalidatePath("/admin", "layout");
}

export async function setProductHidden(id: string, hidden: boolean) {
  await requireAdmin();
  const db = await getDb();
  await db.update(products).set({ hidden }).where(eq(products.id, id));
  revalidatePath("/admin", "layout");
}

export async function setProductStock(id: string, stock: number | null) {
  await requireAdmin();
  const db = await getDb();
  await db
    .update(products)
    .set({ stock: stock == null ? null : Math.max(0, Math.round(stock)) })
    .where(eq(products.id, id));
  revalidatePath("/admin", "layout");
}

export async function bulkProductAction(
  ids: string[],
  action: "hide" | "show" | "delete",
) {
  await requireAdmin();
  if (ids.length === 0) return;
  const db = await getDb();
  if (action === "delete") {
    await db.delete(products).where(inArray(products.id, ids));
  } else {
    await db
      .update(products)
      .set({ hidden: action === "hide" })
      .where(inArray(products.id, ids));
  }
  revalidatePath("/admin", "layout");
}

/**
 * Bulk price update from a CSV with a header row containing `slug` and `price`
 * (and optionally `compare_at_price`). Rows with unknown slugs are reported.
 */
export async function importPrices(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "CSV файл сонгоно уу." };
  }
  const rows = (await file.text())
    .replace(/^﻿/, "")
    .split(/\r?\n/)
    .map((line) => line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")))
    .filter((cells) => cells.some(Boolean));
  const header = (rows.shift() ?? []).map((h) => h.toLowerCase());
  const slugCol = header.indexOf("slug");
  const priceCol = header.indexOf("price");
  const compareCol = header.indexOf("compare_at_price");
  if (slugCol < 0 || priceCol < 0) {
    return {
      ok: false as const,
      error: "Эхний мөрөнд slug, price баганууд байх ёстой.",
    };
  }

  const db = await getDb();
  let updated = 0;
  const missing: string[] = [];
  for (const cells of rows) {
    const slug = cells[slugCol];
    const price = Number(cells[priceCol]);
    if (!slug || !Number.isFinite(price)) continue;
    const compare = compareCol >= 0 ? cells[compareCol] : undefined;
    const result = await db
      .update(products)
      .set({
        price: Math.round(price),
        ...(compare !== undefined && {
          compareAtPrice: compare ? Math.round(Number(compare)) : null,
        }),
      })
      .where(eq(products.slug, slug))
      .returning({ id: products.id });
    if (result.length) updated++;
    else missing.push(slug);
  }
  revalidatePath("/admin", "layout");
  return { ok: true as const, updated, missing };
}

// ---- Categories ----

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.insert(categories).values({
    id: crypto.randomUUID(),
    ...categoryFields(formData),
    image: await requireImagePath(formData),
  });
  revalidatePath("/admin", "layout");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const existing = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
  await db
    .update(categories)
    .set({
      ...categoryFields(formData),
      image: await requireImagePath(formData, existing?.image),
    })
    .where(eq(categories.id, id));
  revalidatePath("/admin", "layout");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin", "layout");
}

// ---- Orders ----

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status as OrderStatus)) return;
  const db = await getDb();
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  revalidatePath("/admin", "layout");
}

/** Packing staff hand a confirmed order over to delivery. */
export async function markOrderPacked(id: string) {
  await requireRole("admin", "packer");
  const db = await getDb();
  await db
    .update(orders)
    .set({ status: "shipping" })
    .where(and(eq(orders.id, id), eq(orders.status, "confirmed")));
  revalidatePath("/admin", "layout");
}

// ---- News (only the latest 10 are kept) ----

const NEWS_LIMIT = 10;

function newsFields(formData: FormData) {
  return {
    titleMn: String(formData.get("titleMn")),
    titleEn: optional(formData, "titleEn"),
    titleRu: optional(formData, "titleRu"),
    titleZh: optional(formData, "titleZh"),
    bodyMn: String(formData.get("bodyMn") || ""),
    bodyEn: optional(formData, "bodyEn"),
    bodyRu: optional(formData, "bodyRu"),
    bodyZh: optional(formData, "bodyZh"),
    sourceUrl: optional(formData, "sourceUrl"),
  };
}

export async function createNews(formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  await db.insert(news).values({
    id: crypto.randomUUID(),
    ...newsFields(formData),
    image: (await requireImagePath(formData)) || null,
  });
  const keep = await db
    .select({ id: news.id })
    .from(news)
    .orderBy(desc(news.createdAt))
    .limit(NEWS_LIMIT);
  await db.delete(news).where(
    notInArray(
      news.id,
      keep.map((n) => n.id),
    ),
  );
  revalidatePath("/admin", "layout");
  redirect("/admin/news");
}

export async function updateNews(id: string, formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const existing = await db.query.news.findFirst({ where: eq(news.id, id) });
  await db
    .update(news)
    .set({
      ...newsFields(formData),
      image: (await requireImagePath(formData, existing?.image)) || null,
    })
    .where(eq(news.id, id));
  revalidatePath("/admin", "layout");
  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(news).where(eq(news.id, id));
  revalidatePath("/admin", "layout");
}

// ---- Online catalog ----

export async function saveCatalogItem(id: string | null, formData: FormData) {
  await requireAdmin();
  const db = await getDb();
  const type = String(formData.get("type"));
  const values = {
    type,
    name: String(formData.get("name")),
    code: String(formData.get("code") || "").trim(),
    material: String(formData.get("material") || ""),
    colors: String(formData.get("colors") || "").trim(),
    sizes: String(formData.get("sizes") || "").trim(),
    modelHeight: optionalInt(formData, "modelHeight"),
    modelSize: optional(formData, "modelSize"),
    gender: isCatalogGender(formData.get("gender")) ? String(formData.get("gender")) : "women",
    sortOrder: Number(formData.get("sortOrder") || 0),
    ...(await galleryPhotos(formData)),
  };
  if (id) {
    await db.update(catalogItems).set(values).where(eq(catalogItems.id, id));
  } else {
    await db.insert(catalogItems).values({ id: crypto.randomUUID(), ...values });
  }
  revalidatePath("/admin", "layout");
  redirect(catalogAdminHref(values.gender, type));
}

export async function deleteCatalogItem(id: string) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(catalogItems).where(eq(catalogItems.id, id));
  revalidatePath("/admin", "layout");
}

/**
 * The photo gallery from a product or catalog form: photos kept (`keep`), new uploads
 * (`galleryFiles`), and the cover (`cover`: a kept path or "new:<n>").
 */
async function galleryPhotos(formData: FormData, required: true): Promise<{ images: string; image: string }>;
async function galleryPhotos(formData: FormData): Promise<{ images: string; image: string | null }>;
async function galleryPhotos(formData: FormData, required?: boolean) {
  const kept = formData.getAll("keep").map(String).filter(Boolean);
  const files = formData
    .getAll("galleryFiles")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded = await Promise.all(files.map(uploadImage));
  const images = [...kept, ...uploaded];
  const cover = String(formData.get("cover") || "");
  const picked = cover.startsWith("new:") ? uploaded[Number(cover.slice(4))] : cover;
  const image = images.includes(picked) ? picked : (images[0] ?? (required ? "" : null));
  return { images: JSON.stringify(images), image };
}

const catalogAdminHref = (gender: string, type?: string) =>
  `/admin/catalog?gender=${gender}${type ? `&type=${encodeURIComponent(type)}` : ""}`;

export async function addCatalogType(gender: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!isCatalogGender(gender) || !name) return;
  const db = await getDb();
  const existing = await db.select().from(catalogTypes).where(eq(catalogTypes.gender, gender));
  if (!existing.some((t) => t.name === name)) {
    const sortOrder = Math.max(-1, ...existing.map((t) => t.sortOrder)) + 1;
    await db.insert(catalogTypes).values({ id: crypto.randomUUID(), gender, name, sortOrder });
  }
  revalidatePath("/admin", "layout");
  redirect(catalogAdminHref(gender, name));
}

/** Renames a type and moves that gender's items over to the new name. */
export async function renameCatalogType(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const db = await getDb();
  const type = await db.query.catalogTypes.findFirst({ where: eq(catalogTypes.id, id) });
  if (!type || !name) return;
  if (name !== type.name) {
    await db.update(catalogTypes).set({ name }).where(eq(catalogTypes.id, id));
    await db
      .update(catalogItems)
      .set({ type: name })
      .where(and(eq(catalogItems.gender, type.gender), eq(catalogItems.type, type.name)));
  }
  revalidatePath("/admin", "layout");
  redirect(catalogAdminHref(type.gender, name));
}

/** Deletes a type; only offered for types with no items. */
export async function deleteCatalogType(id: string) {
  await requireAdmin();
  const db = await getDb();
  const type = await db.query.catalogTypes.findFirst({ where: eq(catalogTypes.id, id) });
  if (!type) return;
  const items = await db
    .select({ id: catalogItems.id })
    .from(catalogItems)
    .where(and(eq(catalogItems.gender, type.gender), eq(catalogItems.type, type.name)));
  if (items.length > 0) throw new Error("Type still has items");
  await db.delete(catalogTypes).where(eq(catalogTypes.id, id));
  revalidatePath("/admin", "layout");
  redirect(catalogAdminHref(type.gender));
}

// ---- Site launch switch ----

export async function setComingSoon(on: boolean) {
  await requireAdmin();
  const db = await getDb();
  await db
    .insert(siteSettings)
    .values({ key: "coming_soon", value: on ? "1" : "0" })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value: on ? "1" : "0" } });
  revalidatePath("/", "layout");
}

// ---- Staff roles (Clerk public metadata) ----

export async function grantRole(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = String(formData.get("role") || "");
  if (!email || !isStaffRole(role)) {
    return { ok: false as const, error: "Имэйл болон эрхээ сонгоно уу." };
  }
  const client = await clerkClient();
  const { data } = await client.users.getUserList({ emailAddress: [email] });
  const target = data[0];
  if (!target) {
    return {
      ok: false as const,
      error: "Энэ имэйлээр бүртгэлтэй хэрэглэгч олдсонгүй. Эхлээд сайтад бүртгүүлэх ёстой.",
    };
  }
  await client.users.updateUserMetadata(target.id, {
    publicMetadata: { role },
  });
  revalidatePath("/admin", "layout");
  return { ok: true as const };
}

export async function revokeRole(userId: string) {
  const me = await requireAdmin();
  // Keep at least the caller's own access so nobody locks themselves out.
  if (userId === me.id) return;
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role: null },
  });
  revalidatePath("/admin", "layout");
}
