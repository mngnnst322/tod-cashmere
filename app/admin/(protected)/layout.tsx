import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { getAuth } from "@/lib/auth";
import { SignOutButton } from "../sign-out-button";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="flex">
        <aside className="w-56 shrink-0 border-r border-neutral-200 bg-white p-4 min-h-screen">
          <div className="mb-8 text-lg font-semibold tracking-tight">
            TOD ADMIN
          </div>
          <nav className="flex flex-col gap-1 text-sm">
            <Link className="rounded px-3 py-2 hover:bg-neutral-100" href="/admin">
              Dashboard
            </Link>
            <Link
              className="rounded px-3 py-2 hover:bg-neutral-100"
              href="/admin/products"
            >
              Products
            </Link>
            <Link
              className="rounded px-3 py-2 hover:bg-neutral-100"
              href="/admin/categories"
            >
              Categories
            </Link>
            <Link className="rounded px-3 py-2 hover:bg-neutral-100" href="/admin/orders">
              Orders
            </Link>
          </nav>
          <div className="mt-8 border-t border-neutral-200 pt-4">
            <SignOutButton />
          </div>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
