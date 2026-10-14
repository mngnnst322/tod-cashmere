"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const PAGES = [
  { src: "/images/katalog-page-1.jpg", alt: "Tod Cashmere" },
  { src: "/images/katalog-page-2.jpg", alt: "Монгол бичиг" },
];
const SEEN_KEY = "katalog-intro-seen";
const TURN_MS = 900;

/**
 * Cover pages shown over /katalog like a book: each click turns a page, and
 * after the last one the catalog underneath is revealed. Shown once per
 * browser session.
 */
export function KatalogIntro({ hint, nextLabel }: { hint: string; nextLabel: string }) {
  const [page, setPage] = useState(0);
  const [gone, setGone] = useState(false);
  const done = page >= PAGES.length;

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) setGone(true);
    } catch {
      // storage blocked: just show the intro
    }
  }, []);

  useEffect(() => {
    if (gone) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [gone]);

  useEffect(() => {
    if (!done) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }
    const t = setTimeout(() => setGone(true), TURN_MS);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  const next = () => setPage((p) => Math.min(p + 1, PAGES.length));

  return (
    <div
      className={`katalog-intro ${done ? "is-done" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={nextLabel}
      onClick={next}
      onKeyDown={(e) => {
        if (["Enter", " ", "ArrowRight", "ArrowDown"].includes(e.key)) {
          e.preventDefault();
          next();
        }
      }}
    >
      <div className="katalog-intro-book">
        {PAGES.map((p, i) => (
          <div
            key={p.src}
            className={`katalog-intro-page ${i < page ? "is-turned" : ""}`}
            style={{ zIndex: PAGES.length - i }}
          >
            <Image src={p.src} alt={p.alt} fill priority sizes="100vmin" />
          </div>
        ))}
      </div>
      <div className="katalog-intro-hint" aria-hidden="true">
        {hint}
      </div>
    </div>
  );
}
