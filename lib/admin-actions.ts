"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "./db";
import { categories, products, orders, orderItems } from "./db/schema";

async function requireImagePath(formData: FormData, fallback?: string) {
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

export async function createProduct(formData: FormData) {
  const db = await getDb();
  const image = await requireImagePath(formData);
  await db.insert(products).values({
    id: crypto.randomUUID(),
    slug: String(formData.get("slug")),
    titleMn: String(formData.get("titleMn")),
    titleEn: String(formData.get("titleEn") || formData.get("titleMn")),
    price: Number(formData.get("price")),
    compareAtPrice: formData.get("compareAtPrice")
      ? Number(formData.get("compareAtPrice"))
      : null,
    color: String(formData.get("color")),
    code: String(formData.get("slug")),
    categorySlug: String(formData.get("categorySlug")),
    collection: String(formData.get("collection") || "catalog"),
    badge: String(formData.get("badge") || "") || null,
    image,
    inStock: formData.get("inStock") === "on",
  });
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const db = await getDb();
  const existing = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  const image = await requireImagePath(formData, existing?.image);
  await db
    .update(products)
    .set({
      slug: String(formData.get("slug")),
      titleMn: String(formData.get("titleMn")),
      titleEn: String(formData.get("titleEn") || formData.get("titleMn")),
      price: Number(formData.get("price")),
      compareAtPrice: formData.get("compareAtPrice")
        ? Number(formData.get("compareAtPrice"))
        : null,
      color: String(formData.get("color")),
      categorySlug: String(formData.get("categorySlug")),
      collection: String(formData.get("collection") || "catalog"),
      badge: String(formData.get("badge") || "") || null,
      image,
      inStock: formData.get("inStock") === "on",
    })
    .where(eq(products.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const db = await getDb();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/", "layout");
}

export async function createCategory(formData: FormData) {
  const db = await getDb();
  const image = await requireImagePath(formData);
  await db.insert(categories).values({
    id: crypto.randomUUID(),
    slug: String(formData.get("slug")),
    nameMn: String(formData.get("nameMn")),
    nameEn: String(formData.get("nameEn") || formData.get("nameMn")),
    meta: String(formData.get("meta")),
    image,
    sortOrder: Number(formData.get("sortOrder") || 0),
  });
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const db = await getDb();
  const existing = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
  const image = await requireImagePath(formData, existing?.image);
  await db
    .update(categories)
    .set({
      slug: String(formData.get("slug")),
      nameMn: String(formData.get("nameMn")),
      nameEn: String(formData.get("nameEn") || formData.get("nameMn")),
      meta: String(formData.get("meta")),
      image,
      sortOrder: Number(formData.get("sortOrder") || 0),
    })
    .where(eq(categories.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const db = await getDb();
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/", "layout");
}

export async function updateOrderStatus(id: string, status: string) {
  const db = await getDb();
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  revalidatePath("/admin/orders");
}

export async function listOrdersWithItems() {
  const db = await getDb();
  const allOrders = await db
    .select()
    .from(orders)
    .orderBy(orders.createdAt);
  const allItems = await db.select().from(orderItems);
  return allOrders
    .map((order) => ({
      ...order,
      items: allItems.filter((item) => item.orderId === order.id),
    }))
    .reverse();
}
