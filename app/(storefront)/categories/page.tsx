import { listCategories, getFeaturedProducts } from "@/lib/products";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { getDict } from "@/lib/i18n-server";

export async function generateMetadata() {
  const { dict } = await getDict();
  return { title: `${dict.categoriesTitle} – Tod Cashmere` };
}

export default async function CategoriesPage() {
  const [categories, featured, { dict }] = await Promise.all([
    listCategories(),
    getFeaturedProducts(),
    getDict(),
  ]);

  return (
    <>
      <section className="section" id="categories">
        <div className="section-header">
          <div>
            <div className="section-title">{dict.categoriesTitle}</div>
            <div className="section-subtitle">{dict.categoriesSubtitle}</div>
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
            <div className="section-title">{dict.featuredTitle}</div>
            <div className="section-subtitle">{dict.catalogHighlights}</div>
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
