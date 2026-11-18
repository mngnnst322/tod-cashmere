import Link from "next/link";
import { guardPage } from "@/lib/auth-guard";
import { getLookbookAdmin } from "@/lib/lookbook-data";
import { LOOKBOOK_GENDERS, SLOT_ORDER, isLookbookGender, lookbookType } from "@/lib/lookbook";
import {
  activateLookbookModel,
  deleteLookbookLayer,
  deleteLookbookModel,
  setLookbookLayerStatus,
} from "@/lib/admin-actions";
import { ConfirmButton } from "../confirm-button";
import { PageBody, PageHeader, btnDark, btnSoft, panel } from "../../ui";
import { LayerUploader, ModelUploader } from "./uploaders";

const STATUS = {
  draft: { label: "Шалгах", tone: "bg-amber-100 text-amber-800" },
  approved: { label: "Нийтэлсэн", tone: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Татгалзсан", tone: "bg-red-100 text-red-700" },
} as const;

// Lookbook try-on: the model photo per gender, and every garment layer made
// for it. A layer reaches the storefront only once it is approved here.
export default async function AdminLookbookPage(props: PageProps<"/admin/lookbook">) {
  await guardPage("admin");
  const [{ gender: genderParam }, data] = await Promise.all([props.searchParams, getLookbookAdmin()]);
  const gender = isLookbookGender(genderParam) ? genderParam : "women";
  const models = data.models.filter((m) => m.gender === gender);
  const active = models.find((m) => m.active);
  const layers = data.layers.filter((l) => active && l.modelId === active.id);
  const tagged = data.tagged.filter((p) => p.lookbookGender === gender);
  const withLayer = new Set(layers.filter((l) => l.status !== "rejected").map((l) => l.productId));
  const missing = tagged.filter((p) => !withLayer.has(p.id));

  return (
    <>
      <PageHeader
        title="Lookbook"
        subtitle="Загвар өмсөгч дээр хувцас солих: суурь зураг, барааны давхаргууд"
      />
      <PageBody>
        <div className="flex gap-2">
          {LOOKBOOK_GENDERS.map((g) => (
            <Link key={g.key} href={`/admin/lookbook?gender=${g.key}`} className={g.key === gender ? btnDark : btnSoft}>
              {g.label}
            </Link>
          ))}
        </div>

        <section className={`${panel} grid gap-6 p-6 md:grid-cols-[220px_minmax(0,1fr)]`}>
          <div className="aspect-[9/16] overflow-hidden rounded-lg bg-adm-paper">
            {active && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={active.image} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0 space-y-4">
            <h2 className="text-lg font-medium">Суурь зураг</h2>
            <p className="max-w-prose text-sm text-adm-mute">
              Урдаас, толгойноос хөл хүртэл, гараа биеэсээ бага зэрэг зайтай, бариу энгийн хувцастай зураг.
              Бүх давхарга энэ зурагтай яг ижил хэмжээтэй байна. Шинэ зураг оруулбал хуучин давхаргууд
              хуучин зурагтайгаа үлдэнэ, шинэ зурганд дахин үүсгэх хэрэгтэй.
            </p>
            <ModelUploader gender={gender} />
            {models.length > 1 && (
              <ul className="space-y-1 text-sm">
                {models.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    <span className="truncate text-adm-mute">{m.createdAt.toLocaleDateString("mn-MN")}</span>
                    {m.active ? (
                      <span className="text-emerald-700">Идэвхтэй</span>
                    ) : (
                      <>
                        <form action={activateLookbookModel.bind(null, m.id)}>
                          <button className="hover:underline">Идэвхжүүлэх</button>
                        </form>
                        <ConfirmButton
                          action={deleteLookbookModel.bind(null, m.id)}
                          message="Энэ зураг болон түүний бүх давхаргыг устгах уу?"
                        >
                          Устгах
                        </ConfirmButton>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {active && (
          <section className={`${panel} space-y-4 p-6`}>
            <h2 className="text-lg font-medium">Давхарга нэмэх</h2>
            <p className="max-w-prose text-sm text-adm-mute">
              Тунгалаг PNG эсвэл WebP, суурь зурагтай ижил харьцаатай (scripts/lookbook-д үүсгэнэ). Бараа
              энд харагдахын тулд барааны формд Lookbook хүйс, төрлийг тохируулна.
            </p>
            <LayerUploader products={tagged.map((p) => ({ id: p.id, label: `${p.titleMn} · ${p.color}` }))} />
            {missing.length > 0 && (
              <p className="text-sm text-adm-mute">
                Давхаргагүй: {missing.map((p) => `${p.titleMn} (${p.color})`).join(", ")}
              </p>
            )}
          </section>
        )}

        {active && (
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {layers.map((l) => {
              const st = STATUS[l.status as keyof typeof STATUS] ?? STATUS.draft;
              return (
                <div key={l.id} className={`${panel} overflow-hidden`}>
                  <div className="relative aspect-[9/16] bg-adm-paper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={active.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <div className="space-y-2 p-3 text-sm">
                    <div className="truncate font-medium">{l.product?.titleMn ?? "Устсан бараа"}</div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-adm-mute">
                        {lookbookType(l.product?.lookbookType)?.label ?? l.slot} · {l.product?.color}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 ${st.tone}`}>{st.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs">
                      {l.status !== "approved" && (
                        <form action={setLookbookLayerStatus.bind(null, l.id, "approved")}>
                          <button className="font-medium text-emerald-700 hover:underline">Нийтлэх</button>
                        </form>
                      )}
                      {l.status !== "rejected" && (
                        <form action={setLookbookLayerStatus.bind(null, l.id, "rejected")}>
                          <button className="hover:underline">Татгалзах</button>
                        </form>
                      )}
                      <ConfirmButton action={deleteLookbookLayer.bind(null, l.id)} message="Энэ давхаргыг устгах уу?">
                        Устгах
                      </ConfirmButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}
        <p className="text-xs text-adm-mute">Давхарлах дараалал: {SLOT_ORDER.join(" → ")}</p>
      </PageBody>
    </>
  );
}
