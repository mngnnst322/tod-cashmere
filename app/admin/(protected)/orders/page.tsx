import { listOrdersWithItems, updateOrderStatus } from "@/lib/admin-actions";

const statuses = ["pending", "paid", "fulfilled", "cancelled"];

export default async function AdminOrdersPage() {
  const orders = await listOrdersWithItems();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{order.customerName}</div>
                <div className="text-sm text-neutral-500">
                  {order.phone} · {order.address}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {order.total.toLocaleString()}₮
                </div>
                <div className="text-sm text-neutral-500">
                  {order.paymentMethod}
                </div>
              </div>
            </div>
            <ul className="mb-3 text-sm text-neutral-600">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.quantity}× {item.titleMn} —{" "}
                  {(item.price * item.quantity).toLocaleString()}₮
                </li>
              ))}
            </ul>
            <form
              action={async (formData: FormData) => {
                "use server";
                await updateOrderStatus(
                  order.id,
                  String(formData.get("status")),
                );
              }}
              className="flex items-center gap-2"
            >
              <select
                name="status"
                defaultValue={order.status}
                className="rounded border border-neutral-300 px-2 py-1 text-sm"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded bg-neutral-900 px-3 py-1 text-sm text-white hover:bg-neutral-700"
              >
                Update
              </button>
            </form>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-neutral-500">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
