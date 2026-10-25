import { headers } from "next/headers";
import { SiteHeader } from "@/components/site-header";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { SiteFooter } from "@/components/site-footer";
import { ComingSoon } from "@/components/coming-soon";
import { CatalogHeader } from "@/components/catalog-header";
import { RevealObserver } from "@/components/reveal-observer";
import { getSessionUser, isStaffRole, staffHome } from "@/lib/auth-guard";
import { isComingSoon } from "@/lib/site-settings";
import { listCatalog, listCatalogTypes } from "@/lib/catalog";

// Storefront pages read the catalog from D1, so render them per request —
// otherwise the build bakes in whatever the DB held at build time.
export const dynamic = "force-dynamic";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, comingSoon, requestHeaders] = await Promise.all([
    getSessionUser(),
    isComingSoon(),
    headers(),
  ]);
  const isStaff = !!user && isStaffRole(user.role);

  const path = requestHeaders.get("x-pathname") ?? "";

  // The online catalog is its own public page with its own menu, open even
  // before launch.
  if (path.startsWith("/catalog")) {
    const [items, types] = await Promise.all([listCatalog(), listCatalogTypes()]);
    return (
      <div className="page">
        <CatalogHeader
          items={items.map(({ id, name, type, gender }) => ({ id, name, type, gender }))}
          types={types.map(({ gender, name }) => ({ gender, name }))}
          adminHref={isStaff ? staffHome(user.role) : null}
        />
        <main>{children}</main>
        <RevealObserver />
      </div>
    );
  }

  // Before launch, visitors only see the logo; staff browse the real site and
  // the sign-in pages stay open so they can log in.
  // The privacy policy stays public too: Google sign-in links to it.
  const isAuthPage =
    path.startsWith("/sign-in") || path.startsWith("/sign-up") || path === "/privacy";
  if (comingSoon && !isStaff && !isAuthPage) {
    return <ComingSoon />;
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
      <MobileTabBar signedIn={!!user} />
      <RevealObserver />
    </div>
  );
}
