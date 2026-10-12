import { guardPage } from "@/lib/auth-guard";
import { createCategory } from "@/lib/admin-actions";
import { PageBody, PageHeader } from "../../../ui";
import { CategoryForm } from "../category-form";

export default async function NewCategoryPage() {
  await guardPage("admin");
  return (
    <>
      <PageHeader title="Ангилал нэмэх" subtitle="Шинэ ангилал 4 хэл дээр" />
      <PageBody>
        <CategoryForm action={createCategory} />
      </PageBody>
    </>
  );
}
