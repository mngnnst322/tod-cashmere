import Image from "next/image";
import { notFound } from "next/navigation";
import { getNews, newsBody, newsTitle } from "@/lib/news";
import { getLang } from "@/lib/i18n-server";
import { isUploadedImage } from "@/lib/format";

export async function generateMetadata(props: PageProps<"/news/[id]">) {
  const { id } = await props.params;
  const [n, lang] = await Promise.all([getNews(id), getLang()]);
  return { title: n ? `${newsTitle(n, lang)} – Tod Cashmere` : "Tod Cashmere" };
}

// One news post from Admin → Мэдээ: photo, date, title and text.
export default async function NewsPage(props: PageProps<"/news/[id]">) {
  const { id } = await props.params;
  const [n, lang] = await Promise.all([getNews(id), getLang()]);
  if (!n) notFound();
  return (
    <section className="section katalog-item">
      <div className="katalog-item-layout">
        <div className="katalog-item-image">
          {n.image && (
            <Image
              src={n.image}
              unoptimized={isUploadedImage(n.image)}
              alt=""
              fill
              priority
              sizes="(max-width: 860px) 100vw, 640px"
            />
          )}
        </div>
        <div className="katalog-item-info">
          <time className="katalog-item-type">{n.createdAt.toISOString().slice(0, 10)}</time>
          <h1 className="katalog-item-name">{newsTitle(n, lang)}</h1>
          <hr className="katalog-item-rule" />
          <p className="story-page-text">{newsBody(n, lang)}</p>
        </div>
      </div>
    </section>
  );
}
