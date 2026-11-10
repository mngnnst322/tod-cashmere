import { notFound } from "next/navigation";
import { listCategories, listProducts } from "@/lib/products";
import { ArrivalCard } from "@/components/arrival-card";
import { categoryName } from "@/lib/i18n";
import { getDict } from "@/lib/i18n-server";

async function findCategory(slug: string) {
  const categories = await listCategories();
  return categories.find((c) => c.slug === decodeURIComponent(slug));
}

export async function generateMetadata(props: PageProps<"/categories/[slug]">) {
  const { slug } = await props.params;
  const [category, { lang }] = await Promise.all([findCategory(slug), getDict()]);
  return { title: `${category ? categoryName(category, lang) : ""} – Tod Cashmere` };
}

// The shop for one category, opened from its tile on /categories.
export default async function CategoryPage(props: PageProps<"/categories/[slug]">) {
  const { slug } = await props.params;
  const [category, all, { lang }] = await Promise.all([findCategory(slug), listProducts(), getDict()]);
  if (!category) notFound();
  const products = all.filter((p) => p.categorySlug === category.slug);

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <div className="section-title">{categoryName(category, lang)}</div>
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
