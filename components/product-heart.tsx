"use client";

import { useCatalogFavorites } from "./catalog-favorites";
import { HeartIcon } from "./catalog-grid";
import { useLang } from "./lang-provider";

const labels = {
  mn: { save: "Зүрхлэх", unsave: "Зүрхлэснээс хасах" },
  en: { save: "Save", unsave: "Remove from saved" },
  ru: { save: "В избранное", unsave: "Убрать из избранного" },
  zh: { save: "收藏", unsave: "取消收藏" },
};

/**
 * Heart on a shop product photo. Products share the hearted list with the
 * catalog, kept apart by a "product:" prefix.
 */
export function ProductHeart({ slug }: { slug: string }) {
  const { ids, toggle } = useCatalogFavorites();
  const { lang } = useLang();
  const id = `product:${slug}`;
  const saved = ids.includes(id);
  return (
    <button
      type="button"
      className={`katalog-heart ${saved ? "is-saved" : ""}`}
      aria-pressed={saved}
      aria-label={saved ? labels[lang].unsave : labels[lang].save}
      onClick={() => toggle(id)}
    >
      <HeartIcon />
    </button>
  );
}
