import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "./add-to-cart-button";
import { formatPrice } from "@/lib/products";
import type { products } from "@/lib/db/schema";

type Product = typeof products.$inferSelect;

export function ArrivalCard({ product }: { product: Product }) {
  return (
    <article className="arrival-card">
      <div className="arrival-image">
        <Link className="product-link" href={`/product/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.titleMn}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>
      </div>
      <div className="arrival-body">
        <div className="arrival-meta">{product.color}</div>
        {product.badge === "Онцлох" && (
          <div className="product-flag">Онцлох</div>
        )}
        <div className="arrival-title">{product.titleMn}</div>
        <div className="arrival-price">{formatPrice(product.price)}</div>
        <div className="arrival-actions">
          <AddToCartButton
            id={product.slug}
            title={product.titleMn}
            price={product.price}
            image={product.image}
          />
        </div>
      </div>
    </article>
  );
}
