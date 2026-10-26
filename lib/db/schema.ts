import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameMn: text("name_mn").notNull(),
  nameEn: text("name_en").notNull(),
  nameRu: text("name_ru"),
  nameZh: text("name_zh"),
  // `meta` is the English sub-line; the other languages fall back to it.
  meta: text("meta").notNull(),
  metaMn: text("meta_mn"),
  metaRu: text("meta_ru"),
  metaZh: text("meta_zh"),
  image: text("image").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titleMn: text("title_mn").notNull(),
  titleEn: text("title_en").notNull(),
  titleRu: text("title_ru"),
  titleZh: text("title_zh"),
  price: integer("price").notNull(),
  compareAtPrice: integer("compare_at_price"),
  // `color` is the Mongolian name; the other languages fall back to it.
  color: text("color").notNull(),
  colorEn: text("color_en"),
  colorRu: text("color_ru"),
  colorZh: text("color_zh"),
  code: text("code").notNull(),
  categorySlug: text("category_slug").notNull(),
  collection: text("collection").notNull(),
  badge: text("badge"),
  image: text("image").notNull(),
  // Every photo (JSON array, different angles); `image` is the cover.
  // Prices for other countries, in tugrik: {"RU": 30000, "KR": 40000,
  // "INTL": 50000}. Missing ones use `price`. Shown in the visitor's currency.
  regionPrices: text("region_prices").notNull().default("{}"),
  // Sizes it comes in, e.g. "S / M / L" or "3-4 нас / 5-6 нас"; empty = one size.
  sizes: text("sizes").notNull().default(""),
  images: text("images").notNull().default("[]"),
  inStock: integer("in_stock", { mode: "boolean" }).notNull().default(true),
  // Units on hand; null means stock isn't tracked for this product.
  stock: integer("stock"),
  // Hidden products stay in the admin but disappear from the storefront.
  hidden: integer("hidden", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  // Clerk user id when the customer was signed in at checkout.
  userId: text("user_id"),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull().default("new"),
  total: integer("total").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  titleMn: text("title_mn").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
});

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  image: text("image"),
  // "admin" unlocks /admin; everyone who signs up on the storefront is "user".
  role: text("role").notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const news = sqliteTable("news", {
  id: text("id").primaryKey(),
  titleMn: text("title_mn").notNull(),
  titleEn: text("title_en"),
  titleRu: text("title_ru"),
  titleZh: text("title_zh"),
  bodyMn: text("body_mn").notNull(),
  bodyEn: text("body_en"),
  bodyRu: text("body_ru"),
  bodyZh: text("body_zh"),
  // Where the post was first published (e.g. its Facebook post).
  sourceUrl: text("source_url"),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// "Online catalog": the garment types the brand makes, each with example items.
export const catalogItems = sqliteTable("catalog_items", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  // Style code, e.g. "12-10-335".
  code: text("code").notNull().default(""),
  material: text("material").notNull().default(""),
  // Free text as shown on the card, e.g. "Camel, Ivory, Grey, Black".
  colors: text("colors").notNull().default(""),
  // e.g. "S / M / L / XL / 2XL".
  sizes: text("sizes").notNull().default(""),
  // Every photo of the item (JSON array of paths, different angles); `image`
  // is the one picked as the cover for cards.
  images: text("images").notNull().default("[]"),
  // "women" | "men"; set from the admin tab the item is added under.
  gender: text("gender").notNull().default("unisex"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Garment types of the online catalog, per gender, managed in Admin → Каталог.
// Items refer to their type by name.
export const catalogTypes = sqliteTable("catalog_types", {
  id: text("id").primaryKey(),
  gender: text("gender").notNull(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Small key/value store for site-wide switches toggled from /admin/settings.
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
