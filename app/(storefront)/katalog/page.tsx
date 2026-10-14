import Image from "next/image";
import Link from "next/link";
import { CATALOG_TYPES, listCatalog } from "@/lib/catalog";

export const metadata = { title: "Онлайн каталог – Tod Cashmere" };

// Laid out like the storefront home page: a full-screen photo hero, then one
// section per garment type.
export default async function CatalogPage() {
  const items = await listCatalog();
  const groups = CATALOG_TYPES.map((type) => ({
    type,
    items: items.filter((i) => i.type === type),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <header className="katalog-header">
        <Link href="/katalog" className="katalog-brand">
          TOD CASHMERE
        </Link>
        {groups.length > 0 && (
          <nav className="katalog-nav">
            {groups.map((g) => (
              <a key={g.type} href={`#${encodeURIComponent(g.type)}`}>
                {g.type}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section className="hero hero--video hero--photo">
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
          <div className="editorial-eyebrow">Онлайн каталог</div>
          <h1 className="editorial-title">
            <span className="line-reveal">
              <span>Монгол говийн</span>
            </span>
            <span className="line-reveal">
              <span>ноолуур.</span>
            </span>
          </h1>
          <p className="editorial-lead">
            Монголын хээр тал, нүүдэлчдийн соёлоос таны гарт.
          </p>
        </div>
      </section>

      {groups.map((g) => (
        <section className="section" id={encodeURIComponent(g.type)} key={g.type}>
          <div className="section-header">
            <div>
              <div className="section-title">{g.type}</div>
              <div className="section-subtitle">{g.items.length} загвар</div>
            </div>
          </div>
          <div className="category-grid">
            {g.items.map((item) => (
              <article className="katalog-card" key={item.id}>
                <div className="katalog-card-image">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 300px"
                    />
                  )}
                </div>
                <div className="katalog-card-name">{item.name}</div>
                {item.material && (
                  <div className="katalog-card-material">{item.material}</div>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}

      {groups.length === 0 && (
        <section className="section">
          <p className="katalog-empty">Каталог удахгүй нэмэгдэнэ.</p>
        </section>
      )}

      <footer className="katalog-footer">© Tod Cashmere</footer>
    </>
  );
}
