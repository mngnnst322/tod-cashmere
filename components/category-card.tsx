import Link from "next/link";
import Image from "next/image";
import { categoryMeta, categoryName, fmt } from "@/lib/i18n";
import { getDict } from "@/lib/i18n-server";
import type { categories } from "@/lib/db/schema";
import { isUploadedImage } from "@/lib/format";

type Category = typeof categories.$inferSelect;

export async function CategoryCard({
  category,
  href,
}: {
  category: Category;
  href?: string;
}) {
  const { lang, dict } = await getDict();
  const name = categoryName(category, lang);
  return (
    <Link
      className="category-card"
      id={category.slug}
      href={href ?? `/categories#${category.slug}`}
    >
      <div className="category-image">
        <Image
          src={category.image}
          unoptimized={isUploadedImage(category.image)}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="category-body">
        <div className="category-name">{name}</div>
        <div className="category-meta">{categoryMeta(category, lang)}</div>
        <div className="category-cta">{fmt(dict.shopCategory, { name })}</div>
      </div>
    </Link>
  );
}
