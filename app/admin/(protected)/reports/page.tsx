import Link from "next/link";
import { guardPage } from "@/lib/auth-guard";
import { REPORT_PERIODS, getReport, type ReportPeriod } from "@/lib/admin-data";
import { formatPrice } from "@/lib/products";
import { EmptyRow, PageBody, PageHeader, StatCard, btnDark, icons, panel, th } from "../../ui";

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  week: "7 хоног",
  month: "Сар",
  year: "Жил",
};

export default async function AdminReportsPage(props: PageProps<"/admin/reports">) {
  await guardPage("admin");
  const { period: param } = await props.searchParams;
  const period: ReportPeriod =
    typeof param === "string" && param in REPORT_PERIODS ? (param as ReportPeriod) : "month";
  const r = await getReport(period);

  return (
    <>
      <PageHeader
        title="Тайлан"
        subtitle="Борлуулалтын тайлан ба экспорт"
        actions={
          <a href={`/admin/export/report?period=${period}`} className={btnDark}>
            {icons.download}
            Тайлан татах
          </a>
        }
      />
      <PageBody>
        <div className="inline-flex gap-1 rounded-xl bg-white p-1.5">
          {(Object.keys(REPORT_PERIODS) as ReportPeriod[]).map((p) => (
            <Link
              key={p}
              href={`/admin/reports?period=${p}`}
              className={`rounded-lg px-5 py-2.5 text-[15px] font-medium transition ${
                p === period ? "bg-adm-ink text-white" : "text-adm-ink/70 hover:bg-adm-cream"
              }`}
            >
              {PERIOD_LABELS[p]}
            </Link>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Орлого" value={formatPrice(r.revenue)} />
          <StatCard label="Захиалга" value={r.orderCount} />
          <StatCard label="Дундаж дүн" value={formatPrice(r.average)} />
          <StatCard label="Зарагдсан ширхэг" value={r.units} />
        </div>

        <section className={panel}>
          <h2 className="border-b border-adm-line px-7 py-6 text-lg font-medium">
            Шилдэг борлогдсон бараа
          </h2>
          <table className="w-full text-sm">
            {r.topProducts.length > 0 && (
              <thead>
                <tr>
                  <th className={`${th} pl-7`}>#</th>
                  <th className={th}>Бараа</th>
                  <th className={th}>Ширхэг</th>
                  <th className={`${th} pr-7 text-right`}>Орлого</th>
                </tr>
              </thead>
            )}
            <tbody>
              {r.topProducts.map((p, i) => (
                <tr key={p.productId} className="border-t border-adm-line">
                  <td className="py-4 pl-7 text-adm-mute">{i + 1}</td>
                  <td className="px-5 py-4 font-medium">{p.title}</td>
                  <td className="px-5 py-4">{p.qty}</td>
                  <td className="py-4 pr-7 text-right font-semibold">{formatPrice(p.revenue)}</td>
                </tr>
              ))}
              {r.topProducts.length === 0 && (
                <EmptyRow colSpan={4}>Энэ хугацаанд борлуулалт алга.</EmptyRow>
              )}
            </tbody>
          </table>
        </section>
      </PageBody>
    </>
  );
}
