import Link from "next/link";
import { guardPage } from "@/lib/auth-guard";
import { listOrdersWithItems } from "@/lib/admin-data";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/db/schema";
import { formatPrice } from "@/lib/products";
import {
  Avatar,
  EmptyRow,
  ORDER_STATUS_LABELS,
  OrderStatusBadge,
  PageBody,
  PageHeader,
  formatDate,
  orderCode,
  panel,
  th,
} from "../../ui";

export default async function AdminOrdersPage(props: PageProps<"/admin/orders">) {
  await guardPage("admin", "orders");
  const { status } = await props.searchParams;
  const active = ORDER_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : null;
  const all = await listOrdersWithItems();
  const orders = active ? all.filter((o) => o.status === active) : all;

  const tabs: { key: OrderStatus | null; label: string; count: number }[] = [
    { key: null, label: "Бүгд", count: all.length },
    ...ORDER_STATUSES.map((s) => ({
      key: s,
      label: ORDER_STATUS_LABELS[s],
      count: all.filter((o) => o.status === s).length,
    })),
  ];

  return (
    <>
      <PageHeader title="Захиалга" subtitle="Захиалга хянах, төлөв шинэчлэх, хүргэлт" />
      <PageBody>
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const on = tab.key === active;
            return (
              <Link
                key={tab.label}
                href={tab.key ? `/admin/orders?status=${tab.key}` : "/admin/orders"}
                className={`flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[15px] transition ${
                  on
                    ? "border-adm-sand-dark bg-adm-sand-dark text-white"
                    : "border-adm-line bg-white text-adm-ink/80 hover:border-adm-sand"
                }`}
              >
                {tab.label}
                <span
                  className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs ${
                    on ? "bg-white/25" : "bg-adm-paper"
                  }`}
                >
                  {tab.count}
                </span>
              </Link>
            );
          })}
        </div>

        <div className={`${panel} overflow-x-auto`}>
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-adm-line">
                <th className={th}>Захиалга</th>
                <th className={th}>Үйлчлүүлэгч</th>
                <th className={th}>Бараа</th>
                <th className={th}>Дүн</th>
                <th className={th}>Төлөв</th>
                <th className={th}>Огноо</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-adm-line hover:bg-adm-cream/60">
                  <td className="px-5 py-4 font-semibold">{orderCode(order.id)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={order.customerName} />
                      <div>
                        <div>{order.phone}</div>
                        <div className="text-xs text-adm-mute">{order.customerName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-adm-mute">
                    {order.items.reduce((n, i) => n + i.quantity, 0)} ш
                  </td>
                  <td className="px-5 py-4 font-semibold">{formatPrice(order.total)}</td>
                  <td className="px-5 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4 text-adm-mute">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-adm-sand-dark hover:underline"
                    >
                      Дэлгэрэнгүй →
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && <EmptyRow colSpan={7}>Захиалга алга.</EmptyRow>}
            </tbody>
          </table>
        </div>
      </PageBody>
    </>
  );
}
