"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-provider";
import { useLang } from "./lang-provider";
import { useCatalogFavorites } from "./catalog-favorites";

const labels = {
  mn: { home: "Нүүр", search: "Хайлт", saved: "Зүрхлэх", cart: "Сагс", profile: "Профайл" },
  en: { home: "Home", search: "Search", saved: "Saved", cart: "Cart", profile: "Profile" },
  ru: { home: "Главная", search: "Поиск", saved: "Избранное", cart: "Корзина", profile: "Профиль" },
  zh: { home: "首页", search: "搜索", saved: "收藏", cart: "购物车", profile: "我的" },
};

const icons = {
  home: <path d="M4 10.5 12 4l8 6.5V20H4Z M9.5 20v-5.5h5V20" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  saved: (
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
  ),
  cart: (
    <>
      <path d="M5 8h14l-1 12H6Z" />
      <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20.5c.6-3.6 3.4-5.8 7-5.8s6.4 2.2 7 5.8Z" />
    </>
  ),
};

/** Phone-only bottom navigation for the shop. */
export function MobileTabBar({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const { count } = useCart();
  const { ids } = useCatalogFavorites();
  const { lang } = useLang();
  const t = labels[lang];

  const tabs = [
    { key: "home", href: "/", badge: 0 },
    { key: "search", href: "/search", badge: 0 },
    { key: "saved", href: "/catalog?saved=1", badge: ids.length },
    { key: "cart", href: "/cart", badge: count },
    { key: "profile", href: signedIn ? "/account" : "/sign-in", badge: 0 },
  ] as const;

  return (
    <nav className="mobile-tab-bar" aria-label="Mobile">
      {tabs.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href.split("?")[0]);
        return (
          <Link key={tab.key} href={tab.href} className={`mobile-tab ${active ? "is-active" : ""}`}>
            <span className="mobile-tab-icon">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" aria-hidden="true">
                {icons[tab.key]}
              </svg>
              {tab.badge > 0 && <span className="mobile-tab-badge">{tab.badge}</span>}
            </span>
            {t[tab.key]}
          </Link>
        );
      })}
    </nav>
  );
}
