import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { guardPage } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";
import { news } from "@/lib/db/schema";
import { updateNews } from "@/lib/admin-actions";
import { PageBody, PageHeader } from "../../../../ui";
import { NewsForm } from "../../news-form";

export default async function EditNewsPage(props: PageProps<"/admin/news/[id]/edit">) {
  await guardPage("admin");
  const { id } = await props.params;
  const db = await getDb();
  const item = await db.query.news.findFirst({ where: eq(news.id, id) });
  if (!item) notFound();

  return (
    <>
      <PageHeader title="Мэдээ засах" subtitle={item.titleMn} />
      <PageBody>
        <NewsForm action={updateNews.bind(null, id)} item={item} />
      </PageBody>
    </>
  );
}
