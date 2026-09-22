import { listCategories, getFeaturedProducts } from "@/lib/products";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";

export const metadata = { title: "Categories – Tod Cashmere" };

export default async function CategoriesPage() {
  const [categories, featured] = await Promise.all([
    listCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <section className="section" id="categories">
        <div className="section-header">
          <div>
            <div className="section-title">Бүтээгдэхүүний төрөл</div>
            <div className="section-subtitle">Browse by category</div>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              href={`#${category.slug}`}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">Онцлох бараа</div>
            <div className="section-subtitle">
              Каталогийн шилдэг бараа
            </div>
          </div>
        </div>
        <div className="product-row featured-compact">
          <div className="product-list">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
