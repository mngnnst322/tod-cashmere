"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  catalogItemName,
  catalogStrings,
  catalogTypeName,
} from "@/lib/catalog-i18n";
import { LANGS } from "@/lib/i18n";
import { useLang } from "./lang-provider";
import { LangFlag } from "./lang-flag";
import { useCatalogFavorites } from "./catalog-favorites";
import { HeartIcon } from "./catalog-grid";

const MENU = ["women", "men"] as const;

const typeHref = (gender: string, type: string) =>
  `/katalog?gender=${gender}&type=${encodeURIComponent(type)}`;

export type MenuItem = {
  id: string;
  name: string;
  type: string;
  gender: string;
};

/**
 * The storefront header's look (transparent over the hero, dropdown menus)
 * with a women / men / all menu of catalog garment types instead of shop
 * links, plus catalog search, saved items and the language picker.
 */
export function CatalogHeader({
  items,
  types,
  adminHref,
}: {
  items: MenuItem[];
  types: { gender: string; name: string }[];
  /** Set for signed-in staff: their admin entry point. */
  adminHref: string | null;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  // The type hovered in an open dropdown; its item names show beside it.
  const [hoverType, setHoverType] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { lang, setLang } = useLang();
  const { ids: savedIds } = useCatalogFavorites();
  const s = catalogStrings(lang);

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
      if (!(e.target as HTMLElement).closest("[data-lang-select]"))
        setLangOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = () => setNavOpen(false);

  return (
    <header
      className={`site-header ${solid || megaOpen ? "is-solid" : ""} ${navOpen ? "nav-open" : ""} ${searchActive ? "search-active" : ""}`}
      data-site-header
      ref={headerRef}
    >
      <div className="nav">
        <div className="nav-left">
          <Link className="brand katalog-logo" href="/katalog" onClick={close}>
            <Image
              src="/images/web-logo-trim.png"
              alt="Tod Cashmere"
              width={836}
              height={932}
              priority
            />
          </Link>
        </div>

        <nav className="nav-menu" id="catalog-nav" aria-label={s.eyebrow}>
          <ul className="nav-menu-list">
            {MENU.map((gender) => (
              <li
                key={gender}
                className="nav-menu-item has-mega"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <Link
                  className="nav-menu-link"
                  href={`/katalog?gender=${gender}`}
                  onClick={close}
                >
                  {s[gender]}
                  <svg
                    className="nav-caret"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </Link>
                <div className="mega-menu">
                  <div className="mega-inner">
                    <div
                      className="mega-columns"
                      onMouseLeave={() => setHoverType(null)}
                    >
                      <div className="mega-col">
                        <ul>
                          {types
                            .filter((t) => t.gender === gender)
                            .map(({ name: type }) => (
                              <li
                                key={type}
                                onMouseEnter={() => setHoverType(type)}
                              >
                                <Link
                                  href={typeHref(gender, type)}
                                  onClick={close}
                                >
                                  {catalogTypeName(type, lang)}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                      {hoverType && (
                        <div className="mega-col katalog-mega-items">
                          <div className="mega-col-title">
                            {catalogTypeName(hoverType, lang)}
                          </div>
                          <ul>
                            {/* Each style name once; it lists all its items. */}
                            {[
                              ...new Set(
                                items
                                  .filter(
                                    (i) =>
                                      i.type === hoverType &&
                                      i.gender === gender,
                                  )
                                  .map((i) => i.name),
                              ),
                            ].map((name) => (
                              <li key={name}>
                                <Link
                                  href={`${typeHref(gender, hoverType)}&name=${encodeURIComponent(name)}`}
                                  onClick={close}
                                >
                                  {catalogItemName(name, lang)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
            <li className="nav-menu-item">
              <Link
                className="nav-menu-link"
                href="/katalog?gender=all"
                onClick={close}
              >
                {s.all}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-right">
          <button
            type="button"
            className="nav-icon-button nav-icon-only"
            aria-label={s.search}
            onClick={() => {
              setSearchActive(true);
              setTimeout(() => searchInputRef.current?.focus(), 60);
            }}
          >
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l4.25 4.25 1.49-1.49L15.5 14Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
            </svg>
          </button>

          <Link
            className="nav-icon-button nav-icon-only nav-cart"
            href="/katalog?saved=1"
            aria-label={s.saved}
          >
            <HeartIcon />
            {savedIds.length > 0 && (
              <span className="cart-count">{savedIds.length}</span>
            )}
          </Link>

          <div
            className={`lang-select ${langOpen ? "open" : ""}`}
            data-lang-select
          >
            <button
              type="button"
              className="nav-icon-button lang-toggle"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={s.language}
              onClick={(e) => {
                e.stopPropagation();
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
                    <span className="lang-code">{option.code.toUpperCase()}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {adminHref && (
            <Link
              className="nav-icon-button nav-icon-only"
              href={adminHref}
              aria-label={s.admin}
              title={s.admin}
            >
              <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z" />
              </svg>
            </Link>
          )}
        </div>

          <button
            type="button"
            className="nav-burger nav-burger-end"
            aria-label={s.openMenu}
            aria-expanded={navOpen}
            aria-controls="catalog-nav"
            onClick={() => setNavOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        <div className="nav-search" data-search-panel>
          <form
            role="search"
            action="/katalog"
            method="GET"
            onSubmit={() => setSearchActive(false)}
          >
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l4.25 4.25 1.49-1.49L15.5 14Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
            </svg>
            <input
              type="search"
              name="q"
              placeholder={s.searchPlaceholder}
              autoComplete="off"
              ref={searchInputRef}
            />
            <button
              type="button"
              className="nav-search-close"
              onClick={() => setSearchActive(false)}
            >
              {s.close} ✕
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
