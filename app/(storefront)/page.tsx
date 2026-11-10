import Link from "next/link";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import {
  getArrivalProducts,
} from "@/lib/products";
import { ArrivalCard } from "@/components/arrival-card";
import { getDict } from "@/lib/i18n-server";

const shopLabels = {
  mn: { women: "Эмэгтэй дэлгүүр", men: "Эрэгтэй дэлгүүр" },
  en: { women: "Shop women", men: "Shop men" },
  ru: { women: "Женщинам", men: "Мужчинам" },
  zh: { women: "女士系列", men: "男士系列" },
};

// Brand statement under the hero photo.
const madeIn = {
  mn: { eyebrow: "Монголд үйлдвэрлэв", title: "Монголын хээр тал, нүүдэлчдийн өв соёлоос таны гарт" },
  en: { eyebrow: "Made in Mongolia", title: "From the Mongolian steppe and nomadic heritage to your hands" },
  ru: { eyebrow: "Сделано в Монголии", title: "Из монгольской степи и наследия кочевников — в ваши руки" },
  zh: { eyebrow: "蒙古制造", title: "从蒙古草原与游牧传承，到您手中" },
};

const serif = Cormorant_Garamond({ subsets: ["latin", "cyrillic"], weight: ["400", "500"] });

// Photo blocks under the brand line: one large photo beside two small ones,
// women with the large photo on the left, men with it on the right.
const lookLabels = {
  mn: { women: "Эмэгтэй", men: "Эрэгтэй", sale: "Sale" },
  en: { women: "Women", men: "Men", sale: "Sale" },
  ru: { women: "Женщинам", men: "Мужчинам", sale: "Sale" },
  zh: { women: "女士", men: "男士", sale: "Sale" },
};

const lookBlocks = [
  {
    key: "women",
    href: "/categories#women",
    large: "/images/front-view-woman-posing-beach_23-2150100135.jpg",
    small: ["/images/woman-holding-coffee-cup-front-view.jpg", "/images/woman-walking-beach-side-view.jpg"],
  },
  {
    key: "men",
    href: "/categories#men",
    large: "/images/eregtei.png",
    // Only one men's photo so far; the small tiles show crops of it.
    small: ["/images/eregtei.png", "/images/eregtei.png"],
  },
] as const;



export default async function HomePage() {
  const [arrivals, { lang, dict }] = await Promise.all([
    getArrivalProducts(),
    getDict(),
  ]);

  return (
    <>
      {/* `hero--video` lets the header float transparently over the photo. */}
      <section className="hero hero--video hero--photo" id="intro">
        <Image
          className="hero-photo"
          src="/images/front-view-woman-enjoying-time-beach.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-photo-shade" aria-hidden="true" />
      </section>

      <section className="made-in">
        <p className="made-in-eyebrow">Cashmere Mongolia {madeIn[lang].eyebrow}</p>
        <h2 className={`made-in-title ${serif.className}`}>{madeIn[lang].title}</h2>
      </section>

      <section className="look-blocks">
        {lookBlocks.map((block, i) => (
          <div key={block.key} className={`look-block ${i % 2 ? "is-flipped" : ""}`}>
            <Link href={block.href} className="look-tile look-tile--large">
              <Image src={block.large} alt="" fill sizes="(max-width: 760px) 100vw, 58vw" />
              <span className="shop-split-label">{lookLabels[lang][block.key]}</span>
            </Link>
            {/* Top: that gender's sale items; bottom: that gender's shop. */}
            {block.small.map((src, j) => (
              <Link
                key={j}
                href={j === 0 ? `/sale?gender=${block.key}` : block.href}
                className={`look-tile look-tile--small look-tile--${j}`}
              >
                <Image src={src} alt="" fill sizes="(max-width: 760px) 50vw, 42vw" />
                <span className="shop-split-label">
                  {j === 0 ? lookLabels[lang].sale : shopLabels[lang][block.key]}
                </span>
              </Link>
            ))}
          </div>
        ))}
      </section>

      <section className="section section-muted section--centered-title" id="arrivals">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.arrivalsTitle}</div>
          </div>
          <div className="section-actions">
            <Link href="/arrivals" className="section-link">
              {dict.viewAll}
            </Link>
          </div>
        </div>
        <div className="arrivals-grid container">
          {arrivals.map((product) => (
            <ArrivalCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </>
  );
}
