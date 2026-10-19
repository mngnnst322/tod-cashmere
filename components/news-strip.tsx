import Image from "next/image";
import Link from "next/link";
import { listPublicNews, newsTitle } from "@/lib/news";
import { getLang } from "@/lib/i18n-server";
import { isUploadedImage } from "@/lib/format";
import { CarouselRow } from "./carousel-row";

const heading = { mn: "Мэдээ, мэдээлэл", en: "News", ru: "Новости", zh: "新闻资讯" };

/** "Мэдээ, мэдээлэл": news posts from the admin, scrolling sideways above the footer. */
export async function NewsStrip() {
  const [posts, lang] = await Promise.all([listPublicNews(), getLang()]);
  if (posts.length === 0) return null;
  return (
    <section className="news-strip">
      <h2 className="news-strip-title">{heading[lang]}</h2>
      <CarouselRow auto>
        {posts.map((n) => (
          <Link key={n.id} href={`/news/${n.id}`} className="news-card">
            <div className="news-card-image">
              {n.image && (
                <Image
                  src={n.image}
                  unoptimized={isUploadedImage(n.image)}
                  alt=""
                  fill
                  sizes="(max-width: 860px) 50vw, 25vw"
                />
              )}
            </div>
            <div className="news-card-body">
              <time className="news-card-date">{n.createdAt.toISOString().slice(0, 10)}</time>
              <h3 className="news-card-title">{newsTitle(n, lang)}</h3>
            </div>
          </Link>
        ))}
      </CarouselRow>
    </section>
  );
}
