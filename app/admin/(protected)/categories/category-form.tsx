import type { categories } from "@/lib/db/schema";

type Category = typeof categories.$inferSelect;

export function CategoryForm({
  action,
  category,
}: {
  action: (formData: FormData) => void;
  category?: Category;
}) {
  return (
    <form action={action} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input
          name="slug"
          defaultValue={category?.slug}
          required
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Name (MN)</label>
        <input
          name="nameMn"
          defaultValue={category?.nameMn}
          required
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Name (EN)</label>
        <input
          name="nameEn"
          defaultValue={category?.nameEn}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Meta line</label>
        <input
          name="meta"
          defaultValue={category?.meta}
          placeholder="Coats · Jackets"
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Sort order</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={category?.sortOrder ?? 0}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Image path (existing, e.g. /images/x.jpg)
        </label>
        <input
          name="imagePath"
          defaultValue={category?.image}
          className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Or upload a new image
        </label>
        <input type="file" name="imageFile" accept="image/*" className="w-full text-sm" />
      </div>
      <button
        type="submit"
        className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
      >
        Save
      </button>
    </form>
  );
}
