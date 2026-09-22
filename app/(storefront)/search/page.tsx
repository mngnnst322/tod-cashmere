import { listProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default async function SearchPage(props: PageProps<"/search">) {
  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q.trim().toLowerCase() : "";
  const all = await listProducts();
  const results = query
    ? all.filter((p) => p.titleMn.toLowerCase().includes(query))
    : [];

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">Хайлт</div>
          <div className="section-subtitle">
            {query ? `"${query}" — ${results.length} үр дүн` : "Хайх үгээ оруулна уу"}
          </div>
        </div>
      </div>
      <div className="product-row">
        <div className="product-list">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
