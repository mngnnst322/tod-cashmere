"use server";

import { getDb } from "./db/index";
import { orders, orderItems } from "./db/schema";
import type { CartLine } from "@/components/cart-provider";
import { getUserId } from "./auth-guard";

export async function createOrder(input: {
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: CartLine[];
}) {
  if (input.items.length === 0) {
    return { ok: false as const, error: "empty" as const };
  }

  const db = await getDb();
  const orderId = crypto.randomUUID();
  const total = input.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  await db.insert(orders).values({
    id: orderId,
    userId: await getUserId(),
    status: "new",
    customerName: input.customerName,
    phone: input.phone,
    address: input.address,
    paymentMethod: input.paymentMethod,
    total,
  });

  await db.insert(orderItems).values(
    input.items.map((item) => ({
      id: crypto.randomUUID(),
      orderId,
      productId: item.id,
      titleMn: item.title,
      price: item.price,
      quantity: item.qty,
    })),
  );

  return { ok: true as const, orderId };
}
