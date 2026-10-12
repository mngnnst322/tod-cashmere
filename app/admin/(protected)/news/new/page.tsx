import { guardPage } from "@/lib/auth-guard";
import { createNews } from "@/lib/admin-actions";
import { PageBody, PageHeader } from "../../../ui";
import { NewsForm } from "../news-form";

export default async function NewNewsPage() {
  await guardPage("admin");
  return (
    <>
      <PageHeader title="Мэдээ нэмэх" subtitle="10-аас олон болвол хамгийн хуучин нь автоматаар устна" />
      <PageBody>
        <NewsForm action={createNews} />
      </PageBody>
    </>
  );
}
