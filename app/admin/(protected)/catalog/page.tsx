import Link from "next/link";
import { guardPage } from "@/lib/auth-guard";
import { listCatalogItems } from "@/lib/admin-data";
import {
  addCatalogType,
  deleteCatalogItem,
  deleteCatalogType,
  renameCatalogType,
} from "@/lib/admin-actions";
import { CATALOG_GENDERS, isCatalogGender, listCatalogTypes } from "@/lib/catalog";
import { ConfirmButton } from "../confirm-button";
import { EmptyRow, PageBody, PageHeader, btnDark, btnSoft, input, panel, th } from "../../ui";
import { CatalogItemButton } from "./catalog-item-button";

// Women's and men's catalogs, each with its own garment types that admins
// add, rename and delete here; the /katalog menu follows them.
export default async function AdminCatalogPage(props: PageProps<"/admin/catalog">) {
  await guardPage("admin");
  const [{ gender: genderParam, type: typeParam }, all, allTypes] = await Promise.all([
    props.searchParams,
    listCatalogItems(),
    listCatalogTypes(),
  ]);
  const gender = isCatalogGender(genderParam) ? genderParam : "women";
  const types = allTypes.filter((t) => t.gender === gender);
  const active = types.find((t) => t.name === typeParam) ?? types[0];
  const genderItems = all.filter((i) => i.gender === gender);
  const items = active ? genderItems.filter((i) => i.type === active.name) : [];
  const href = (g: string, t?: string) =>
    `/admin/catalog?gender=${g}${t ? `&type=${encodeURIComponent(t)}` : ""}`;

  return (
    <>
      <PageHeader
        title="Каталог"
        subtitle='Танилцуулга хуудасны "Онлайн каталог" — эмэгтэй, эрэгтэй тус бүрдээ төрөлтэй'
        actions={active && <CatalogItemButton gender={gender} type={active.name} />}
      />
      <PageBody>
        <div className="flex gap-2">
          {CATALOG_GENDERS.map((g) => (
            <Link key={g.key} href={href(g.key)} className={g.key === gender ? btnDark : btnSoft}>
              {g.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-6">
          {types.map((t) => {
            const on = t.id === active?.id;
            const count = genderItems.filter((i) => i.type === t.name).length;
            return (
              <Link
                key={t.id}
                href={href(gender, t.name)}
                className={`rounded-lg px-4 py-4 transition ${
                  on ? "bg-adm-ink text-white" : "bg-white hover:bg-adm-cream"
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.06em]">{t.name}</div>
                <div className={`mt-1 text-xs ${on ? "text-white/60" : "text-adm-mute"}`}>
                  {count} бараа
                </div>
              </Link>
            );
          })}
          <form
            action={addCatalogType.bind(null, gender)}
            className="flex flex-col gap-2 rounded-lg border border-dashed border-adm-line px-3 py-3"
          >
            <input name="name" required placeholder="Шинэ төрөл" className={input} />
            <button type="submit" className={btnSoft}>
              + Төрөл нэмэх
            </button>
          </form>
        </div>

        {active && (
          <div className={`${panel} flex flex-wrap items-center gap-3 px-5 py-4`}>
            <form
              action={renameCatalogType.bind(null, active.id)}
              className="flex flex-1 flex-wrap items-center gap-3"
            >
              <label htmlFor="type-name" className="text-sm text-adm-mute">
                Төрлийн нэр
              </label>
              <input
                id="type-name"
                key={active.id}
                name="name"
                defaultValue={active.name}
                required
                className={`${input} max-w-xs`}
              />
              <button type="submit" className={btnSoft}>
                Нэр хадгалах
              </button>
            </form>
            {items.length === 0 && (
              <ConfirmButton
                className="text-sm text-red-600 hover:underline"
                message={`"${active.name}" төрлийг устгах уу?`}
                action={async () => {
                  "use server";
                  await deleteCatalogType(active.id);
                }}
              >
                Төрөл устгах
              </ConfirmButton>
            )}
          </div>
        )}

        <div className={`${panel} overflow-x-auto`}>
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-adm-line">
                <th className={`${th} w-20`}></th>
                <th className={th}>Нэр</th>
                <th className={th}>Код</th>
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
                  <td className="whitespace-nowrap px-5 py-4 text-adm-mute">{item.code}</td>
                  <td className="px-5 py-4 text-adm-mute">{item.material}</td>
                  <td className="px-5 py-4">{item.sortOrder}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-medium">
                    <CatalogItemButton gender={gender} type={item.type} item={item} />
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
                <EmptyRow colSpan={6}>
                  {active
                    ? `"${active.name.toUpperCase()}"-д бараа алга. "КАТАЛОГ НЭМЭХ" дарж нэмнэ үү.`
                    : 'Эхлээд "+ Төрөл нэмэх"-ээр төрөл нэмнэ үү.'}
                </EmptyRow>
              )}
            </tbody>
          </table>
        </div>
      </PageBody>
    </>
  );
}
