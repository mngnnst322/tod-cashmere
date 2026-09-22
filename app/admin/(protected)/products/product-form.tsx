import type { categories, products } from "@/lib/db/schema";

type Category = typeof categories.$inferSelect;
type Product = typeof products.$inferSelect;

export function ProductForm({
  action,
  categories,
  product,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  product?: Product;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input
          name="slug"
          defaultValue={product?.slug}
          required
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Title (MN)</label>
        <input
          name="titleMn"
          defaultValue={product?.titleMn}
          required
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Title (EN)</label>
        <input
          name="titleEn"
          defaultValue={product?.titleEn}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Price (₮)</label>
          <input
            type="number"
            name="price"
            defaultValue={product?.price}
            required
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Compare-at price (optional)
          </label>
          <input
            type="number"
            name="compareAtPrice"
            defaultValue={product?.compareAtPrice ?? undefined}
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Color</label>
        <input
          name="color"
          defaultValue={product?.color}
          required
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <select
          name="categorySlug"
          defaultValue={product?.categorySlug}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.nameMn}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Collection</label>
          <select
            name="collection"
            defaultValue={product?.collection ?? "catalog"}
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="catalog">catalog</option>
            <option value="arrival">arrival</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Badge (optional)
          </label>
          <input
            name="badge"
            defaultValue={product?.badge ?? ""}
            className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Image path (existing, e.g. /images/x.jpg)
        </label>
        <input
          name="imagePath"
          defaultValue={product?.image}
          placeholder="/images/example.jpg"
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Or upload a new image
        </label>
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          className="w-full text-sm"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="inStock"
          defaultChecked={product?.inStock ?? true}
        />
        In stock
      </label>
      <button
        type="submit"
        className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
      >
        Save
      </button>
    </form>
  );
}
