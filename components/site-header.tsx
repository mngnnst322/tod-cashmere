"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./cart-provider";
import { useLang } from "./lang-provider";

const megaColumns = (gender: "women" | "men") => [
  {
    title: gender === "women" ? "Эмэгтэй" : "Эрэгтэй",
    links: [
      { label: "Шинэ бараа", href: "/arrivals" },
      { label: "Гол бараа", href: `/categories#${gender}` },
      { label: "Шилдэг борлуулалт", href: `/categories#${gender}` },
    ],
  },
  {
    title: "Цамц",
    links: [
      { label: "Свитр", href: `/categories#${gender}` },
      { label: "Кардиган", href: `/categories#${gender}` },
      { label: "Hoodie", href: `/categories#${gender}` },
      ...(gender === "women"
        ? [{ label: "Даашинз", href: `/categories#${gender}` }]
        : []),
    ],
  },
  {
    title: "Аксессуар",
    links: [
      { label: "Малгай", href: `/categories#${gender}` },
      { label: "Ороолт & Шаль", href: `/categories#${gender}` },
      { label: "Бээлий", href: `/categories#${gender}` },
      { label: "Гутал", href: "/categories#shoes" },
    ],
  },
  {
    title: "Гадуур хувцас",
    links: [
      { label: "Пальто", href: "/categories#outerwear" },
      { label: "Блэйзер", href: "/categories#outerwear" },
      { label: "Куртка", href: "/categories#outerwear" },
    ],
  },
];

const megaFeatures = (gender: "women" | "men") => [
  {
    href: "/arrivals",
    image:
      gender === "women"
        ? "/images/front-view-woman-posing-beach_23-2150100135.jpg"
        : "/images/full-shot-woman-taking-walk-nature_23-2150100065.jpg",
    title: "Коллекц",
    caption: "Хавар–Зун 2026",
  },
  {
    href: "/sale",
    image:
      gender === "women"
        ? "/images/smiley-woman-beach-front-view_23-2150100099.avif"
        : "/images/woman-walking-beach-side-view.jpg",
    title: "Хямдрал",
    caption: gender === "women" ? "Эмэгтэй хямдрал" : "Эрэгтэй хямдрал",
  },
];

export function SiteHeader() {
  const { count } = useCart();
  const { lang, setLang, t } = useLang();
  const headerRef = useRef<HTMLElement>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const fullHero = document.querySelector(".hero--video");
    if (!fullHero || !header) {
      setSolid(true);
      return;
    }
    const update = () => {
      const threshold = Math.max(
        (fullHero as HTMLElement).offsetHeight - header.offsetHeight,
        0,
      );
      setSolid(window.scrollY >= threshold - 4);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-lang-select]")) {
        setLangOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    const apply = () => {
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch {
        // ignore
      }
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
          <button
            type="button"
            className="nav-burger"
            aria-label="Open menu"
            aria-expanded={navOpen}
            aria-controls="primary-nav"
            onClick={() => setNavOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <Link className="brand" href="/">
            <span>TOD</span> CASHMERE
          </Link>
        </div>

        <nav className="nav-menu" id="primary-nav" aria-label="Primary">
          <ul className="nav-menu-list">
            {(["women", "men"] as const).map((gender) => (
              <li
                key={gender}
                className="nav-menu-item has-mega"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <Link
                  className="nav-menu-link"
                  href={`/categories#${gender}`}
                  onClick={() => setNavOpen(false)}
                >
                  {gender === "women" ? "Эмэгтэй" : "Эрэгтэй"}
                  <svg className="nav-caret" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </Link>
                <div className="mega-menu">
                  <div className="mega-inner">
                    <div className="mega-columns">
                      {megaColumns(gender).map((col) => (
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
                      {megaFeatures(gender).map((feature) => (
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
            ))}
            <li className="nav-menu-item">
              <Link className="nav-menu-link" href="/sale" onClick={() => setNavOpen(false)}>
                {t("sale")}
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link className="nav-menu-link" href="/arrivals" onClick={() => setNavOpen(false)}>
                {t("newArrivals")}
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link className="nav-menu-link" href="/lookbook" onClick={() => setNavOpen(false)}>
                Lookbook
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link className="nav-menu-link" href="/#bundle" onClick={() => setNavOpen(false)}>
                {t("bundle")}
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
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l4.25 4.25 1.49-1.49L15.5 14Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
            </svg>
          </button>

          <button
            type="button"
            className="nav-icon-button nav-icon-only theme-toggle"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
          >
            <svg className="icon-svg theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-13a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Zm0 14a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm8-6a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM6 12a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm11.66-6.66a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0ZM7.46 16.54a1 1 0 0 1 0 1.41l-.71.71a1 1 0 0 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0Zm10.2 1.41a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41ZM7.46 7.46a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41Z" />
            </svg>
            <svg className="icon-svg theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
            </svg>
          </button>

          <div className="lang-select" data-lang-select>
            <button
              type="button"
              className="nav-icon-button lang-toggle"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label="Select language"
              onClick={(e) => {
                e.stopPropagation();
                setLangOpen((o) => !o);
              }}
            >
              <span className="lang-current">{lang.toUpperCase()}</span>
              <svg className="nav-caret" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            <ul className={`lang-menu ${langOpen ? "open" : ""}`} role="listbox">
              <li>
                <button
                  type="button"
                  className={`lang-option ${lang === "mn" ? "is-active" : ""}`}
                  role="option"
                  aria-selected={lang === "mn"}
                  onClick={() => {
                    setLang("mn");
                    setLangOpen(false);
                  }}
                >
                  Монгол
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`lang-option ${lang === "en" ? "is-active" : ""}`}
                  role="option"
                  aria-selected={lang === "en"}
                  onClick={() => {
                    setLang("en");
                    setLangOpen(false);
                  }}
                >
                  English
                </button>
              </li>
            </ul>
          </div>
          <Link className="nav-icon-button nav-icon-only nav-cart" href="/cart" aria-label={t("cart")}>
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4h-2l-1 2h2l2.6 9h8.8l2.1-7H9.1l-.6-2h12.5V4H7Zm3 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
            </svg>
            <span className="cart-count">{count}</span>
          </Link>
        </div>

        <div className="nav-search" data-search-panel>
          <form
            role="search"
            action="/search"
            method="GET"
            onSubmit={() => setSearchActive(false)}
          >
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l4.25 4.25 1.49-1.49L15.5 14Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z" />
            </svg>
            <input
              type="search"
              name="q"
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              ref={searchInputRef}
            />
            <button
              type="button"
              className="nav-search-close"
              onClick={() => setSearchActive(false)}
            >
              {t("close")} ✕
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
