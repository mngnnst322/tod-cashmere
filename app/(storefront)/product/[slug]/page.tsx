import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  listCategories,
  formatPrice,
  isSoldOut,
} from "@/lib/products";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import {
  badgeLabel,
  categoryName,
  productColor,
  productTitle,
} from "@/lib/i18n";
import { getDict } from "@/lib/i18n-server";
import { ZoomImage } from "@/components/zoom-image";

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, categories, { lang, dict }] = await Promise.all([
    getRelatedProducts(product.slug, 5),
    listCategories(),
    getDict(),
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
          <div className="katalog-item-image">
            <ZoomImage src={product.image} alt={title} />
            {product.badge && (
              <span className="product-tag">{badgeLabel(product.badge, dict)}</span>
            )}
          </div>
          <div className="katalog-item-info">
            <div className="katalog-item-type">
              {category ? categoryName(category, lang) : product.categorySlug}
            </div>
            <h1 className="katalog-item-name">{title}</h1>
            <div className="katalog-item-material">{productColor(product, lang)}</div>
            <div className="product-page-prices">
              <span className="product-page-price">{formatPrice(product.price)}</span>
              {product.compareAtPrice != null && (
                <s className="product-page-old">{formatPrice(product.compareAtPrice)}</s>
              )}
            </div>
            <hr className="katalog-item-rule" />
            <div className="product-detail-actions">
              {!isSoldOut(product) ? (
                <AddToCartButton
                  id={product.slug}
                  title={title}
                  price={product.price}
                  image={product.image}
                  className="btn btn-primary product-page-cart"
                />
              ) : (
                <div className="out-of-stock-text">{dict.outOfStock}</div>
              )}
            </div>
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
