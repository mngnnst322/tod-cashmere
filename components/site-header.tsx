"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./cart-provider";
import { useLang } from "./lang-provider";
import { LANG_MENU_CODES, LangFlag } from "./lang-flag";
import { SearchDropdown, rememberSearch } from "./search-dropdown";
import { AccountSignOutButton } from "./account-sign-out-button";
import { LANGS, type Dict } from "@/lib/i18n";
import { shopMenu } from "@/lib/shop-menu";

const megaFeatures = (gender: string, d: Dict) => [
  {
    href: "/arrivals",
    image:
      gender === "women"
        ? "/images/front-view-woman-posing-beach_23-2150100135.jpg"
        : "/images/full-shot-woman-taking-walk-nature_23-2150100065.jpg",
    title: d.megaCollection,
    caption: d.megaCollectionCaption,
  },
  {
    href: "/sale",
    image:
      gender === "women"
        ? "/images/smiley-woman-beach-front-view_23-2150100099.avif"
        : "/images/woman-walking-beach-side-view.jpg",
    title: d.megaSale,
    caption:
      gender === "women" ? d.megaSaleWomen : gender === "men" ? d.megaSaleMen : d.megaSale,
  },
];

export type HeaderUser = {
  name: string;
  email: string;
  /** Set for staff: where their admin entry point is. */
  adminHref: string | null;
};

export function SiteHeader({ user }: { user: HeaderUser | null }) {
  const { count } = useCart();
  const { lang, setLang, t, dict } = useLang();
  const headerRef = useRef<HTMLElement>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!document.querySelector(".hero--video")) {
      setSolid(true);
      return;
    }
    // Turn white as soon as the page starts scrolling off the hero.
    const update = () => setSolid(window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-lang-select]")) setLangOpen(false);
      if (!target.closest("[data-profile-select]")) setProfileOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const attr = root.getAttribute("data-theme");
    const current =
      attr === "dark" || (!attr && window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? "dark"
        : "light";
    const next = current === "dark" ? "light" : "dark";
    const apply = () => {
      root.setAttribute("data-theme", next);
      // Read by the root layout on the next page load.
      document.cookie = `theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    };
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const docWithTransition = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (!docWithTransition.startViewTransition || prefersReducedMotion) {
      apply();
      return;
    }
    docWithTransition.startViewTransition(apply).ready.catch(() => {});
  };

  return (
    <header
      className={`site-header ${solid || megaOpen ? "is-solid" : ""} ${navOpen ? "nav-open" : ""} ${searchActive ? "search-active" : ""}`}
      data-site-header
      ref={headerRef}
    >
      <div className="nav">
        <div className="nav-left">
          <Link className="brand katalog-logo" href="/">
            <Image src="/images/web-logo-trim.png" alt="Tod Cashmere" width={836} height={932} priority />
          </Link>
        </div>

        <nav className="nav-menu" id="primary-nav" aria-label="Primary">
          <ul className="nav-menu-list">
            {shopMenu(lang).map((entry) =>
              entry.columns ? (
                <li
                  key={entry.key}
                  className="nav-menu-item has-mega"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link className="nav-menu-link" href={entry.href} onClick={() => setNavOpen(false)}>
                    {entry.label}
                    <svg className="nav-caret" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </Link>
                  <div className="mega-menu">
                    <div className="mega-inner">
                      <div className="mega-columns">
                        {entry.columns.map((col) => (
                          <div className="mega-col" key={col.title}>
                            <div className="mega-col-title">{col.title}</div>
                            <ul>
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link href={link.href} onClick={() => setNavOpen(false)}>
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="mega-features">
                        {megaFeatures(entry.key, dict).map((feature) => (
                          <Link
                            className="mega-feature"
                            href={feature.href}
                            key={feature.title + feature.caption}
                            onClick={() => setNavOpen(false)}
                          >
                            <div className="mega-feature-image">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={feature.image} alt={feature.title} loading="lazy" />
                            </div>
                            <div className="mega-feature-title">{feature.title}</div>
                            <div className="mega-feature-caption">{feature.caption}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li className="nav-menu-item" key={entry.key}>
                  <Link className="nav-menu-link" href={entry.href} onClick={() => setNavOpen(false)}>
                    {entry.label}
                  </Link>
                </li>
              ),
            )}
            <li className="nav-menu-item">
              <Link className="nav-menu-link" href="/sale" onClick={() => setNavOpen(false)}>
                {t("sale")}
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link className="nav-menu-link" href="/lookbook" onClick={() => setNavOpen(false)}>
                {t("lookbook")}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-right">
          <button
            type="button"
            className="nav-icon-button nav-icon-only"
            aria-label={t("search")}
            onClick={() => {
              setSearchActive(true);
              setTimeout(() => searchInputRef.current?.focus(), 60);
            }}
          >
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <g className="line-icon"><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></g>
            </svg>
          </button>

          <button
            type="button"
            className="nav-icon-button nav-icon-only theme-toggle"
            aria-label={t("toggleTheme")}
            onClick={toggleTheme}
          >
            <svg className="icon-svg theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-13a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Zm0 14a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm8-6a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM6 12a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm11.66-6.66a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0ZM7.46 16.54a1 1 0 0 1 0 1.41l-.71.71a1 1 0 0 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0Zm10.2 1.41a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41ZM7.46 7.46a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41Z" />
            </svg>
            <svg className="icon-svg theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
            </svg>
          </button>

          <div className={`lang-select ${langOpen ? "open" : ""}`} data-lang-select>
            <button
              type="button"
              className="nav-icon-button lang-toggle"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={t("selectLanguage")}
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen(false);
                setLangOpen((o) => !o);
              }}
            >
              <span className="lang-current">{lang.toUpperCase()}</span>
            </button>
            <ul className="lang-menu lang-menu--flags" role="listbox">
              {LANGS.map((option) => (
                <li key={option.code}>
                  <button
                    type="button"
                    className={`lang-option ${lang === option.code ? "is-active" : ""}`}
                    role="option"
                    aria-selected={lang === option.code}
                    aria-label={option.label}
                    title={option.label}
                    onClick={() => {
                      setLang(option.code);
                      setLangOpen(false);
                    }}
                  >
                    <LangFlag lang={option.code} />
                    <span className="lang-code">{LANG_MENU_CODES[option.code]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div
            className={`lang-select profile-select ${profileOpen ? "open" : ""}`}
            data-profile-select
          >
            <button
              type="button"
              className="nav-icon-button nav-icon-only"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              aria-label={user ? t("profile") : t("login")}
              onClick={(e) => {
                e.stopPropagation();
                setLangOpen(false);
                setProfileOpen((o) => !o);
              }}
            >
              {user ? (
                <>
                  <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                    <g className="line-icon"><circle cx="12" cy="8" r="3.6" /><path d="M5 20.5c.6-3.6 3.4-5.8 7-5.8s6.4 2.2 7 5.8Z" /></g>
                  </svg>
                  <span className="profile-dot" aria-hidden="true"></span>
                </>
              ) : (
                <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                  <g className="line-icon"><circle cx="12" cy="8" r="3.6" /><path d="M5 20.5c.6-3.6 3.4-5.8 7-5.8s6.4 2.2 7 5.8Z" /></g>
                </svg>
              )}
            </button>
            <ul className="lang-menu profile-menu" role="menu">
              {user ? (
                <>
                  <li className="profile-menu-head" role="presentation">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </li>
                  <li>
                    <Link
                      className="lang-option"
                      role="menuitem"
                      href="/account"
                      onClick={() => setProfileOpen(false)}
                    >
                      {t("profile")}
                    </Link>
                  </li>
                  {user.adminHref && (
                    <li>
                      <Link
                        className="lang-option"
                        role="menuitem"
                        href={user.adminHref}
                        onClick={() => setProfileOpen(false)}
                      >
                        {t("admin")}
                      </Link>
                    </li>
                  )}
                  <li>
                    <AccountSignOutButton
                      className="lang-option"
                      label={t("signOut")}
                      onDone={() => setProfileOpen(false)}
                    />
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      className="lang-option"
                      role="menuitem"
                      href="/sign-in"
                      onClick={() => setProfileOpen(false)}
                    >
                      {t("login")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="lang-option"
                      role="menuitem"
                      href="/sign-up"
                      onClick={() => setProfileOpen(false)}
                    >
                      {t("signUp")}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Link className="nav-icon-button nav-icon-only nav-cart nav-bag" href="/cart" aria-label={t("cart")}>
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
              <path d="M5 8h14l-1 12H6Z" />
            </svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>

          <button
            type="button"
            className="nav-burger nav-burger-end"
            aria-label={t("openMenu")}
            aria-expanded={navOpen}
            aria-controls="primary-nav"
            onClick={() => setNavOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        <div className="nav-search" data-search-panel>
          <form
            role="search"
            action="/search"
            method="GET"
            onSubmit={() => {
              rememberSearch(searchQuery);
              setSearchActive(false);
            }}
          >
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <g className="line-icon"><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></g>
            </svg>
            <input
              type="search"
              name="q"
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="nav-search-close"
              onClick={() => setSearchActive(false)}
            >
              {t("close")} ✕
            </button>
          </form>
          {searchActive && (
            <SearchDropdown
              query={searchQuery}
              lang={lang}
              onPick={() => setSearchActive(false)}
              onRecent={(term) => {
                setSearchQuery(term);
                searchInputRef.current?.focus();
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
}
