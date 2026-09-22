import Link from "next/link";
import Image from "next/image";
import { listProducts, formatPrice } from "@/lib/products";
import { deleteProduct } from "@/lib/admin-actions";

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
        >
          + New product
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">In stock</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">
                  <div className="relative h-12 w-10 overflow-hidden rounded">
                    <Image
                      src={product.image}
                      alt={product.titleMn}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-2">{product.titleMn}</td>
                <td className="px-4 py-2">{product.categorySlug}</td>
                <td className="px-4 py-2">{formatPrice(product.price)}</td>
                <td className="px-4 py-2">{product.inStock ? "Yes" : "No"}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="mr-3 underline"
                  >
                    Edit
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteProduct(product.id);
                    }}
                    className="inline"
                  >
                    <button type="submit" className="text-red-600 underline">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
