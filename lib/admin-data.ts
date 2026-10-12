import { and, desc, eq, gte, inArray, ne } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";
import { getDb } from "./db";
import { catalogItems, news, orderItems, orders, products } from "./db/schema";
import { isStaffRole, requireAdmin, requireRole, type Role } from "./auth-guard";

// Read-only loaders for the admin pages. Kept out of admin-actions.ts so they
// aren't exposed as server actions; each still checks the caller's role.

export const LOW_STOCK_THRESHOLD = 3;

type Order = typeof orders.$inferSelect;
type OrderItem = typeof orderItems.$inferSelect;

async function attachItems(list: Order[]) {
  if (list.length === 0) return [];
  const db = await getDb();
  const items = await db
    .select()
    .from(orderItems)
    .where(
      inArray(
        orderItems.orderId,
        list.map((o) => o.id),
      ),
    );
  const byOrder = new Map<string, OrderItem[]>();
  for (const item of items) {
    byOrder.set(item.orderId, [...(byOrder.get(item.orderId) ?? []), item]);
  }
  return list.map((order) => ({ ...order, items: byOrder.get(order.id) ?? [] }));
}

export type OrderWithItems = Awaited<ReturnType<typeof attachItems>>[number];

export async function listOrdersWithItems() {
  await requireRole("admin", "orders");
  const db = await getDb();
  return attachItems(await db.select().from(orders).orderBy(desc(orders.createdAt)));
}

export async function getOrder(id: string) {
  await requireRole("admin", "orders");
  const db = await getDb();
  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  return order ? (await attachItems([order]))[0] : null;
}

/** Confirmed orders waiting to be packed. */
export async function getPackingQueue() {
  await requireRole("admin", "packer");
  const db = await getDb();
  return attachItems(
    await db
      .select()
      .from(orders)
      .where(eq(orders.status, "confirmed"))
      .orderBy(orders.createdAt),
  );
}

function startOfMonth(date: Date, offset = 0) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

export async function getDashboard() {
  await requireRole("admin", "orders");
  const db = await getDb();
  const now = new Date();
  const monthStart = startOfMonth(now);
  const chartStart = startOfMonth(now, -7);

  const [allOrders, allProducts, userCount] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.createdAt)),
    db.select().from(products),
    clerkClient().then((c) => c.users.getCount()),
  ]);

  const sold = allOrders.filter((o) => o.status !== "cancelled");
  const monthRevenue = sold
    .filter((o) => o.createdAt >= monthStart)
    .reduce((sum, o) => sum + o.total, 0);

  const months = Array.from({ length: 8 }, (_, i) => {
    const start = startOfMonth(now, i - 7);
    const end = startOfMonth(now, i - 6);
    return {
      label: `${start.getMonth() + 1}-р`,
      total: sold
        .filter((o) => o.createdAt >= start && o.createdAt < end)
        .reduce((sum, o) => sum + o.total, 0),
    };
  });

  const active = allProducts.filter((p) => !p.hidden);
  const lowStock = active
    .filter((p) => p.stock != null && p.stock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0));

  return {
    monthRevenue,
    orderCount: allOrders.length,
    monthOrderCount: allOrders.filter((o) => o.createdAt >= monthStart).length,
    activeProducts: active.length,
    lowStock,
    userCount,
    months,
    chartFrom: chartStart,
    recentOrders: await attachItems(allOrders.slice(0, 6)),
  };
}

export const REPORT_PERIODS = { week: 7, month: 30, year: 365 } as const;
export type ReportPeriod = keyof typeof REPORT_PERIODS;

export async function getReport(period: ReportPeriod) {
  await requireAdmin();
  const db = await getDb();
  const since = new Date(Date.now() - REPORT_PERIODS[period] * 86_400_000);
  const list = await db
    .select()
    .from(orders)
    .where(and(gte(orders.createdAt, since), ne(orders.status, "cancelled")))
    .orderBy(desc(orders.createdAt));
  const withItems = await attachItems(list);

  const revenue = list.reduce((sum, o) => sum + o.total, 0);
  const byProduct = new Map<string, { title: string; qty: number; revenue: number }>();
  let units = 0;
  for (const order of withItems) {
    for (const item of order.items) {
      units += item.quantity;
      const row = byProduct.get(item.productId) ?? {
        title: item.titleMn,
        qty: 0,
        revenue: 0,
      };
      row.qty += item.quantity;
      row.revenue += item.price * item.quantity;
      byProduct.set(item.productId, row);
    }
  }

  return {
    since,
    orders: withItems,
    revenue,
    orderCount: list.length,
    average: list.length ? Math.round(revenue / list.length) : 0,
    units,
    topProducts: [...byProduct.entries()]
      .map(([productId, row]) => ({ productId, ...row }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10),
  };
}

function roleOf(metadata: Record<string, unknown>): Role {
  return isStaffRole(metadata.role) ? metadata.role : "user";
}

/** Clerk users joined with what they've ordered on the site. */
export async function listCustomers() {
  await requireAdmin();
  const client = await clerkClient();
  const db = await getDb();
  const [{ data: users }, allOrders] = await Promise.all([
    client.users.getUserList({ limit: 200, orderBy: "-created_at" }),
    db.select().from(orders).where(ne(orders.status, "cancelled")),
  ]);
  return users.map((u) => {
    const mine = allOrders.filter((o) => o.userId === u.id);
    return {
      id: u.id,
      name: u.fullName || u.username || "",
      email: u.primaryEmailAddress?.emailAddress ?? "",
      imageUrl: u.imageUrl,
      createdAt: new Date(u.createdAt),
      role: roleOf(u.publicMetadata),
      orderCount: mine.length,
      spent: mine.reduce((sum, o) => sum + o.total, 0),
    };
  });
}

export async function listStaff() {
  await requireAdmin();
  const client = await clerkClient();
  const { data } = await client.users.getUserList({ limit: 500 });
  return data
    .filter((u) => isStaffRole(u.publicMetadata.role))
    .map((u) => ({
      id: u.id,
      name: u.fullName || u.username || "",
      email: u.primaryEmailAddress?.emailAddress ?? "",
      role: roleOf(u.publicMetadata),
    }));
}

export async function listNews() {
  await requireAdmin();
  const db = await getDb();
  return db.select().from(news).orderBy(desc(news.createdAt));
}

export async function listCatalogItems() {
  await requireAdmin();
  const db = await getDb();
  return db.select().from(catalogItems).orderBy(catalogItems.sortOrder);
}
