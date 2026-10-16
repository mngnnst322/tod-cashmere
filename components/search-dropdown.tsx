"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Lang } from "@/lib/i18n";

type SearchProduct = {
  slug: string;
  titleMn: string;
  titleEn: string;
  titleRu: string | null;
  titleZh: string | null;
  image: string;
  price: number;
  compareAtPrice: number | null;
  badge: string | null;
};

const RECENT_KEY = "recent-searches";

const text: Record<Lang, Record<"recent" | "suggested" | "results" | "all" | "none" | "clear", string>> = {
  mn: { recent: "Сүүлд хайсан", suggested: "Санал болгох", results: "Бараа", all: "Бүх үр дүнг харах", none: "Илэрц олдсонгүй", clear: "Цэвэрлэх" },
  en: { recent: "Recent searches", suggested: "Suggested", results: "Products", all: "See all results", none: "No results", clear: "Clear" },
  ru: { recent: "Недавние запросы", suggested: "Рекомендуем", results: "Товары", all: "Все результаты", none: "Ничего не найдено", clear: "Очистить" },
  zh: { recent: "最近搜索", suggested: "推荐", results: "商品", all: "查看全部结果", none: "没有结果", clear: "清除" },
};

function titleOf(p: SearchProduct, lang: Lang) {
  if (lang === "mn") return p.titleMn;
  if (lang === "ru") return p.titleRu || p.titleEn;
  if (lang === "zh") return p.titleZh || p.titleEn;
  return p.titleEn;
}

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** Remembers a search term (newest first, up to 6). */
export function rememberSearch(term: string) {
  const q = term.trim();
  if (!q) return;
  try {
    const next = [q, ...readRecent().filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // storage blocked: nothing to remember
  }
}

/**
 * The white panel under the header search box: matching products while
 * typing, otherwise recent searches and suggested products.
 */
export function SearchDropdown({
  query,
  lang,
  onPick,
  onRecent,
}: {
  query: string;
  lang: Lang;
  /** Called when a result is followed, to close the search. */
  onPick: () => void;
  /** Fill the box with a recent search. */
  onRecent: (term: string) => void;
}) {
  const [products, setProducts] = useState<SearchProduct[] | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const t = text[lang];

  useEffect(() => {
    setRecent(readRecent());
    let cancelled = false;
    fetch("/api/products")
      .then((r) => (r.ok ? (r.json() as Promise<SearchProduct[]>) : []))
      .then((list) => !cancelled && setProducts(list))
      .catch(() => !cancelled && setProducts([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const q = query.trim().toLowerCase();
  const all = products ?? [];
  const matches = q
    ? all.filter((p) =>
        [p.titleMn, p.titleEn, p.titleRu, p.titleZh].some((v) => v?.toLowerCase().includes(q)),
      )
    : [];
  const shown = q ? matches.slice(0, 8) : all.slice(0, 4);

  const card = (p: SearchProduct) => (
    <li key={p.slug}>
      <Link
        href={`/product/${p.slug}`}
        className="search-result"
        onClick={() => {
          if (q) rememberSearch(query);
          onPick();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt="" loading="lazy" />
        <span className="search-result-title">{titleOf(p, lang)}</span>
        <span className="search-result-price">
          {formatPrice(p.price)}
          {p.compareAtPrice != null && <s>{formatPrice(p.compareAtPrice)}</s>}
        </span>
      </Link>
    </li>
  );

  return (
    <div className="search-dropdown">
      <div className="search-dropdown-inner">
        {!q && recent.length > 0 && (
          <div className="search-dropdown-recent">
            <div className="search-dropdown-heading">
              {t.recent}
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem(RECENT_KEY);
                  } catch {
                    // ignore
                  }
                  setRecent([]);
                }}
              >
                {t.clear}
              </button>
            </div>
            <div className="search-recent-list">
              {recent.map((r) => (
                <button key={r} type="button" onClick={() => onRecent(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="search-dropdown-heading">{q ? t.results : t.suggested}</div>
        {products && q && matches.length === 0 ? (
          <p className="search-dropdown-empty">{t.none}</p>
        ) : (
          <ul className="search-results">{shown.map(card)}</ul>
        )}

        {q && matches.length > 0 && (
          <Link
            href={`/search?q=${encodeURIComponent(query.trim())}`}
            className="search-dropdown-all"
            onClick={() => {
              rememberSearch(query);
              onPick();
            }}
          >
            {t.all} ({matches.length}) →
          </Link>
        )}
      </div>
    </div>
  );
}
