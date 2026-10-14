"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATALOG_GROUPS } from "@/lib/catalog-types";

const typeHref = (type: string) => `/katalog?type=${encodeURIComponent(type)}`;

/**
 * The storefront header's look (transparent over the hero, dropdown menus)
 * with a menu of catalog garment types instead of shop links.
 */
export function CatalogHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

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

  const close = () => setNavOpen(false);

  return (
    <header
      className={`site-header ${solid || megaOpen ? "is-solid" : ""} ${navOpen ? "nav-open" : ""}`}
      data-site-header
      ref={headerRef}
    >
      <div className="nav">
        <div className="nav-left">
          <button
            type="button"
            className="nav-burger"
            aria-label="Цэс нээх"
            aria-expanded={navOpen}
            aria-controls="catalog-nav"
            onClick={() => setNavOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <Link className="brand" href="/katalog" onClick={close}>
            <span>TOD</span> CASHMERE
          </Link>
        </div>

        <nav className="nav-menu" id="catalog-nav" aria-label="Каталог">
          <ul className="nav-menu-list">
            {CATALOG_GROUPS.map((group) => (
              <li
                key={group.title}
                className="nav-menu-item has-mega"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <Link
                  className="nav-menu-link"
                  href={`/katalog#${encodeURIComponent(group.title)}`}
                  onClick={close}
                >
                  {group.title}
                  <svg className="nav-caret" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </Link>
                <div className="mega-menu">
                  <div className="mega-inner">
                    <div className="mega-columns">
                      <div className="mega-col">
                        <ul>
                          {group.types.map((type) => (
                            <li key={type}>
                              <Link href={typeHref(type)} onClick={close}>
                                {type}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            <li className="nav-menu-item">
              <Link className="nav-menu-link" href="/katalog#all" onClick={close}>
                Бүгд
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
