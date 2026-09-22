import { getSaleProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const metadata = { title: "Хямдрал – Tod Cashmere" };

export default async function SalePage() {
  const products = await getSaleProducts();
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">Ноолууран гутал</div>
          <div className="section-subtitle">
            Tod Cashmere-ийн онцлох хямдрал
          </div>
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
