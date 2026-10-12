import { headers } from "next/headers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ComingSoon } from "@/components/coming-soon";
import { getSessionUser, isStaffRole, staffHome } from "@/lib/auth-guard";
import { getDict } from "@/lib/i18n-server";
import { isComingSoon } from "@/lib/site-settings";

// Storefront pages read the catalog from D1, so render them per request —
// otherwise the build bakes in whatever the DB held at build time.
export const dynamic = "force-dynamic";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, comingSoon, { dict }, requestHeaders] = await Promise.all([
    getSessionUser(),
    isComingSoon(),
    getDict(),
    headers(),
  ]);
  const isStaff = !!user && isStaffRole(user.role);

  // Before launch, visitors only see the logo; staff browse the real site and
  // the sign-in pages stay open so they can log in.
  const path = requestHeaders.get("x-pathname") ?? "";
  const isAuthPage = path.startsWith("/sign-in") || path.startsWith("/sign-up");
  if (comingSoon && !isStaff && !isAuthPage) {
    return <ComingSoon dict={dict} />;
  }

  return (
    <div className="page">
      <SiteHeader
        user={
          user
            ? {
                name: user.name,
                email: user.email,
                adminHref: isStaffRole(user.role) ? staffHome(user.role) : null,
              }
            : null
        }
      />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
