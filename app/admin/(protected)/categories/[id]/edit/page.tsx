import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { updateCategory } from "@/lib/admin-actions";
import { CategoryForm } from "../../category-form";

export default async function EditCategoryPage(
  props: PageProps<"/admin/categories/[id]/edit">,
) {
  const { id } = await props.params;
  const db = await getDb();
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
  if (!category) notFound();

  const action = updateCategory.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit category</h1>
      <CategoryForm action={action} category={category} />
    </div>
  );
}
