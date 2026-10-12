import { csvResponse } from "@/lib/csv";
import { REPORT_PERIODS, getReport, type ReportPeriod } from "@/lib/admin-data";

export async function GET(request: Request) {
  const param = new URL(request.url).searchParams.get("period");
  const period: ReportPeriod = param && param in REPORT_PERIODS ? (param as ReportPeriod) : "month";

  let report;
  try {
    report = await getReport(period);
  } catch {
    return new Response("Forbidden", { status: 403 });
  }

  const rows: unknown[][] = [
    ["order_id", "date", "customer", "phone", "status", "payment", "item", "qty", "price", "line_total", "order_total"],
  ];
  for (const order of report.orders) {
    for (const item of order.items) {
      rows.push([
        order.id,
        order.createdAt.toISOString().slice(0, 10),
        order.customerName,
        order.phone,
        order.status,
        order.paymentMethod,
        item.titleMn,
        item.quantity,
        item.price,
        item.price * item.quantity,
        order.total,
      ]);
    }
  }
  rows.push([]);
  rows.push(["revenue", report.revenue]);
  rows.push(["orders", report.orderCount]);
  rows.push(["average_order", report.average]);
  rows.push(["units_sold", report.units]);

  return csvResponse(`report-${period}-${new Date().toISOString().slice(0, 10)}.csv`, rows);
}
