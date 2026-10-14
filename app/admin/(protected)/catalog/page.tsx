import Link from "next/link";
import { guardPage } from "@/lib/auth-guard";
import { listCatalogItems } from "@/lib/admin-data";
import { deleteCatalogItem } from "@/lib/admin-actions";
import { ConfirmButton } from "../confirm-button";
import { EmptyRow, PageBody, PageHeader, panel, th } from "../../ui";
import { CatalogItemButton } from "./catalog-item-button";
import { CATALOG_TYPES } from "@/lib/catalog";


export default async function AdminCatalogPage(props: PageProps<"/admin/catalog">) {
  await guardPage("admin");
  const { type } = await props.searchParams;
  const active = typeof type === "string" && CATALOG_TYPES.includes(type) ? type : CATALOG_TYPES[0];
  const all = await listCatalogItems();
  const items = all.filter((i) => i.type === active);

  return (
    <>
      <PageHeader
        title="Каталог"
        subtitle='Танилцуулга хуудасны барааны нэр төрөл бүрийн "Онлайн каталог" бараа'
        actions={<CatalogItemButton type={active} />}
      />
      <PageBody>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {CATALOG_TYPES.map((t) => {
            const on = t === active;
            const count = all.filter((i) => i.type === t).length;
            return (
              <Link
                key={t}
                href={`/admin/catalog?type=${encodeURIComponent(t)}`}
                className={`rounded-lg px-4 py-4 transition ${
                  on ? "bg-adm-ink text-white" : "bg-white hover:bg-adm-cream"
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.06em]">{t}</div>
                <div className={`mt-1 text-xs ${on ? "text-white/60" : "text-adm-mute"}`}>
                  {count} бараа
                </div>
              </Link>
            );
          })}
        </div>

        <div className={`${panel} overflow-x-auto`}>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-adm-line">
                <th className={`${th} w-20`}></th>
                <th className={th}>Нэр</th>
                <th className={th}>Материал</th>
                <th className={th}>Дараалал</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-adm-line hover:bg-adm-cream/60">
                  <td className="py-3 pl-5">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-adm-paper" />
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold">{item.name}</td>
                  <td className="px-5 py-4 text-adm-mute">{item.material}</td>
                  <td className="px-5 py-4">{item.sortOrder}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-medium">
                    <CatalogItemButton type={active} item={item} />
                    <ConfirmButton
                      message={`"${item.name}"-г устгах уу?`}
                      action={async () => {
                        "use server";
                        await deleteCatalogItem(item.id);
                      }}
                    >
                      Устгах
                    </ConfirmButton>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <EmptyRow colSpan={5}>
                  &quot;{active.toUpperCase()}&quot;-д бараа алга. &quot;КАТАЛОГ НЭМЭХ&quot; дарж нэмнэ үү.
                </EmptyRow>
              )}
            </tbody>
          </table>
        </div>
      </PageBody>
    </>
  );
}
