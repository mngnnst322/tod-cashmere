import Link from "next/link";
import { guardPage } from "@/lib/auth-guard";
import { listAllProducts, listCategories } from "@/lib/products";
import { PageBody, PageHeader, StatCard, btnDark, btnOutline, icons } from "../../ui";
import { ProductsTable } from "./products-table";
import { PriceImportButton } from "./price-import";

export default async function AdminProductsPage() {
  const user = await guardPage("admin", "orders");
  const canEdit = user.role === "admin";
  const [products, categories] = await Promise.all([listAllProducts(), listCategories()]);
  const hidden = products.filter((p) => p.hidden).length;

  return (
    <>
      <PageHeader
        title="Бараа"
        subtitle={canEdit ? "Бүтээгдэхүүн нэмэх, засах, устгах" : "Бүтээгдэхүүний жагсаалт (зөвхөн харах)"}
        actions={
          canEdit && (
            <>
              <a href="/admin/export/products" className={btnOutline}>
                {icons.download}
                Excel татах ({products.length})
              </a>
              <a href="/admin/export/products?images=1" className={btnOutline}>
                {icons.image}
                Зурагтай татах ({products.length})
              </a>
              <PriceImportButton />
              <Link href="/admin/products/new" className={btnDark}>
                {icons.plus}
                Нэмэх
              </Link>
            </>
          )
        }
      />
      <PageBody>
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard label="Нийт бүтээгдэхүүн" value={products.length} />
          <StatCard label="Идэвхтэй" value={products.length - hidden} />
          <StatCard label="Нуусан" value={hidden} />
        </div>
        <ProductsTable
          canEdit={canEdit}
          categories={categories.map((c) => ({ slug: c.slug, name: c.nameMn }))}
          products={products.map((p) => ({
            id: p.id,
            slug: p.slug,
            code: p.code,
            title: p.titleMn,
            titleEn: p.titleEn,
            image: p.image,
            categorySlug: p.categorySlug,
            collection: p.collection,
            color: p.color,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            stock: p.stock,
            inStock: p.inStock,
            hidden: p.hidden,
          }))}
        />
      </PageBody>
    </>
  );
}
