import { getSaleProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { getDict } from "@/lib/i18n-server";

export async function generateMetadata() {
  const { dict } = await getDict();
  return { title: `${dict.sale} – Tod Cashmere` };
}

export default async function SalePage() {
  const [products, { dict }] = await Promise.all([
    getSaleProducts(),
    getDict(),
  ]);
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
