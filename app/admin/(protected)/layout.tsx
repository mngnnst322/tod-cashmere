import { guardPage } from "@/lib/auth-guard";
import { Sidebar } from "./sidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Any staff role may enter; each page narrows access further.
  const user = await guardPage("admin", "orders", "packer");

  return (
    <div className="admin-shell flex min-h-screen bg-adm-paper text-adm-ink">
      <Sidebar user={{ name: user.name, imageUrl: user.imageUrl, role: user.role }} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
