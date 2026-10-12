import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { guardPage } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { updateCategory } from "@/lib/admin-actions";
import { PageBody, PageHeader } from "../../../../ui";
import { CategoryForm } from "../../category-form";

export default async function EditCategoryPage(
  props: PageProps<"/admin/categories/[id]/edit">,
) {
  await guardPage("admin");
  const { id } = await props.params;
  const db = await getDb();
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
  if (!category) notFound();

  return (
    <>
      <PageHeader title="Ангилал засах" subtitle={category.nameMn} />
      <PageBody>
        <CategoryForm action={updateCategory.bind(null, id)} category={category} />
      </PageBody>
    </>
  );
}
