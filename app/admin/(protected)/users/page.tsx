import { guardPage } from "@/lib/auth-guard";
import { listCustomers } from "@/lib/admin-data";
import { formatPrice } from "@/lib/products";
import {
  Avatar,
  EmptyRow,
  PageBody,
  PageHeader,
  RoleBadge,
  formatDate,
  input,
  panel,
  th,
} from "../../ui";

export default async function AdminUsersPage(props: PageProps<"/admin/users">) {
  await guardPage("admin");
  const { q } = await props.searchParams;
  const query = typeof q === "string" ? q.trim().toLowerCase() : "";
  const all = await listCustomers();
  const users = query
    ? all.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query))
    : all;

  return (
    <>
      <PageHeader title="Хэрэглэгчид" subtitle="Үйлчлүүлэгчдийн мэдээлэл ба худалдан авалтын түүх" />
      <PageBody>
        <form className="max-w-md">
          <input name="q" defaultValue={query} placeholder="Нэр, имэйлээр хайх..." className={input} />
        </form>
        <div className={`${panel} overflow-x-auto`}>
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-adm-line">
                <th className={th}>Үйлчлүүлэгч</th>
                <th className={th}>Имэйл</th>
                <th className={th}>Захиалга</th>
                <th className={th}>Нийт зарцуулсан</th>
                <th className={th}>Бүртгүүлсэн</th>
                <th className={th}>Төрөл</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-adm-line hover:bg-adm-cream/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name || u.email} imageUrl={u.imageUrl} />
                      <span className="font-semibold">{u.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">{u.email}</td>
                  <td className="px-5 py-4">{u.orderCount}</td>
                  <td className="px-5 py-4 font-semibold">{formatPrice(u.spent)}</td>
                  <td className="px-5 py-4 text-adm-mute">{formatDate(u.createdAt)}</td>
                  <td className="px-5 py-4">
                    <RoleBadge role={u.role} />
                  </td>
                </tr>
              ))}
              {users.length === 0 && <EmptyRow colSpan={6}>Хэрэглэгч олдсонгүй.</EmptyRow>}
            </tbody>
          </table>
        </div>
      </PageBody>
    </>
  );
}
