import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { CatalogHeader } from "@/components/catalog-header";
import { RevealObserver } from "@/components/reveal-observer";
import { getSessionUser, isStaffRole, staffHome } from "@/lib/auth-guard";
import { isComingSoon } from "@/lib/site-settings";
import { listCatalog, listCatalogTypes } from "@/lib/catalog";
import { getCatalogLang } from "@/lib/catalog-lang";

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
    const [items, types, catalogLang] = await Promise.all([listCatalog(), listCatalogTypes(), getCatalogLang()]);
    return (
      <div className="page">
        <CatalogHeader
          items={items.map(({ id, name, nameEn, nameJa, type, gender }) => ({ id, name, nameEn, nameJa, type, gender }))}
          types={types.map(({ gender, name }) => ({ gender, name }))}
          adminHref={isStaff ? staffHome(user.role) : null}
          lang={catalogLang}
        />
        <main>{children}</main>
        <RevealObserver />
      </div>
    );
  }

  // Before launch, visitors only see the logo; staff browse the real site and
  // the sign-in pages stay open so they can log in.
  // The privacy policy stays public too: Google sign-in links to it.
  // Sign-in stays open so people can log in; sign-up shows the coming-soon
  // screen.
  const isAuthPage =
    path.startsWith("/sign-in") ||
    path === "/privacy";
  // For now the public only gets the catalog: every shop page (the home page
  // included) sends visitors there. Turn "Тун удахгүй" off in the admin
  // settings to open the shop again.
  if (comingSoon && !isStaff && !isAuthPage) {
    redirect("/catalog");
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
      <CartDrawer />
      <RevealObserver />
    </div>
  );
}
