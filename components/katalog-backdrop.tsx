// The pencil-sketch strips from the printed catalog, one behind each /katalog
// page; it stays put while the page scrolls over it.
const BACKDROPS = 5;

/** Picks a strip from any text (the page's type, item id, ...) so different pages differ. */
export function backdropFor(key: string) {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % BACKDROPS;
}

export function KatalogBackdrop({ index }: { index: number }) {
  return (
    <div
      className="katalog-backdrop"
      aria-hidden="true"
      style={{ backgroundImage: `url(/images/katalog-bg-${(index % BACKDROPS) + 1}.jpg)` }}
    />
  );
}
