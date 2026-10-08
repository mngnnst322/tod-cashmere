import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSessionUser } from "@/lib/auth-guard";

// Storefront pages read the catalog from D1, so render them per request —
// otherwise the build bakes in whatever the DB held at build time.
export const dynamic = "force-dynamic";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  return (
    <div className="page">
      <SiteHeader
        user={
          user
            ? { name: user.name, email: user.email, isAdmin: user.role === "admin" }
            : null
        }
      />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
