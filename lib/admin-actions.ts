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
  categories,
  news,
  orders,
  products,
  siteSettings,
  type OrderStatus,
} from "./db/schema";
import { isStaffRole, requireAdmin, requireRole } from "./auth-guard";
import { isCatalogGender } from "./catalog-types";

async function requireImagePath(formData: FormData, fallback?: string | null) {
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    const { env } = await getCloudflareContext({ async: true });
    const ext = file.name.split(".").pop() || "jpg";
    const key = `${crypto.randomUUID()}.${ext}`;
    await env.PRODUCT_IMAGES.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });
    return `/api/images/${key}`;
  }
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

function productFields(formData: FormData) {
  return {
    slug: String(formData.get("slug")),
    titleMn: String(formData.get("titleMn")),
    titleEn: String(formData.get("titleEn") || formData.get("titleMn")),
    titleRu: optional(formData, "titleRu"),
    titleZh: optional(formData, "titleZh"),
    price: Number(formData.get("price")),
    compareAtPrice: optionalInt(formData, "compareAtPrice"),
    color: String(formData.get("color")),
    colorEn: optional(formData, "colorEn"),
    colorRu: optional(formData, "colorRu"),
    colorZh: optional(formData, "colorZh"),
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
  const fields = productFields(formData);
  await db.insert(products).values({
    id: crypto.randomUUID(),
    ...fields,
    code: fields.slug,
    image: await requireImagePath(formData),
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
  await db
    .update(products)
    .set({
      ...productFields(formData),
      image: await requireImagePath(formData, existing?.image),
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
  const existing = id
    ? await db.query.catalogItems.findFirst({ where: eq(catalogItems.id, id) })
    : undefined;
  const values = {
    type,
    name: String(formData.get("name")),
    code: String(formData.get("code") || "").trim(),
    material: String(formData.get("material") || ""),
    colors: String(formData.get("colors") || "").trim(),
    sizes: String(formData.get("sizes") || "").trim(),
    gender: isCatalogGender(formData.get("gender")) ? String(formData.get("gender")) : "unisex",
    sortOrder: Number(formData.get("sortOrder") || 0),
    image: (await requireImagePath(formData, existing?.image)) || null,
  };
  if (id) {
    await db.update(catalogItems).set(values).where(eq(catalogItems.id, id));
  } else {
    await db.insert(catalogItems).values({ id: crypto.randomUUID(), ...values });
  }
  revalidatePath("/admin", "layout");
  redirect(`/admin/catalog?type=${encodeURIComponent(type)}`);
}

export async function deleteCatalogItem(id: string) {
  await requireAdmin();
  const db = await getDb();
  await db.delete(catalogItems).where(eq(catalogItems.id, id));
  revalidatePath("/admin", "layout");
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
