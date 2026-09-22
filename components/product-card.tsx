import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "./add-to-cart-button";
import { formatPrice, discountPercent } from "@/lib/products";
import type { products } from "@/lib/db/schema";

type Product = typeof products.$inferSelect;

export function ProductCard({ product }: { product: Product }) {
  const isOut = !product.inStock;
  return (
    <article className={`product-card ${isOut ? "is-out" : ""}`}>
      <div className="product-image">
        {product.badge && <span className="product-tag">{product.badge}</span>}
        {product.compareAtPrice != null && (
          <span className="product-discount">
            -{discountPercent(product.price, product.compareAtPrice)}%
          </span>
        )}
        {isOut && <span className="product-badge">Дууссан</span>}
        <Link className="product-link" href={`/product/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.titleMn}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>
      </div>
      <div className="product-body">
        <div className="product-title">{product.titleMn}</div>
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
            <div className="out-of-stock-text">Дууссан</div>
          ) : (
            <AddToCartButton
              id={product.slug}
              title={product.titleMn}
              price={product.price}
              image={product.image}
            />
          )}
        </div>
      </div>
    </article>
  );
}
