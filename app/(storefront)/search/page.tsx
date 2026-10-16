import { listProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { fmt } from "@/lib/i18n";
import { getDict } from "@/lib/i18n-server";

export default async function SearchPage(props: PageProps<"/search">) {
  const { q, min, max } = await props.searchParams;
  const query = typeof q === "string" ? q.trim().toLowerCase() : "";
  // ?min=&max= (the menu's gift price ranges) filter by price.
  const lo = Number(min);
  const hi = Number(max);
  const byPrice = typeof min === "string" && typeof max === "string" && hi > lo;
  const [all, { dict }] = await Promise.all([listProducts(), getDict()]);
  // Match against every language so a search works whichever one is active.
  const results = byPrice
    ? all.filter((p) => p.price >= lo && p.price <= hi)
    : query
      ? all.filter((p) =>
          [p.titleMn, p.titleEn, p.titleRu, p.titleZh].some((title) =>
            title?.toLowerCase().includes(query),
          ),
        )
      : [];
  const priceRange = `${lo.toLocaleString("en-US")}–${hi.toLocaleString("en-US")}₮`;

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">{dict.searchTitle}</div>
          <div className="section-subtitle">
            {byPrice
              ? fmt(dict.searchResults, { query: priceRange, count: results.length })
              : query
                ? fmt(dict.searchResults, { query, count: results.length })
                : dict.searchPrompt}
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
