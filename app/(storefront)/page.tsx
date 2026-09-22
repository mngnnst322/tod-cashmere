import Link from "next/link";
import {
  listCategories,
  getFeaturedProducts,
  getSaleProducts,
  getArrivalProducts,
} from "@/lib/products";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { ArrivalCard } from "@/components/arrival-card";
import { BundleConfigurator } from "@/components/bundle-configurator";
import { FaqAccordion } from "@/components/faq-accordion";

export default async function HomePage() {
  const [categories, featured, sale, arrivals] = await Promise.all([
    listCategories(),
    getFeaturedProducts(),
    getSaleProducts(),
    getArrivalProducts(),
  ]);

  return (
    <>
      <link rel="stylesheet" href="/css/bundle.css" />
      <section className="hero hero--video" id="home" aria-label="Tod Cashmere">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/front-view-woman-posing-beach_23-2150100135.jpg"
          aria-hidden="true"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </section>

      <section className="editorial" id="intro">
        <div className="editorial-inner editorial-block">
          <div className="editorial-eyebrow">Монгол говийн ноолуур</div>
          <h2 className="editorial-title">
            <span className="line-reveal">
              <span>Арьсанд зориулсан</span>
            </span>
            <span className="line-reveal">
              <span>инженерчлэлийн зөөлөн.</span>
            </span>
          </h2>
          <p className="editorial-lead">
            16 микроноос нарийн ширхэгт, гар түүврийн ноолуур. Улирал бүрд
            тансаг, өдөр бүрд эвтэйхэн.
          </p>
        </div>
      </section>

      <BundleConfigurator />

      <section className="section" id="categories">
        <div className="section-header">
          <div>
            <div className="section-title">Бүтээгдэхүүний төрөл</div>
            <div className="section-subtitle">Browse by category</div>
          </div>
          <div className="section-actions">
            <Link href="/categories" className="section-link">
              Бүгдийг харах
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
            <div className="section-title">Онцлох бараа</div>
            <div className="section-subtitle">
              Манай багийн шилдэг сонголт
            </div>
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
            <div className="section-title">Ноолууран гутал</div>
            <div className="section-subtitle">
              Tod Cashmere-ийн онцлох хямдрал
            </div>
          </div>
          <div className="section-actions">
            <Link href="/sale" className="section-link">
              Бүгдийг харах
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
            <div className="section-title">Шинэ бүтээгдэхүүн</div>
            <div className="section-subtitle">Шинэ силуэт, лимит капсул</div>
          </div>
          <div className="section-actions">
            <Link href="/arrivals" className="section-link">
              Бүгдийг харах
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
            <div className="section-title">Lookbook &amp; Stories</div>
            <div className="section-subtitle">
              Арьс, материал, стилингийн санаа
            </div>
          </div>
          <div className="section-actions">
            <Link href="/lookbook" className="section-link">
              Бүгдийг харах
            </Link>
          </div>
        </div>
        <div className="story-grid container">
          <article className="story-card">
            <div className="story-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/front-view-woman-enjoying-time-beach.jpg"
                alt="Өвөрмөц 16 микрон ноолуур"
                loading="lazy"
              />
            </div>
            <div className="story-body">
              <div className="story-title">Өвөрмөц 16 микрон ноолуур</div>
              <p className="story-excerpt">
                Хүйтэн уур амьсгалд хорог суусан тэмээн хянганы соргог
                ноосны маш нарийн ширхэглэлтэй түүхий эд.
              </p>
              <a className="story-link" href="#">
                Дэлгэрэнгүй →
              </a>
            </div>
          </article>
          <article className="story-card">
            <div className="story-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/woman-holding-coffee-cup-front-view.jpg"
                alt="Эко будаг, байгалийн өнгө"
                loading="lazy"
              />
            </div>
            <div className="story-body">
              <div className="story-title">Эко будаг, байгалийн өнгө</div>
              <p className="story-excerpt">
                Ус хэмнэх шинэ будаглах технологи нь өнгийг удаан хадгалж,
                арьсанд зөөлөн мэдрэмж төрүүлдэг.
              </p>
              <a className="story-link" href="#">
                Арчилгааны заавар →
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section craftsmanship" id="craftsmanship">
        <div className="section-header">
          <div>
            <div className="section-title">Ноолуурын ур дүй</div>
            <div className="section-subtitle">
              Чанар, арчилгааны тухай товч
            </div>
          </div>
          <div className="section-actions">
            <Link href="/craftsmanship" className="section-link">
              Каталог үзэх
            </Link>
          </div>
        </div>
        <div className="container craftsmanship-inner">
          <div>
            <p className="craftsmanship-text">
              Tod Cashmere нь гэр бүлийн жижиг үйлдвэрийн урам зоригтойгоор
              эхэлсэн бөгөөд өнөөдөр ч гэсэн хүний гарын дулаанаар хийсэн
              хэсэг бүрийг чанд нягталдаг.
            </p>
            <a className="btn btn-outline" href="#categories">
              Каталог үзэх
            </a>
          </div>
          <div className="craftsmanship-list">
            <div className="craftsmanship-item">
              <div className="craftsmanship-label">Hand Finished</div>
              <p className="craftsmanship-desc">
                Тус бүрийг гараар дуусгаж, материалын уян зөөлөн уналтыг
                хэвээр хадгалдаг.
              </p>
            </div>
            <div className="craftsmanship-item">
              <div className="craftsmanship-label">Traceable Fiber</div>
              <p className="craftsmanship-desc">
                Түүхий эд бүрийг хамтран ажилладаг малчдаас гаралтайг
                баталгаажуулна.
              </p>
            </div>
            <div className="craftsmanship-item">
              <div className="craftsmanship-label">Lifetime Aftercare</div>
              <p className="craftsmanship-desc">
                Бүх салбарт үнэгүй үсэрхийлтийн үйлчилгээ, уураар арчилгаа.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="info">
        <div className="section-header">
          <div>
            <div className="section-title">Туслах холбоосууд</div>
            <div className="section-subtitle">
              Support, policy, investor info
            </div>
          </div>
          <div className="section-actions">
            <Link href="/info" className="section-link">
              Бүгдийг харах
            </Link>
          </div>
        </div>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-title">Бидний тухай</div>
            <ul className="info-list">
              <li>
                <a href="#">Tod Cashmere-ийн тухай</a>
              </li>
              <li>
                <a href="#">Дэлгүүрийн байршил</a>
              </li>
              <li>
                <a href="#">Ноолуур арчилгаа</a>
              </li>
            </ul>
          </div>
          <div className="info-card">
            <div className="info-title">Үйлчилгээний нөхцөл</div>
            <ul className="info-list">
              <li>
                <a href="#">Үйлчилгээний нөхцөл</a>
              </li>
              <li>
                <a href="#">Бүртгэл, Хүргэлтийн нөхцөл</a>
              </li>
              <li>
                <a href="#">Нууцлалын баталгаа</a>
              </li>
              <li>
                <a href="#">Буцаах, Солих Журам</a>
              </li>
            </ul>
          </div>
          <div className="info-card">
            <div className="info-title">Хувьцаа эзэмшигчдэд</div>
            <ul className="info-list">
              <li>
                <a href="#">Компанийн засаглал</a>
              </li>
              <li>
                <a href="#">Төлөөлөн удирдах зөвлөл</a>
              </li>
              <li>
                <a href="#">Гүйцэтгэх удирдлага</a>
              </li>
              <li>
                <a href="#">Ногдол ашиг</a>
              </li>
              <li>
                <a href="#">Мэдээ, мэдээлэл</a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section faq" id="faq">
        <div className="section-header">
          <div>
            <div className="section-title">Түгээмэл асуултууд</div>
            <div className="section-subtitle">
              Ноолуур, хүргэлт, арчилгааны талаар
            </div>
          </div>
        </div>
        <FaqAccordion />
      </section>

      <section className="newsletter" id="newsletter">
        <div className="section-header container">
          <div>
            <div className="section-title">Мэдээлэл авч байх</div>
            <div className="section-subtitle">
              Шинэ бүтээгдэхүүн, хямдралын мэдээллийг түргэн авч байгаарай
            </div>
          </div>
        </div>
        <div className="newsletter-inner">
          <div>
            <p className="newsletter-text">
              Имэйлээ бүртгүүлээд Tod Cashmere-ийн шинэ бүтээгдэхүүн,
              хямдралын мэдээллийг түргэн шуурхай аваарай.
            </p>
          </div>
          <form className="newsletter-form">
            <input type="email" name="email" placeholder="Имэйл хаяг" required />
            <button className="btn btn-primary" type="submit">
              Бүртгүүлэх
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
