import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getProductBySlug,
  getRelatedProducts,
  listCategories,
  formatPrice,
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

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, categories, { lang, dict }] = await Promise.all([
    getRelatedProducts(product.slug, 4),
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
      <section className="section">
        <div className="container product-detail-grid">
          <div className="product-detail-media">
            <Image
              src={product.image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.badge && (
              <span className="product-tag">
                {badgeLabel(product.badge, dict)}
              </span>
            )}
          </div>
          <div className="product-detail-info">
            <div className="pill-row">
              {product.badge === "Онцлох" && (
                <span className="pill">{badgeLabel(product.badge, dict)}</span>
              )}
              <span className="pill">
                {category ? categoryName(category, lang) : product.categorySlug}
              </span>
            </div>
            <h1 className="product-detail-title">{title}</h1>
            <div className="product-detail-color">
              {productColor(product, lang)}
            </div>
            <div className="product-detail-prices">
              <div className="product-price-current">
                {formatPrice(product.price)}
              </div>
              {product.compareAtPrice != null && (
                <div className="product-price-old">
                  {formatPrice(product.compareAtPrice)}
                </div>
              )}
            </div>
            <div className="product-detail-actions">
              {product.inStock ? (
                <AddToCartButton
                  id={product.slug}
                  title={title}
                  price={product.price}
                  image={product.image}
                  className="btn btn-primary"
                />
              ) : (
                <div className="out-of-stock-text">{dict.outOfStock}</div>
              )}
            </div>
            <div className="product-detail-meta">
              <div>
                {dict.productCode}: <strong>{product.code}</strong>
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
