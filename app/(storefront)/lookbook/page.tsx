import Link from "next/link";
import { getDict } from "@/lib/i18n-server";
import { STORY_IMAGES } from "@/lib/stories";
import { BundleConfigurator } from "@/components/bundle-configurator";

export async function generateMetadata() {
  const { dict } = await getDict();
  return { title: `${dict.lookbookTitle} – Tod Cashmere` };
}


export default async function LookbookPage() {
  const { dict } = await getDict();
  return (
    <>
      <link rel="stylesheet" href={`/css/bundle.css?v=${process.env.NEXT_PUBLIC_ASSET_VERSION}`} />
      {/* The "build the look" bundle sits at the top of the lookbook. */}
      <BundleConfigurator />
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.lookbookTitle}</div>
            <div className="section-subtitle">{dict.lookbookSubtitle}</div>
          </div>
        </div>
        <div className="story-grid container">
          {dict.stories.map((story, i) => (
            <Link href={`/lookbook/${i + 1}`} className="story-card" key={STORY_IMAGES[i]}>
              <div className="story-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={STORY_IMAGES[i]} alt={story.title} loading="lazy" />
              </div>
              <div className="story-body">
                <div className="story-title">{story.title}</div>
                <p className="story-excerpt">{story.excerpt}</p>
                <span className="story-link">{story.link}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
