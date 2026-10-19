import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/i18n-server";
import { STORY_IMAGES } from "@/lib/stories";

export async function generateMetadata(props: PageProps<"/lookbook/[n]">) {
  const { n } = await props.params;
  const { dict } = await getDict();
  const story = dict.stories[Number(n) - 1];
  return { title: story ? `${story.title} – Tod Cashmere` : "Tod Cashmere" };
}

// One lookbook story: its photo with the title and text beside it.
export default async function StoryPage(props: PageProps<"/lookbook/[n]">) {
  const { n } = await props.params;
  const i = Number(n) - 1;
  const { dict } = await getDict();
  const story = dict.stories[i];
  if (!story || !STORY_IMAGES[i]) notFound();

  return (
    <section className="section katalog-item story-page">
      <Link href="/lookbook" className="katalog-item-back">
        ← {dict.lookbookTitle}
      </Link>
      <div className="katalog-item-layout">
        <div className="katalog-item-image">
          <Image src={STORY_IMAGES[i]} alt={story.title} fill priority sizes="(max-width: 860px) 100vw, 640px" />
        </div>
        <div className="katalog-item-info">
          <div className="katalog-item-type">{dict.lookbookTitle}</div>
          <h1 className="katalog-item-name">{story.title}</h1>
          <hr className="katalog-item-rule" />
          <p className="story-page-text">{story.excerpt}</p>
        </div>
      </div>
    </section>
  );
}
