import Link from "next/link";
import { notFound } from "next/navigation";
import { guardPage } from "@/lib/auth-guard";
import { getOrder } from "@/lib/admin-data";
import { updateOrderStatus } from "@/lib/admin-actions";
import { ORDER_STATUSES } from "@/lib/db/schema";
import { formatPrice } from "@/lib/products";
import {
  ORDER_STATUS_LABELS,
  OrderStatusBadge,
  PageBody,
  PageHeader,
  btnSoft,
  formatDate,
  orderCode,
  panel,
} from "../../../ui";

const paymentLabels: Record<string, string> = { qpay: "QPay", stripe: "Карт" };

export default async function AdminOrderPage(props: PageProps<"/admin/orders/[id]">) {
  const user = await guardPage("admin", "orders");
  const { id } = await props.params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <>
      <PageHeader
        title={`Захиалга ${orderCode(order.id)}`}
        subtitle={`${formatDate(order.createdAt)} · ${order.customerName}`}
        actions={
          <Link href="/admin/orders" className={btnSoft}>
            ← Буцах
          </Link>
        }
      />
      <PageBody>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section className={`${panel} p-7`}>
            <h2 className="mb-5 text-lg font-medium">Бараа</h2>
            <ul className="divide-y divide-adm-line">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 py-4 text-sm">
                  <div>
                    <div className="font-medium">{item.titleMn}</div>
                    <div className="text-adm-mute">
                      {item.quantity} × {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-adm-line pt-5 text-base">
              <span>Нийт</span>
              <span className="font-semibold">{formatPrice(order.total)}</span>
            </div>
          </section>

          <div className="space-y-6">
            <section className={`${panel} space-y-3 p-7 text-sm`}>
              <h2 className="mb-2 text-lg font-medium">Хүргэлт</h2>
              <Row label="Нэр" value={order.customerName} />
              <Row label="Утас" value={order.phone} />
              <Row label="Хаяг" value={order.address} />
              <Row label="Төлбөр" value={paymentLabels[order.paymentMethod] ?? order.paymentMethod} />
              <Row label="Төлөв" value={<OrderStatusBadge status={order.status} />} />
            </section>

            {user.role === "admin" && (
              <section className={`${panel} p-7`}>
                <h2 className="mb-4 text-lg font-medium">Төлөв солих</h2>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((s) => (
                    <form
                      key={s}
                      action={async () => {
                        "use server";
                        await updateOrderStatus(order.id, s);
                      }}
                    >
                      <button
                        type="submit"
                        disabled={order.status === s}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          order.status === s
                            ? "border-adm-ink bg-adm-ink text-white"
                            : "border-adm-line bg-white hover:border-adm-sand"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[s]}
                      </button>
                    </form>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-6 border-b border-adm-line pb-3 last:border-0">
      <span className="text-adm-mute">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
