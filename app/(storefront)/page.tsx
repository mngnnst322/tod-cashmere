import Link from "next/link";
import Image from "next/image";
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
              <span className="shop-split-pill">
                {tile.label[lang]}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
