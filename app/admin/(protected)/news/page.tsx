import Link from "next/link";
import { guardPage } from "@/lib/auth-guard";
import { listNews } from "@/lib/admin-data";
import { deleteNews } from "@/lib/admin-actions";
import { ConfirmButton } from "../confirm-button";
import { EmptyRow, PageBody, PageHeader, btnDark, icons, panel, th } from "../../ui";

export default async function AdminNewsPage() {
  await guardPage("admin");
  const items = await listNews();

  return (
    <>
      <PageHeader
        title="Мэдээ"
        subtitle="Онцлох мэдээ нэмэх, засах, устгах — 4 хэл дээр (хамгийн сүүлийн 10-ыг л хадгална)"
        actions={
          <Link href="/admin/news/new" className={btnDark}>
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
                <th className={`${th} w-20`}></th>
                <th className={th}>Гарчиг (MN)</th>
                <th className={th}>Огноо</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <tr key={n.id} className="border-t border-adm-line hover:bg-adm-cream/60">
                  <td className="py-3 pl-5">
                    {n.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={n.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                    ) : (
                      <div className="grid h-14 w-14 place-items-center rounded-lg bg-adm-paper text-adm-mute">
                        {icons.image}
                      </div>
                    )}
                  </td>
                  <td className="max-w-2xl px-5 py-4">
                    <div className="font-semibold">{n.titleMn}</div>
                    <div className="mt-1 truncate text-adm-mute">{n.bodyMn}</div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    {n.createdAt.toLocaleDateString("en-US")}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-medium">
                    <Link href={`/admin/news/${n.id}/edit`} className="mr-4 text-blue-700 hover:underline">
                      Засах
                    </Link>
                    <ConfirmButton
                      message={`"${n.titleMn}" мэдээг устгах уу?`}
                      action={async () => {
                        "use server";
                        await deleteNews(n.id);
                      }}
                    >
                      Устгах
                    </ConfirmButton>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <EmptyRow colSpan={4}>Мэдээ алга.</EmptyRow>}
            </tbody>
          </table>
        </div>
      </PageBody>
    </>
  );
}
