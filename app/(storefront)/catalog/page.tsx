import Image from "next/image";
import { listCatalog, listCatalogTypes } from "@/lib/catalog";
import { catalogItemName, catalogStrings, catalogTypeName } from "@/lib/catalog-i18n";
import { getLang } from "@/lib/i18n-server";
import { KatalogIntro } from "@/components/katalog-intro";
import { CatalogGrid } from "@/components/catalog-grid";
import { KatalogBackdrop, backdropFor } from "@/components/katalog-backdrop";

export async function generateMetadata() {
  const s = catalogStrings(await getLang());
  return { title: `${s.eyebrow} – Tod Cashmere` };
}

const GENDERS = ["women", "men", "all"] as const;
type MenuGender = (typeof GENDERS)[number];
const isMenuGender = (v: unknown): v is MenuGender => GENDERS.includes(v as MenuGender);

// Opens with two cover pages, then is laid out like the storefront home page.
// The header leads to filtered lists: ?gender= (and &type=), ?q= search and
// ?saved=1 for the items this browser has hearted.
export default async function CatalogPage(props: PageProps<"/catalog">) {
  const [{ gender, type, name, q, saved }, items, types, lang] = await Promise.all([
    props.searchParams,
    listCatalog(),
    listCatalogTypes(),
    getLang(),
  ]);
  const s = catalogStrings(lang);
  // Type names in menu order: a gender's own, or both (women's first) for "all".
  const typeNames = (g: string) => {
    const genders = g === "all" ? ["women", "men"] : [g];
    return [
      ...new Set(genders.flatMap((x) => types.filter((t) => t.gender === x).map((t) => t.name))),
    ];
  };

  if (saved === "1") {
    return (
      <Listing title={s.saved}>
        <KatalogBackdrop index={3} />
        <CatalogGrid items={items} strings={s} lang={lang} savedOnly />
      </Listing>
    );
  }

  if (typeof q === "string" && q.trim()) {
    const needle = q.trim().toLowerCase();
    const matches = items.filter((i) =>
      [
        i.name,
        catalogItemName(i.name, lang),
        i.material,
        i.colors,
        i.type,
        catalogTypeName(i.type, lang),
      ].some((v) => v.toLowerCase().includes(needle)),
    );
    return (
      <Listing title={`${s.searchResults}: “${q.trim()}”`} subtitle={`${matches.length} ${s.styles}`}>
        <KatalogBackdrop index={backdropFor(q)} />
        {matches.length > 0 && <CatalogGrid items={matches} strings={s} lang={lang} />}
      </Listing>
    );
  }

  // A menu pick lists matching items, by type in that gender's menu order.
  if (isMenuGender(gender)) {
    const order = typeNames(gender);
    const pickedType = typeof type === "string" && order.includes(type) ? type : null;
    // A style name picked in the dropdown narrows to items with that name.
    const pickedName = pickedType && typeof name === "string" ? name : null;
    const matches = items.filter(
      (i) => (gender === "all" || i.gender === gender) && (!pickedName || i.name === pickedName),
    );
    const sections = (pickedType ? [pickedType] : order)
      .map((t) => ({ type: t, items: matches.filter((i) => i.type === t) }))
      .filter((sec) => pickedType || sec.items.length > 0);

    return (
      <>
        {/* Each type gets its own strip (by its place among all types). */}
        <KatalogBackdrop
          index={pickedType ? typeNames("all").indexOf(pickedType) : gender === "men" ? 1 : 2}
        />
        {sections.map((sec) => (
          <Listing
            key={sec.type}
            title={`${s[gender]} · ${pickedName ? catalogItemName(pickedName, lang) : catalogTypeName(sec.type, lang)}`}
            subtitle={`${sec.items.length} ${s.styles}`}
          >
            {sec.items.length > 0 && <CatalogGrid items={sec.items} strings={s} lang={lang} />}
          </Listing>
        ))}
      </>
    );
  }

  const groups = typeNames("all").map((t) => ({
    type: t,
    items: items.filter((i) => i.type === t),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <KatalogIntro hint={s.introHint} nextLabel={s.nextPage} />
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
          <div className="editorial-eyebrow">{s.eyebrow}</div>
          <h1 className="editorial-title">
            <span className="line-reveal">
              <span>{s.title1}</span>
            </span>
            <span className="line-reveal">
              <span>{s.title2}</span>
            </span>
          </h1>
          <p className="editorial-lead">{s.lead}</p>
        </div>
      </section>

      <KatalogBackdrop index={0} />
      {groups.map((g) => (
        <Listing
          key={g.type}
          title={catalogTypeName(g.type, lang)}
          subtitle={`${g.items.length} ${s.styles}`}
        >
          <CatalogGrid items={g.items} strings={s} lang={lang} />
        </Listing>
      ))}
    </>
  );
}

function Listing({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="section katalog-section">
      <div className="section-header">
        <div>
          <div className="section-title">{title}</div>
          {subtitle && <div className="section-subtitle">{subtitle}</div>}
        </div>
      </div>
      {children}
    </section>
  );
}
