import Image from "next/image";
import { CATALOG_GROUPS, CATALOG_TYPES, listCatalog } from "@/lib/catalog";
import type { catalogItems } from "@/lib/db/schema";
import { KatalogIntro } from "@/components/katalog-intro";

export const metadata = { title: "Онлайн каталог – Tod Cashmere" };

type CatalogItem = typeof catalogItems.$inferSelect;

// Opens with two cover pages, then is laid out like the storefront home page.
// With ?type= (picked from the header menu) it lists just that garment type.
export default async function CatalogPage(props: PageProps<"/katalog">) {
  const { type } = await props.searchParams;
  const items = await listCatalog();

  if (typeof type === "string" && CATALOG_TYPES.includes(type)) {
    const typeItems = items.filter((i) => i.type === type);
    return (
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">{type}</div>
            <div className="section-subtitle">{typeItems.length} загвар</div>
          </div>
        </div>
        {typeItems.length > 0 ? (
          <CatalogGrid items={typeItems} />
        ) : (
          <p className="katalog-empty">Энэ төрлийн бараа удахгүй нэмэгдэнэ.</p>
        )}
      </section>
    );
  }

  const groups = CATALOG_GROUPS.map((g) => ({
    title: g.title,
    items: items.filter((i) => g.types.includes(i.type)),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <KatalogIntro />
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

      <div id="all">
        {groups.map((g) => (
          <section className="section" id={encodeURIComponent(g.title)} key={g.title}>
            <div className="section-header">
              <div>
                <div className="section-title">{g.title}</div>
                <div className="section-subtitle">{g.items.length} загвар</div>
              </div>
            </div>
            <CatalogGrid items={g.items} showType />
          </section>
        ))}

        {groups.length === 0 && (
          <section className="section">
            <p className="katalog-empty">Каталог удахгүй нэмэгдэнэ.</p>
          </section>
        )}
      </div>
    </>
  );
}

function CatalogGrid({ items, showType }: { items: CatalogItem[]; showType?: boolean }) {
  return (
    <div className="category-grid">
      {items.map((item) => (
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
          {showType && <div className="katalog-card-type">{item.type}</div>}
          <div className="katalog-card-name">{item.name}</div>
          {item.material && <div className="katalog-card-material">{item.material}</div>}
        </article>
      ))}
    </div>
  );
}
