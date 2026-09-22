import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug, getRelatedProducts, formatPrice } from "@/lib/products";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.slug, 4);

  return (
    <>
      <section className="section">
        <div className="container product-detail-grid">
          <div className="product-detail-media">
            <Image
              src={product.image}
              alt={product.titleMn}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.badge && (
              <span className="product-tag">{product.badge}</span>
            )}
          </div>
          <div className="product-detail-info">
            <div className="pill-row">
              {product.badge === "Featured" && <span className="pill">Featured</span>}
              <span className="pill">{product.categorySlug}</span>
            </div>
            <h1 className="product-detail-title">{product.titleMn}</h1>
            <div className="product-detail-color">{product.color}</div>
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
                  title={product.titleMn}
                  price={product.price}
                  image={product.image}
                  className="btn btn-primary"
                />
              ) : (
                <div className="out-of-stock-text">Дууссан</div>
              )}
            </div>
            <div className="product-detail-meta">
              <div>
                Барааны код: <strong>{product.code}</strong>
              </div>
              <div>Collection: {product.collection}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">More to explore</div>
            <div className="section-subtitle">Төстэй бүтээгдэхүүнүүд</div>
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
