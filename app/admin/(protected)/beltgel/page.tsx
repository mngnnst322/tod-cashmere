import { guardPage } from "@/lib/auth-guard";
import { getPackingQueue } from "@/lib/admin-data";
import { markOrderPacked } from "@/lib/admin-actions";
import { PageBody, PageHeader, btnDark, formatDate, orderCode, panel } from "../../ui";

export default async function PackingPage() {
  await guardPage("admin", "packer");
  const queue = await getPackingQueue();

  return (
    <>
      <PageHeader
        title="Бэлтгэл"
        subtitle="Баталгаажсан захиалгуудыг бэлтгээд хүргэлтэд шилжүүлнэ"
      />
      <PageBody>
        {queue.length === 0 && (
          <div className={`${panel} px-7 py-16 text-center text-sm text-adm-mute`}>
            Бэлтгэх захиалга алга. Захиалга &quot;Баталгаажсан&quot; төлөвт орход энд гарна.
          </div>
        )}
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {queue.map((order) => (
            <section key={order.id} className={`${panel} flex flex-col p-7`}>
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-semibold">{orderCode(order.id)}</h2>
                <span className="text-xs text-adm-mute">{formatDate(order.createdAt)}</span>
              </div>
              <div className="mt-1 text-sm text-adm-mute">
                {order.customerName} · {order.phone}
              </div>
              <div className="mt-1 text-sm text-adm-mute">{order.address}</div>
              <ul className="mt-5 flex-1 divide-y divide-adm-line border-y border-adm-line">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                    <span>{item.titleMn}</span>
                    <span className="font-semibold">× {item.quantity}</span>
                  </li>
                ))}
              </ul>
              <form
                className="mt-5"
                action={async () => {
                  "use server";
                  await markOrderPacked(order.id);
                }}
              >
                <button type="submit" className={`${btnDark} w-full`}>
                  Бэлтгэсэн → Хүргэлтэд
                </button>
              </form>
            </section>
          ))}
        </div>
      </PageBody>
    </>
  );
}
