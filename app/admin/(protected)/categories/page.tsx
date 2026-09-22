import Link from "next/link";
import { listCategories } from "@/lib/products";
import { deleteCategory } from "@/lib/admin-actions";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
        >
          + New category
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Meta</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">{category.nameMn}</td>
                <td className="px-4 py-2">{category.slug}</td>
                <td className="px-4 py-2">{category.meta}</td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className="mr-3 underline"
                  >
                    Edit
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteCategory(category.id);
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
