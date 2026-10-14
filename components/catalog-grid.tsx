"use client";

import Image from "next/image";
import Link from "next/link";
import type { catalogItems } from "@/lib/db/schema";
import { catalogItemName, type CatalogStrings } from "@/lib/catalog-i18n";
import type { Lang } from "@/lib/i18n";
import { useCatalogFavorites } from "./catalog-favorites";

export type CatalogItem = typeof catalogItems.$inferSelect;

export function CatalogGrid({
  items,
  strings,
  lang,
  savedOnly,
}: {
  items: CatalogItem[];
  strings: CatalogStrings;
  lang: Lang;
  /** Show only the items this browser has hearted (the "saved" page). */
  savedOnly?: boolean;
}) {
  const { ids, toggle } = useCatalogFavorites();
  const shown = savedOnly ? items.filter((i) => ids.includes(i.id)) : items;

  if (savedOnly && shown.length === 0) {
    return <p className="katalog-saved-empty">{strings.savedEmpty}</p>;
  }

  return (
    <div className="category-grid katalog-grid">
      {shown.map((item) => (
        <article className="katalog-card" id={item.id} key={item.id}>
          {/* Photo and name; the details are on the item page. */}
          <Link href={`/katalog/${item.id}`} className="katalog-card-link">
            <div className="katalog-card-image">
              {item.image && (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 300px"
                />
              )}
            </div>
            <div className="katalog-card-name">{catalogItemName(item.name, lang)}</div>
          </Link>
          <HeartButton
            saved={ids.includes(item.id)}
            onToggle={() => toggle(item.id)}
            strings={strings}
          />
        </article>
      ))}
    </div>
  );
}

/** The heart for a single item (the item page), wired to saved items. */
export function CatalogItemHeart({ id, strings }: { id: string; strings: CatalogStrings }) {
  const { ids, toggle } = useCatalogFavorites();
  return <HeartButton saved={ids.includes(id)} onToggle={() => toggle(id)} strings={strings} />;
}

export function HeartButton({
  saved,
  onToggle,
  strings,
}: {
  saved: boolean;
  onToggle: () => void;
  strings: CatalogStrings;
}) {
  return (
    <button
      type="button"
      className={`katalog-heart ${saved ? "is-saved" : ""}`}
      aria-pressed={saved}
      aria-label={saved ? strings.unsave : strings.save}
      onClick={onToggle}
    >
      <HeartIcon />
    </button>
  );
}

export function HeartIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
