import Link from "next/link";
import { guardPage } from "@/lib/auth-guard";
import { listStaff } from "@/lib/admin-data";
import { listAllProducts, listCategories } from "@/lib/products";
import { revokeRole, setComingSoon } from "@/lib/admin-actions";
import { isComingSoon } from "@/lib/site-settings";
import { ConfirmButton } from "../confirm-button";
import { PageBody, PageHeader, ROLE_LABELS, RoleBadge, btnDark, btnSoft, panel } from "../../ui";
import { GrantRoleButton } from "./grant-role";

export default async function AdminSettingsPage() {
  const me = await guardPage("admin");
  const [products, categories, staff, comingSoon] = await Promise.all([
    listAllProducts(),
    listCategories(),
    listStaff(),
    isComingSoon(),
  ]);

  return (
    <>
      <PageHeader title="Тохиргоо" subtitle="Дэлгүүр болон бүртгэлийн мэдээлэл" />
      <PageBody>
        <div className="max-w-3xl space-y-6">
          <Card
            title="Сайтын төлөв"
            action={
              <ConfirmButton
                className={comingSoon ? btnDark : btnSoft}
                message={
                  comingSoon
                    ? "Сайтыг бүх хүнд нээх үү?"
                    : 'Сайтыг хааж, зөвхөн "Тун удахгүй" хуудас харуулах уу?'
                }
                action={async () => {
                  "use server";
                  await setComingSoon(!comingSoon);
                }}
              >
                {comingSoon ? "Сайтыг нээх" : '"Тун удахгүй" болгох'}
              </ConfirmButton>
            }
          >
            <p className="py-2 text-[15px] text-adm-mute">
              {comingSoon ? (
                <>
                  <span className="mr-2 inline-block rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                    ТУН УДАХГҮЙ
                  </span>
                  Зочид зөвхөн лого болон &quot;Тун удахгүй&quot; бичиг харна. Ажилтнууд нэвтэрсэн үедээ бүтэн сайтыг харна.
                </>
              ) : (
                <>
                  <span className="mr-2 inline-block rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    НЭЭЛТТЭЙ
                  </span>
                  Сайт бүх хүнд нээлттэй.
                </>
              )}
            </p>
          </Card>

          <Card title="Дэлгүүр">
            <Row label="Брэнд" value="Tod Cashmere" />
            <Row label="Идэвхтэй бараа" value={products.filter((p) => !p.hidden).length} />
            <Row label="Категори" value={categories.length} />
          </Card>

          <Card title="Миний бүртгэл">
            <Row label="Нэр" value={me.name} />
            <Row label="Имэйл" value={me.email} />
            <Row label="Эрх" value={ROLE_LABELS[me.role].toUpperCase()} />
          </Card>

          <Card title="Ажилтнууд ба эрх" action={<GrantRoleButton />}>
            {staff.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 border-b border-adm-line py-4 last:border-0"
              >
                <div className="min-w-0">
                  <div className="truncate">{s.name || s.email}</div>
                  <div className="truncate text-xs text-adm-mute">{s.email}</div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <RoleBadge role={s.role} />
                  {s.id === me.id ? (
                    <span className="w-14 text-xs text-adm-mute">Та</span>
                  ) : (
                    <ConfirmButton
                      className="w-14 text-sm text-red-600 hover:underline"
                      message={`${s.email}-ийн эрхийг хасах уу?`}
                      action={async () => {
                        "use server";
                        await revokeRole(s.id);
                      }}
                    >
                      Хасах
                    </ConfirmButton>
                  )}
                </div>
              </div>
            ))}
          </Card>

          <Card title="Холбоосууд">
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/" className={btnSoft}>
                Сайт руу буцах →
              </Link>
              <Link href="/admin/products" className={btnSoft}>
                Бараа удирдах
              </Link>
            </div>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={`${panel} px-7 py-6`}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-base font-medium">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-6 border-b border-adm-line py-4 text-[15px] last:border-0">
      <span className="text-adm-mute">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
