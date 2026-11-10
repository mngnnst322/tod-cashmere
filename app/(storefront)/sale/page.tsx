import { getSaleProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { getDict } from "@/lib/i18n-server";

export async function generateMetadata() {
  const { dict } = await getDict();
  return { title: `${dict.sale} – Tod Cashmere` };
}

// `?gender=women|men` narrows the list (used by the home page photo blocks).
// Products have no gender of their own: men's items sit in the "men"
// category and everything else counts as women's.
export default async function SalePage({ searchParams }: PageProps<"/sale">) {
  const { gender } = await searchParams;
  const [all, { dict }] = await Promise.all([getSaleProducts(), getDict()]);
  const products =
    gender === "men"
      ? all.filter((p) => p.categorySlug === "men")
      : gender === "women"
        ? all.filter((p) => p.categorySlug !== "men")
        : all;
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">{dict.saleTitle}</div>
          <div className="section-subtitle">{dict.saleSubtitle}</div>
        </div>
      </div>
      <div className="product-row">
        <div className="product-list">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
