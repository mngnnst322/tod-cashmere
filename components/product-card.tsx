import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "./add-to-cart-button";
import { formatPrice, discountPercent, isSoldOut } from "@/lib/products";
import { badgeLabel, productTitle } from "@/lib/i18n";
import { getDict } from "@/lib/i18n-server";
import type { products } from "@/lib/db/schema";

type Product = typeof products.$inferSelect;

export async function ProductCard({ product }: { product: Product }) {
  const { lang, dict } = await getDict();
  const title = productTitle(product, lang);
  const isOut = isSoldOut(product);
  return (
    <article className={`product-card ${isOut ? "is-out" : ""}`}>
      <div className="product-image">
        {product.badge && (
          <span className="product-tag">{badgeLabel(product.badge, dict)}</span>
        )}
        {product.compareAtPrice != null && (
          <span className="product-discount">
            -{discountPercent(product.price, product.compareAtPrice)}%
          </span>
        )}
        {isOut && <span className="product-badge">{dict.outOfStock}</span>}
        <Link className="product-link" href={`/product/${product.slug}`}>
          <Image
            src={product.image}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>
      </div>
      <div className="product-body">
        <div className="product-title">{title}</div>
        <div className="product-prices">
          <div className="product-price-current">
            {formatPrice(product.price)}
          </div>
          {product.compareAtPrice != null && (
            <div className="product-price-old">
              {formatPrice(product.compareAtPrice)}
            </div>
          )}
        </div>
        <div className="product-actions">
          {isOut ? (
            <div className="out-of-stock-text">{dict.outOfStock}</div>
          ) : (
            <AddToCartButton
              id={product.slug}
              title={title}
              price={product.price}
              image={product.image}
            />
          )}
        </div>
      </div>
    </article>
  );
}
