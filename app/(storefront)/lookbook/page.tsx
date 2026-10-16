import { getDict } from "@/lib/i18n-server";
import { BundleConfigurator } from "@/components/bundle-configurator";

export async function generateMetadata() {
  const { dict } = await getDict();
  return { title: `${dict.lookbookTitle} – Tod Cashmere` };
}

const storyImages = [
  "/images/front-view-woman-enjoying-time-beach.jpg",
  "/images/woman-holding-coffee-cup-front-view.jpg",
  "/images/woman-walking-beach-side-view.jpg",
  "/images/full-shot-woman-taking-walk-nature_23-2150100065.jpg",
];

export default async function LookbookPage() {
  const { dict } = await getDict();
  return (
    <>
      <link rel="stylesheet" href="/css/bundle.css" />
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
            <article className="story-card" key={storyImages[i]}>
              <div className="story-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={storyImages[i]} alt={story.title} loading="lazy" />
              </div>
              <div className="story-body">
                <div className="story-title">{story.title}</div>
                <p className="story-excerpt">{story.excerpt}</p>
                <a className="story-link" href="#">
                  {story.link}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
