import Link from "next/link";
import { listCategories, listProducts } from "@/lib/products";
import { listOrdersWithItems } from "@/lib/admin-actions";

export default async function AdminDashboard() {
  const [products, categories, orders] = await Promise.all([
    listProducts(),
    listCategories(),
    listOrdersWithItems(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <div className="text-sm text-neutral-500">Products</div>
          <div className="text-3xl font-semibold">{products.length}</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <div className="text-sm text-neutral-500">Categories</div>
          <div className="text-3xl font-semibold">{categories.length}</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <div className="text-sm text-neutral-500">Orders</div>
          <div className="text-3xl font-semibold">{orders.length}</div>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Recent orders</h2>
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">{order.customerName}</td>
                <td className="px-4 py-2">{order.total.toLocaleString()}₮</td>
                <td className="px-4 py-2">{order.status}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-neutral-500" colSpan={3}>
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Link href="/admin/orders" className="mt-3 inline-block text-sm underline">
        View all orders →
      </Link>
    </div>
  );
}
