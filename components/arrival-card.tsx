import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "./add-to-cart-button";
import { formatPrice } from "@/lib/products";
import { badgeLabel, productColor, productTitle } from "@/lib/i18n";
import { getDict } from "@/lib/i18n-server";
import type { products } from "@/lib/db/schema";
import { isUploadedImage } from "@/lib/format";

type Product = typeof products.$inferSelect;

export async function ArrivalCard({ product }: { product: Product }) {
  const { lang, dict } = await getDict();
  const title = productTitle(product, lang);
  return (
    <article className="arrival-card">
      <div className="arrival-image">
        <Link className="product-link" href={`/product/${product.slug}`}>
          <Image
            src={product.image}
            unoptimized={isUploadedImage(product.image)}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>
      </div>
      <div className="arrival-body">
        <div className="arrival-meta">{productColor(product, lang)}</div>
        {product.badge === "Онцлох" && (
          <div className="product-flag">{badgeLabel(product.badge, dict)}</div>
        )}
        <div className="arrival-title">{title}</div>
        <div className="arrival-price">{formatPrice(product.price)}</div>
        <div className="arrival-actions">
          <AddToCartButton
            id={product.slug}
            title={title}
            price={product.price}
            image={product.image}
          />
        </div>
      </div>
    </article>
  );
}
