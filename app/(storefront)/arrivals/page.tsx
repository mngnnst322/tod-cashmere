import { getArrivalProducts } from "@/lib/products";
import { ArrivalCard } from "@/components/arrival-card";

export const metadata = { title: "Шинэ бүтээгдэхүүн – Tod Cashmere" };

export default async function ArrivalsPage() {
  const products = await getArrivalProducts();
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">Шинэ бүтээгдэхүүн</div>
          <div className="section-subtitle">Шинэ силуэт, лимит капсул</div>
        </div>
      </div>
      <div className="arrivals-grid container">
        {products.map((product) => (
          <ArrivalCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
