import Link from "next/link";
import Image from "next/image";
import { guardPage } from "@/lib/auth-guard";
import { getDashboard } from "@/lib/admin-data";
import { formatPrice } from "@/lib/products";
import { isUploadedImage } from "@/lib/format";
import {
  OrderStatusBadge,
  PageBody,
  PageHeader,
  StatCard,
  formatDate,
  icons,
  orderCode,
  panel,
} from "../ui";

export default async function AdminDashboard() {
  await guardPage("admin", "orders");
  const d = await getDashboard();
  const peak = Math.max(...d.months.map((m) => m.total), 1);

  return (
    <>
      <PageHeader
        title="Хяналтын самбар"
        subtitle="Өнөөдрийн борлуулалт, нөөц, захиалгын тойм"
      />
      <PageBody>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Энэ сарын борлуулалт"
            value={formatPrice(d.monthRevenue)}
            note="Цуцлагдсанаас бусад захиалга"
            icon={icons.chart}
          />
          <StatCard
            label="Захиалга"
            value={d.orderCount}
            note={`▲ ${d.monthOrderCount} энэ сар`}
            noteTone="up"
            icon={icons.clipboard}
          />
          <StatCard
            label="Идэвхтэй бараа"
            value={d.activeProducts}
            note={`• ${d.lowStock.length} нөөц багатай`}
            noteTone="warn"
            icon={icons.box}
          />
          <StatCard
            label="Хэрэглэгчид"
            value={d.userCount}
            note="Нийт бүртгэлтэй"
            icon={icons.users}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section className={`${panel} p-7`}>
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-medium">Борлуулалтын чиг хандлага</h2>
              <span className="text-xs text-adm-mute">Сүүлийн 8 сар · ₮</span>
            </div>
            <div className="mt-8 flex h-52 items-end gap-3">
              {d.months.map((m, i) => (
                <div key={m.label} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-44 w-full items-end">
                    <div
                      title={formatPrice(m.total)}
                      className={`w-full rounded-md ${
                        i === d.months.length - 1 ? "bg-adm-sand-dark" : "bg-adm-paper"
                      }`}
                      style={{ height: `${Math.max((m.total / peak) * 100, 6)}%` }}
                    />
                  </div>
                  <span className="text-xs text-adm-mute">{m.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={`${panel} p-7`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Нөөцийн анхааруулга</h2>
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-red-50 px-2 text-xs font-medium text-red-700">
                {d.lowStock.length}
              </span>
            </div>
            <ul className="mt-6 space-y-4">
              {d.lowStock.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center gap-4">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-adm-paper">
                    <Image src={p.image} alt="" fill sizes="48px" className="object-cover" unoptimized={isUploadedImage(p.image)} />
                  </div>
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="min-w-0 flex-1 text-sm leading-snug hover:underline"
                  >
                    {p.titleMn}
                  </Link>
                  <span className="shrink-0 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                    Үлдэгдэл {p.stock}
                  </span>
                </li>
              ))}
              {d.lowStock.length === 0 && (
                <li className="py-8 text-center text-sm text-adm-mute">
                  Нөөц багатай бараа алга. Барааны нөөцийг &quot;Бараа&quot; хэсгээс оруулна.
                </li>
              )}
            </ul>
          </section>
        </div>

        <section className={panel}>
          <div className="flex items-center justify-between px-7 py-6">
            <h2 className="text-lg font-medium">Сүүлийн захиалга</h2>
            <Link href="/admin/orders" className="text-sm text-adm-sand-dark hover:underline">
              Бүгдийг харах →
            </Link>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {d.recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-adm-line">
                  <td className="px-7 py-4 font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                      {orderCode(order.id)}
                    </Link>
                  </td>
                  <td className="px-5 py-4">{order.phone}</td>
                  <td className="px-5 py-4 text-adm-mute">
                    {order.items.reduce((n, i) => n + i.quantity, 0)} ш
                  </td>
                  <td className="px-5 py-4 font-semibold">{formatPrice(order.total)}</td>
                  <td className="px-5 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-7 py-4 text-right text-adm-mute">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
              {d.recentOrders.length === 0 && (
                <tr>
                  <td className="px-7 py-10 text-center text-adm-mute">Захиалга алга.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </PageBody>
    </>
  );
}
