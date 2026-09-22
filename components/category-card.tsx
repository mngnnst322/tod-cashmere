import Link from "next/link";
import Image from "next/image";
import type { categories } from "@/lib/db/schema";

type Category = typeof categories.$inferSelect;

export function CategoryCard({
  category,
  href,
}: {
  category: Category;
  href?: string;
}) {
  return (
    <Link
      className="category-card"
      id={category.slug}
      href={href ?? `/categories#${category.slug}`}
    >
      <div className="category-image">
        <Image
          src={category.image}
          alt={category.nameMn}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="category-body">
        <div className="category-name">{category.nameMn}</div>
        <div className="category-meta">{category.meta}</div>
        <div className="category-cta">Shop {category.nameMn} →</div>
      </div>
    </Link>
  );
}
