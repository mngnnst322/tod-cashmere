import { getArrivalProducts } from "@/lib/products";
import { ArrivalCard } from "@/components/arrival-card";
import { getDict } from "@/lib/i18n-server";

export async function generateMetadata() {
  const { dict } = await getDict();
  return { title: `${dict.arrivalsTitle} – Tod Cashmere` };
}

export default async function ArrivalsPage() {
  const [products, { dict }] = await Promise.all([
    getArrivalProducts(),
    getDict(),
  ]);
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">{dict.arrivalsTitle}</div>
          <div className="section-subtitle">{dict.arrivalsSubtitle}</div>
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
