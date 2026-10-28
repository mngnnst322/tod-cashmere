import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  listCategories,
  isSoldOut,
} from "@/lib/products";
import { SizeBuyBox } from "@/components/size-buy-box";
import { ProductCard } from "@/components/product-card";
import {
  badgeLabel,
  categoryName,
  productColor,
  productTitle,
} from "@/lib/i18n";
import { getDict } from "@/lib/i18n-server";
import { getPricing } from "@/lib/pricing";
import { modelNote } from "@/lib/model-note";
import { measurementRows } from "@/lib/measurements";

const measureTitle = { mn: "Хэмжилт", en: "Measurements", ru: "Замеры", zh: "尺寸" };
import { formatMoney } from "@/lib/money";
import { CatalogGallery } from "@/components/catalog-gallery";
import { itemImages } from "@/lib/catalog";

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, categories, { lang, dict }, pricing] = await Promise.all([
    getRelatedProducts(product.slug, 4),
    listCategories(),
    getDict(),
    getPricing(),
  ]);
  const title = productTitle(product, lang);
  const category = categories.find((c) => c.slug === product.categorySlug);
  const collectionLabel =
    product.collection === "arrival"
      ? dict.collectionArrival
      : product.collection === "catalog"
        ? dict.collectionCatalog
        : product.collection;

  return (
    <>
      {/* Same layout as a catalog item: large photo left, details right. */}
      <section className="section katalog-item product-page">
        <div className="katalog-item-layout">
          <CatalogGallery images={itemImages(product)} alt={title}>
            {product.badge && (
              <span className="product-tag">{badgeLabel(product.badge, dict)}</span>
            )}
          </CatalogGallery>
          <div className="katalog-item-info">
            <div className="katalog-item-type">
              {category ? categoryName(category, lang) : product.categorySlug}
            </div>
            <h1 className="katalog-item-name">{title}</h1>
            <div className="katalog-item-material">{productColor(product, lang)}</div>
            <div className="product-page-prices">
              <span className="product-page-price">{formatMoney(product.price, pricing)}</span>
              {product.compareAtPrice != null && (
                <s className="product-page-old">{formatMoney(product.compareAtPrice, pricing)}</s>
              )}
            </div>
            <hr className="katalog-item-rule" />
            {measurementRows(product.measurements, lang).length > 0 && (
              <div className="katalog-item-option product-measure">
                <div className="katalog-item-label">{measureTitle[lang]}</div>
                <dl className="measure-table">
                  {measurementRows(product.measurements, lang).map((r) => (
                    <div key={r.label}>
                      <dt>{r.label}</dt>
                      <dd>{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {modelNote(product, lang) && <p className="model-note">{modelNote(product, lang)}</p>}
            {!isSoldOut(product) ? (
              <SizeBuyBox
                slug={product.slug}
                title={title}
                price={product.price}
                image={product.image}
                sizes={product.sizes}
              />
            ) : (
              <div className="out-of-stock-text">{dict.outOfStock}</div>
            )}
            <div className="product-page-meta">
              <div>
                {dict.productCode}: {product.code}
              </div>
              <div>
                {dict.collection}: {collectionLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.relatedTitle}</div>
            <div className="section-subtitle">{dict.relatedSubtitle}</div>
          </div>
        </div>
        <div className="product-row">
          <div className="product-list">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
