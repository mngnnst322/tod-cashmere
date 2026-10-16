import Link from "next/link";
import Image from "next/image";
import {
  getFeaturedProducts,
  getSaleProducts,
  getArrivalProducts,
} from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { ArrivalCard } from "@/components/arrival-card";
import { getDict } from "@/lib/i18n-server";

const shopLabels = {
  mn: { women: "Эмэгтэй дэлгүүр", men: "Эрэгтэй дэлгүүр" },
  en: { women: "Shop women", men: "Shop men" },
  ru: { women: "Женщинам", men: "Мужчинам" },
  zh: { women: "女士系列", men: "男士系列" },
};

// Garment-type tiles under the gender pair.
const shopTiles = [
  {
    href: "/search?q=цамц",
    image: "/images/front-view-woman-posing-beach_23-2150100135.jpg",
    label: { mn: "Цамц", en: "Sweaters", ru: "Свитеры", zh: "毛衣" },
  },
  {
    href: "/categories",
    image: "/images/smiley-woman-beach-front-view_23-2150100099.avif",
    label: { mn: "Аксессуар", en: "Accessories", ru: "Аксессуары", zh: "配饰" },
  },
  {
    href: "/search?q=кардиган",
    image: "/images/woman-walking-beach-side-view.jpg",
    label: { mn: "Кардиган", en: "Cardigans", ru: "Кардиганы", zh: "开衫" },
  },
  {
    href: "/search?q=пальто",
    image: "/images/full-shot-woman-taking-walk-nature_23-2150100065.jpg",
    label: { mn: "Пальто", en: "Coats", ru: "Пальто", zh: "大衣" },
  },
];

const storyImages = [
  "/images/front-view-woman-enjoying-time-beach.jpg",
  "/images/woman-holding-coffee-cup-front-view.jpg",
  "/images/woman-walking-beach-side-view.jpg",
  "/images/full-shot-woman-taking-walk-nature_23-2150100065.jpg",
];

export default async function HomePage() {
  const [featured, sale, arrivals, { lang, dict }] = await Promise.all([
    getFeaturedProducts(),
    getSaleProducts(),
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
        <div className="hero-photo-content">
          <div className="editorial-eyebrow">{dict.introEyebrow}</div>
          <p className="editorial-lead">{dict.introLead}</p>
        </div>
      </section>

      <section className="section section--centered-title" id="featured">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.featuredTitle}</div>
            <div className="section-subtitle">{dict.featuredSubtitle}</div>
          </div>
        </div>
        <div className="product-row">
          <div className="product-list">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Shop by gender, then by category: full-bleed photo tiles. */}
      <section className="shop-split" id="categories">
        <div className="shop-split-pair">
          <Link href="/categories#women" className="shop-split-tile">
            <Image src="/images/emegtei.png" alt="" fill sizes="50vw" />
            <span className="shop-split-label">{shopLabels[lang].women}</span>
          </Link>
          <Link href="/categories#men" className="shop-split-tile">
            <Image src="/images/eregtei.png" alt="" fill sizes="50vw" />
            <span className="shop-split-label">{shopLabels[lang].men}</span>
          </Link>
        </div>
        <div className="shop-split-cats">
          {shopTiles.map((tile) => (
            <Link key={tile.href} href={tile.href} className="shop-split-cat">
              <Image src={tile.image} alt="" fill sizes="(max-width: 760px) 50vw, 25vw" />
              <span className="shop-split-pill">{tile.label[lang]}</span>
            </Link>
          ))}
        </div>
      </section>


      <section className="section" id="sale">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.saleTitle}</div>
            <div className="section-subtitle">{dict.saleSubtitle}</div>
          </div>
          <div className="section-actions">
            <Link href="/sale" className="section-link">
              {dict.viewAll}
            </Link>
          </div>
        </div>
        <div className="product-row">
          <div className="product-list">
            {sale.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted" id="arrivals">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.arrivalsTitle}</div>
            <div className="section-subtitle">{dict.arrivalsSubtitle}</div>
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

      <section className="section" id="lookbook">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.lookbookTitle}</div>
            <div className="section-subtitle">{dict.lookbookSubtitle}</div>
          </div>
          <div className="section-actions">
            <Link href="/lookbook" className="section-link">
              {dict.viewAll}
            </Link>
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
