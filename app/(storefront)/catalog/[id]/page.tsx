import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalogItem, itemImages, listCatalog } from "@/lib/catalog";
import {
  catalogItemName,
  catalogMaterial,
  catalogStrings,
  catalogTypeName,
} from "@/lib/catalog-i18n";
import { getLang } from "@/lib/i18n-server";
import { findCashmereColor, numberColorOn, splitColors } from "@/lib/catalog-colors";
import { CatalogGrid, CatalogItemHeart } from "@/components/catalog-grid";
import { CatalogGallery } from "@/components/catalog-gallery";
import { KatalogBackdrop, backdropFor } from "@/components/katalog-backdrop";

export async function generateMetadata(props: PageProps<"/catalog/[id]">) {
  const { id } = await props.params;
  const [item, lang] = await Promise.all([getCatalogItem(id), getLang()]);
  return {
    title: item
      ? `${catalogItemName(item.name, lang)} – Tod Cashmere`
      : "Tod Cashmere",
  };
}

// One catalog item: a large photo on the left and the details entered in
// Admin → Каталог beside it on the right (stacked, photo first, on phones).
export default async function CatalogItemPage(
  props: PageProps<"/catalog/[id]">,
) {
  const { id } = await props.params;
  const [item, lang, all] = await Promise.all([
    getCatalogItem(id),
    getLang(),
    listCatalog(),
  ]);
  if (!item) notFound();
  const gallery = itemImages(item);
  // Similar items: same type for the same gender, shown below the item.
  const similar = all.filter(
    (i) => i.id !== item.id && i.type === item.type && i.gender === item.gender,
  );
  const s = catalogStrings(lang);

  return (
    <>
      <section className="section katalog-item">
        <KatalogBackdrop index={backdropFor(item.id)} />
        <Link href="/catalog?gender=all" className="katalog-item-back">
          ← {s.back}
        </Link>
        <div className="katalog-item-layout">
          <CatalogGallery images={gallery} alt={catalogItemName(item.name, lang)}>
          <CatalogItemHeart id={item.id} strings={s} />
        </CatalogGallery>
          <div className="katalog-item-info">
            <div className="katalog-item-type">
              {catalogTypeName(item.type, lang)}
            </div>
            <h1 className="katalog-item-name">
              {catalogItemName(item.name, lang)}
            </h1>
            {item.material && (
              <div className="katalog-item-material">
                {catalogMaterial(item.material, lang)}
              </div>
            )}
            <hr className="katalog-item-rule" />
            {item.colors && (
              <div className="katalog-item-option">
                <div className="katalog-item-label">
                  {s.color}
                </div>
                <div className="katalog-swatches">
                  {splitColors(item.colors).map((c) => {
                    const color = findCashmereColor(c);
                    return color ? (
                      <span
                        key={c}
                        className="katalog-swatch katalog-swatch--code"
                        style={{ background: color.hex, color: numberColorOn(color.hex) }}
                        title={color.names[lang]}
                      >
                        {color.code}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            {item.sizes && (
              <div className="katalog-item-option">
                <div className="katalog-item-label">{s.size}</div>
                <div className="katalog-sizes">
                  {item.sizes
                    .split("/")
                    .map((z) => z.trim())
                    .filter(Boolean)
                    .map((z) => (
                      <span key={z} className="katalog-size">
                        {z}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {similar.length > 0 && (
        <section className="section katalog-section">
          <div className="section-header">
            <div>
              <div className="section-title">{s.similar}</div>
            </div>
          </div>
          <CatalogGrid items={similar} strings={s} lang={lang} carousel />
        </section>
      )}
    </>
  );
}
