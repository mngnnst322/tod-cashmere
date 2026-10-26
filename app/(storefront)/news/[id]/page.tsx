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

const sourceLabel = { mn: "Эх сурвалж", en: "Source", ru: "Источник", zh: "来源" };

// One news post from Admin → Мэдээ: title, wide photo, text and a link to
// where it was first posted (e.g. Facebook).
export default async function NewsPage(props: PageProps<"/news/[id]">) {
  const { id } = await props.params;
  const [n, lang] = await Promise.all([getNews(id), getLang()]);
  if (!n) notFound();
  return (
    <article className="section news-article">
      <h1 className="news-article-title">{newsTitle(n, lang)}</h1>
      {n.image && (
        <div className="news-article-image">
          <Image
            src={n.image}
            unoptimized={isUploadedImage(n.image)}
            alt=""
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1100px"
          />
        </div>
      )}
      <div className="news-article-body">{newsBody(n, lang)}</div>
      {n.sourceUrl && (
        <a className="news-article-source" href={n.sourceUrl} target="_blank" rel="noopener noreferrer">
          {sourceLabel[lang]} ↗
        </a>
      )}
    </article>
  );
}
