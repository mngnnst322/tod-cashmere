import Link from "next/link";
import { guardPage } from "@/lib/auth-guard";
import { listAllProducts, listCategories } from "@/lib/products";
import { deleteCategory } from "@/lib/admin-actions";
import { ConfirmButton } from "../confirm-button";
import { EmptyRow, PageBody, PageHeader, btnDark, icons, panel, th } from "../../ui";

export default async function AdminCategoriesPage() {
  await guardPage("admin");
  const [categories, products] = await Promise.all([listCategories(), listAllProducts()]);

  return (
    <>
      <PageHeader
        title="Ангилал"
        subtitle="Барааны ангилал нэмэх, засах, устгах — 4 хэл дээр"
        actions={
          <Link href="/admin/categories/new" className={btnDark}>
            {icons.plus}
            Нэмэх
          </Link>
        }
      />
      <PageBody>
        <div className={`${panel} overflow-x-auto`}>
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-adm-line">
                <th className={th}>Нэр (MN)</th>
                <th className={th}>Slug</th>
                <th className={th}>Орчуулга</th>
                <th className={th}>Дараалал</th>
                <th className={th}>Бараа</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const langs = [
                  ["EN", c.nameEn],
                  ["RU", c.nameRu],
                  ["ZH", c.nameZh],
                ] as const;
                return (
                  <tr key={c.id} className="border-t border-adm-line hover:bg-adm-cream/60">
                    <td className="px-5 py-4 font-semibold">{c.nameMn}</td>
                    <td className="px-5 py-4 text-adm-mute">{c.slug}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        {langs.map(([code, value]) => (
                          <span
                            key={code}
                            title={value || "Орчуулаагүй"}
                            className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
                              value ? "bg-emerald-50 text-emerald-700" : "bg-adm-paper text-adm-mute line-through"
                            }`}
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">{c.sortOrder}</td>
                    <td className="px-5 py-4">
                      {products.filter((p) => p.categorySlug === c.slug).length}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-medium">
                      <Link
                        href={`/admin/categories/${c.id}/edit`}
                        className="mr-4 text-blue-700 hover:underline"
                      >
                        Засах
                      </Link>
                      <ConfirmButton
                        message={`"${c.nameMn}" ангиллыг устгах уу? Бараанууд нь устахгүй.`}
                        action={async () => {
                          "use server";
                          await deleteCategory(c.id);
                        }}
                      >
                        Устгах
                      </ConfirmButton>
                    </td>
                  </tr>
                );
              })}
              {categories.length === 0 && <EmptyRow colSpan={6}>Ангилал алга.</EmptyRow>}
            </tbody>
          </table>
        </div>
      </PageBody>
    </>
  );
}
