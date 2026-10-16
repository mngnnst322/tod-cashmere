import Link from "next/link";
import Image from "next/image";
import {
  listCategories,
  getFeaturedProducts,
  getSaleProducts,
  getArrivalProducts,
} from "@/lib/products";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { ArrivalCard } from "@/components/arrival-card";
import { FaqAccordion } from "@/components/faq-accordion";
import { getDict } from "@/lib/i18n-server";

const storyImages = [
  "/images/front-view-woman-enjoying-time-beach.jpg",
  "/images/woman-holding-coffee-cup-front-view.jpg",
  "/images/woman-walking-beach-side-view.jpg",
  "/images/full-shot-woman-taking-walk-nature_23-2150100065.jpg",
];

export default async function HomePage() {
  const [categories, featured, sale, arrivals, { dict }] = await Promise.all([
    listCategories(),
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
          <h1 className="editorial-title">
            <span className="line-reveal">
              <span>{dict.introTitle1}</span>
            </span>
            <span className="line-reveal">
              <span>{dict.introTitle2}</span>
            </span>
          </h1>
          <p className="editorial-lead">{dict.introLead}</p>
        </div>
      </section>

      <section className="section" id="categories">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.categoriesTitle}</div>
            <div className="section-subtitle">{dict.categoriesSubtitle}</div>
          </div>
          <div className="section-actions">
            <Link href="/categories" className="section-link">
              {dict.viewAll}
            </Link>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="section" id="featured">
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

      <section className="section craftsmanship" id="craftsmanship">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.craftTitle}</div>
            <div className="section-subtitle">{dict.craftSubtitle}</div>
          </div>
          <div className="section-actions">
            <Link href="/craftsmanship" className="section-link">
              {dict.craftCta}
            </Link>
          </div>
        </div>
        <div className="container craftsmanship-inner">
          <div>
            <p className="craftsmanship-text">{dict.craftText}</p>
            <a className="btn btn-outline" href="#categories">
              {dict.craftCta}
            </a>
          </div>
          <div className="craftsmanship-list">
            {dict.craftItems.map((item) => (
              <div className="craftsmanship-item" key={item.label}>
                <div className="craftsmanship-label">{item.label}</div>
                <p className="craftsmanship-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section faq" id="faq">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.faqTitle}</div>
            <div className="section-subtitle">{dict.faqSubtitle}</div>
          </div>
        </div>
        <FaqAccordion />
      </section>

      <section className="newsletter" id="newsletter">
        <div className="section-header container">
          <div>
            <div className="section-title">{dict.newsletterTitle}</div>
            <div className="section-subtitle">{dict.newsletterSubtitle}</div>
          </div>
        </div>
        <div className="newsletter-inner">
          <div>
            <p className="newsletter-text">{dict.newsletterText}</p>
          </div>
          <form className="newsletter-form">
            <input type="email" name="email" placeholder={dict.emailPlaceholder} required />
            <button className="btn btn-primary" type="submit">
              {dict.subscribe}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
