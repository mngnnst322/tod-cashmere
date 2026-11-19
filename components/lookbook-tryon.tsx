"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "./cart-provider";
import { useMoney } from "./pricing-provider";
import { useLang } from "./lang-provider";
import {
  LOOKBOOK_TYPES,
  SLOT_ORDER,
  type LookbookItem,
  type LookbookLook,
  type LookbookSlot,
  type LookbookType,
} from "@/lib/lookbook";

const text = {
  mn: {
    eyebrow: "Виртуал хувцаслалт",
    title: "Өмсөөд үзээрэй",
    women: "Эмэгтэй", men: "Эрэгтэй",
    types: { hat: "Малгай", tshirt: "Майк", shirt: "Цамц", pants: "Өмд", skirt: "Юбка" },
    size: "Хэмжээ", pick: "Хэмжээгээ сонгоно уу", add: "Сагсанд хийх", added: "Нэмэгдлээ",
    soldOut: "Дууссан", details: "Дэлгэрэнгүй", takeOff: "Тайлах", look: "Образын нийт үнэ",
    prev: "Өмнөх", next: "Дараах", note: "Зураг нь хувцас өмссөн байдлыг ойролцоогоор харуулна.",
    all: "Бүгд", tryOn: "Өмсөх", hint: "Хажуу тийш гүйлгээд хувцсаа сонгоорой",
  },
  en: {
    eyebrow: "Virtual fitting",
    title: "Try it on",
    women: "Women", men: "Men",
    types: { hat: "Hats", tshirt: "T-shirts", shirt: "Tops", pants: "Trousers", skirt: "Skirts" },
    size: "Size", pick: "Please choose a size", add: "Add to cart", added: "Added",
    soldOut: "Sold out", details: "Details", takeOff: "Take off", look: "Look total",
    prev: "Previous", next: "Next", note: "Images show an approximate fit.",
    all: "All", tryOn: "Try on", hint: "Scroll sideways and pick a piece",
  },
  ru: {
    eyebrow: "Виртуальная примерка",
    title: "Примерьте",
    women: "Женщинам", men: "Мужчинам",
    types: { hat: "Шапки", tshirt: "Футболки", shirt: "Кофты", pants: "Брюки", skirt: "Юбки" },
    size: "Размер", pick: "Выберите размер", add: "В корзину", added: "Добавлено",
    soldOut: "Нет в наличии", details: "Подробнее", takeOff: "Снять", look: "Итого за образ",
    prev: "Назад", next: "Вперёд", note: "Изображение показывает посадку приблизительно.",
    all: "Все", tryOn: "Примерить", hint: "Листайте в сторону и выберите вещь",
  },
  zh: {
    eyebrow: "虚拟试穿",
    title: "试穿一下",
    women: "女士", men: "男士",
    types: { hat: "帽子", tshirt: "T恤", shirt: "上衣", pants: "裤子", skirt: "半身裙" },
    size: "尺码", pick: "请选择尺码", add: "加入购物车", added: "已加入",
    soldOut: "售罄", details: "详情", takeOff: "取下", look: "整套价格",
    prev: "上一个", next: "下一个", note: "图片仅显示大致上身效果。",
    all: "全部", tryOn: "试穿", hint: "左右滑动选择单品",
  },
};


/* ---- Cut-out: the model photo and her garment layers are studio shots on a
   light grey backdrop. To stand her in the room (with the big word behind
   her, hidden by her body), the outfit is drawn onto a canvas and every pixel
   close to the backdrop colour of its row is made transparent. ---- */

const imageCache = new Map<string, Promise<HTMLImageElement>>();
function loadImage(src: string) {
  let p = imageCache.get(src);
  if (!p) {
    p = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    imageCache.set(src, p);
  }
  return p;
}

const backdropCache = new Map<string, Float32Array>();
/**
 * Backdrop model per row: the studio grey shifts from the left edge to the
 * right and is brighter in the middle (vignette), so each row stores the
 * colour at both edges (L, R) and a centre bulge (B):
 * bg(t) = L + (R - L) t + B * 4t(1 - t), t = x / width.
 */
function backdropRows(data: Uint8ClampedArray, w: number, h: number) {
  const rows = new Float32Array(h * 9);
  const strip = Math.max(4, Math.round(w * 0.025));
  const mean = (y: number, x0: number) => {
    let r = 0, g = 0, b = 0;
    for (let x = x0; x < x0 + strip; x++) {
      const i = (y * w + x) * 4;
      r += data[i]; g += data[i + 1]; b += data[i + 2];
    }
    return [r / strip, g / strip, b / strip];
  };
  const tA = 0.15, tB = 0.85, k = 4 * tA * (1 - tA);
  for (let y = 0; y < h; y++) {
    const L = mean(y, 2);
    const R = mean(y, w - strip - 2);
    const A = mean(y, Math.round(w * tA - strip / 2));
    const Bs = mean(y, Math.round(w * tB - strip / 2));
    for (let c = 0; c < 3; c++) {
      const lin = (t: number) => L[c] + (R[c] - L[c]) * t;
      // Garments only ever darken a strip, so the larger estimate wins.
      const bulge = Math.max(0, (A[c] - lin(tA)) / k, (Bs[c] - lin(tB)) / k);
      rows[y * 9 + c] = L[c];
      rows[y * 9 + 3 + c] = R[c];
      rows[y * 9 + 6 + c] = bulge;
    }
  }
  return rows;
}

async function drawCutOut(canvas: HTMLCanvasElement, model: string, layers: string[]) {
  const [base, ...rest] = await Promise.all([model, ...layers].map(loadImage));
  const scale = Math.min(1, 1500 / base.naturalHeight);
  const w = Math.round(base.naturalWidth * scale);
  const h = Math.round(base.naturalHeight * scale);
  const work = document.createElement("canvas");
  work.width = w;
  work.height = h;
  const ctx = work.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("no canvas");
  const key = `${model}@${w}`;
  let bg = backdropCache.get(key);
  ctx.drawImage(base, 0, 0, w, h);
  if (!bg) {
    bg = backdropRows(ctx.getImageData(0, 0, w, h).data, w, h);
    backdropCache.set(key, bg);
  }
  for (const img of rest) ctx.drawImage(img, 0, 0, w, h);
  const frame = ctx.getImageData(0, 0, w, h);
  const d = frame.data;
  const LO = 11, HI = 28;
  for (let y = 0; y < h; y++) {
    const o = y * 9;
    for (let x = 0; x < w; x++) {
      const t = x / (w - 1);
      const q = 4 * t * (1 - t);
      const br = bg[o] + (bg[o + 3] - bg[o]) * t + bg[o + 6] * q;
      const bgc = bg[o + 1] + (bg[o + 4] - bg[o + 1]) * t + bg[o + 7] * q;
      const bb = bg[o + 2] + (bg[o + 5] - bg[o + 2]) * t + bg[o + 8] * q;
      const i = (y * w + x) * 4;
      const dist = Math.max(Math.abs(d[i] - br), Math.abs(d[i + 1] - bgc), Math.abs(d[i + 2] - bb));
      if (dist <= LO) d[i + 3] = 0;
      else if (dist < HI) d[i + 3] = Math.round((255 * (dist - LO)) / (HI - LO));
    }
  }
  ctx.putImageData(frame, 0, 0);
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")?.drawImage(work, 0, 0);
}

type Worn = Partial<Record<LookbookSlot, string>>; // slot -> layerId

/** Puts on the first item of each body slot except the head, so the model opens dressed. */
function initialLook(items: LookbookItem[]): Worn {
  const worn: Worn = {};
  for (const slot of ["top", "bottom"] as const) {
    const first = items.find((i) => i.slot === slot && !i.soldOut) ?? items.find((i) => i.slot === slot);
    if (first) worn[slot] = first.layerId;
  }
  return worn;
}

type Shelf = LookbookType | "all";

export function LookbookTryOn({ looks }: { looks: LookbookLook[] }) {
  const { lang } = useLang();
  const t = text[lang];
  const money = useMoney();
  const { addItem } = useCart();

  const [gender, setGender] = useState(looks[0].gender);
  const look = looks.find((l) => l.gender === gender) ?? looks[0];
  const types = useMemo(
    () => LOOKBOOK_TYPES.filter((ty) => look.items.some((i) => i.type === ty.key)).map((ty) => ty.key),
    [look],
  );
  // "All" lines up every garment around the model; a tab narrows to one type.
  const [shelf, setShelf] = useState<Shelf>("all");
  const activeShelf: Shelf = shelf === "all" || types.includes(shelf) ? shelf : "all";
  const cards = useMemo(
    () =>
      activeShelf === "all"
        ? types.flatMap((ty) => look.items.filter((i) => i.type === ty))
        : look.items.filter((i) => i.type === activeShelf),
    [look, types, activeShelf],
  );

  const [worn, setWorn] = useState<Worn>(() => initialLook(look.items));
  const [focus, setFocus] = useState(0); // index in `cards` of the piece in the bar
  // Per worn piece (by layerId): the size picked and the cart button state.
  const [sizeOf, setSizeOf] = useState<Record<string, string>>({});
  const [statusOf, setStatusOf] = useState<Record<string, "warn" | "added">>({});

  // A new gender starts from its own default outfit.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWorn(initialLook(look.items));
  }, [look]);

  // A new shelf centres on what the model already wears from it.
  useEffect(() => {
    if (!cards.length) return;
    const wornIdx = cards.findIndex((c) => worn[c.slot] === c.layerId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocus(wornIdx >= 0 ? wornIdx : 0);
    if (activeShelf !== "all" && wornIdx < 0) setWorn((w) => ({ ...w, [cards[0].slot]: cards[0].layerId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, activeShelf]);

  const current = cards[Math.min(focus, cards.length - 1)];

  const wrap = (index: number) => {
    const n = cards.length;
    return ((index % n) + n) % n;
  };
  /** Moves the row so this card is in the middle, without dressing the model. */
  const browse = (index: number) => setFocus(wrap(index));
  /** Puts the card's garment on the model and brings it to the middle. */
  const tryOn = (index: number) => {
    const i = wrap(index);
    setFocus(i);
    const item = cards[i];
    setWorn((w) => ({ ...w, [item.slot]: item.layerId }));
  };

  // Drag, swipe and sideways trackpad scroll move the row.
  const floorRef = useRef<HTMLDivElement>(null);

  // The outfit as a cut-out on a canvas; until it is drawn (or if the
  // browser can't), the plain photo stack below shows instead.
  const cutRef = useRef<HTMLCanvasElement>(null);
  const [cutReady, setCutReady] = useState(false);
  const wornLayers = SLOT_ORDER.map((slot) => look.items.find((i) => i.layerId === worn[slot])?.layer).filter(
    (x): x is string => Boolean(x),
  );
  const wornKey = wornLayers.join("|");
  useEffect(() => {
    const canvas = cutRef.current;
    if (!canvas) return;
    let live = true;
    drawCutOut(canvas, look.model, wornKey ? wornKey.split("|") : [])
      .then(() => live && setCutReady(true))
      .catch(() => live && setCutReady(false));
    return () => {
      live = false;
    };
  }, [look.model, wornKey]);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const focusRef = useRef(focus);
  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);
  useEffect(() => {
    const el = floorRef.current;
    if (!el) return;
    let acc = 0;
    const onWheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!d) return;
      e.preventDefault();
      acc += d;
      if (Math.abs(acc) >= 60) {
        setFocus((f) => {
          const n = cards.length || 1;
          return (((f + (acc > 0 ? 1 : -1)) % n) + n) % n;
        });
        acc = 0;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [cards.length]);

  const wornItems = SLOT_ORDER.map((slot) => look.items.find((i) => i.layerId === worn[slot])).filter(
    (i): i is LookbookItem => Boolean(i),
  );
  const lookTotal = wornItems.reduce((sum, i) => sum + i.price, 0);
  const sizesOf = (item: LookbookItem) => item.sizes.split("/").map((x) => x.trim()).filter(Boolean);

  const addToCart = (item: LookbookItem) => {
    if (item.soldOut) return;
    const sizes = sizesOf(item);
    const size = sizeOf[item.layerId];
    if (sizes.length && !size) {
      setStatusOf((st) => ({ ...st, [item.layerId]: "warn" }));
      return;
    }
    addItem({
      id: size ? `${item.slug}:${size}` : item.slug,
      title: size ? `${item.title} (${size})` : item.title,
      price: item.price,
      image: item.image,
      slug: item.slug,
      size: size || undefined,
      sizes: sizes.length ? sizes : undefined,
    });
    setStatusOf((st) => ({ ...st, [item.layerId]: "added" }));
    setTimeout(
      () =>
        setStatusOf((st) => {
          const next = { ...st };
          delete next[item.layerId];
          return next;
        }),
      1400,
    );
  };

  return (
    <section className="tryon" aria-label={t.title}>
      <div className="tryon-room">
        <div className="tryon-top">
          <div className="tryon-tabs" role="tablist">
            {(["all", ...types] as Shelf[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={key === activeShelf}
                onClick={() => setShelf(key)}
              >
                {key === "all" ? t.all : t.types[key]}
              </button>
            ))}
          </div>
          {looks.length > 1 && (
            <div className="tryon-switch" role="group">
              {looks.map((l) => (
                <button
                  key={l.gender}
                  type="button"
                  aria-pressed={l.gender === gender}
                  onClick={() => setGender(l.gender)}
                >
                  {t[l.gender]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          ref={floorRef}
          className="tryon-floor"
          tabIndex={0}
          aria-roledescription="carousel"
          onPointerDown={(e) => {
            drag.current = { x: e.clientX, moved: false };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            const dx = e.clientX - d.x;
            if (Math.abs(dx) > 70) {
              d.moved = true;
              d.x = e.clientX;
              browse(focusRef.current + (dx < 0 ? 1 : -1));
            }
          }}
          onPointerUp={() => {
            setTimeout(() => (drag.current = null), 0);
          }}
          onPointerLeave={() => (drag.current = null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") browse(focus - 1);
            if (e.key === "ArrowRight") browse(focus + 1);
            if (e.key === "Enter") tryOn(focus);
          }}
        >
          <span className="tryon-word" aria-hidden="true">CASHMERE</span>

          <div className="tryon-shelf" aria-label={activeShelf === "all" ? t.all : t.types[activeShelf]}>
            {cards.map((item, i) => {
              // Shortest way round the ring, so the row loops.
              let offset = i - focus;
              const n = cards.length;
              if (n > 2) offset = ((offset + n / 2) % n + n) % n - n / 2;
              const side = offset === 0 ? 1 : Math.sign(offset);
              const dist = Math.abs(offset);
              const onModel = worn[item.slot] === item.layerId;
              return (
                <button
                  key={item.layerId}
                  type="button"
                  className={`tryon-card ${dist < 0.5 ? "is-focus" : ""} ${onModel ? "is-on" : ""} ${item.soldOut ? "is-out" : ""}`}
                  style={{ "--off": offset, "--side": side, "--dist": dist } as React.CSSProperties}
                  aria-label={`${item.title}, ${item.color}, ${money(item.price)}`}
                  aria-pressed={onModel}
                  tabIndex={-1}
                  hidden={dist > 5}
                  onClick={() => {
                    if (drag.current?.moved) return;
                    tryOn(i);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.thumb} alt="" loading="lazy" draggable={false} />
                  <span className="tryon-card-name">{item.title}</span>
                  <span className="tryon-card-meta">{item.color}</span>
                  <span className="tryon-card-try" aria-hidden="true">{onModel ? "✓" : t.tryOn}</span>
                </button>
              );
            })}
          </div>

          <div
            className={`tryon-stage ${cutReady ? "is-cut" : ""}`}
            aria-label={wornItems.map((i) => i.title).join(", ")}
          >
            <canvas ref={cutRef} className="tryon-cut" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="tryon-layer" src={look.model} alt="" />
            {SLOT_ORDER.flatMap((slot) =>
              look.items
                .filter((i) => i.slot === slot)
                .map((i) => (
                  // Every layer of the gender is mounted (lazy) so switching is a fade, not a load.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i.layerId}
                    className={`tryon-layer ${worn[slot] === i.layerId ? "" : "is-off"}`}
                    src={i.layer}
                    alt=""
                    loading={worn[slot] === i.layerId ? "eager" : "lazy"}
                  />
                )),
            )}
          </div>

          {cards.length > 1 && (
            <>
              <button type="button" className="tryon-arrow is-prev" aria-label={t.prev} onClick={() => browse(focus - 1)}>
                ‹
              </button>
              <button type="button" className="tryon-arrow is-next" aria-label={t.next} onClick={() => browse(focus + 1)}>
                ›
              </button>
            </>
          )}
          <p className="tryon-hint">{t.hint}</p>
        </div>

        {wornItems.length > 0 && (
          <div className="tryon-bar" aria-live="polite">
            {/* Every piece on the model, head to toe, each with its own
                photo, details, size and cart button. */}
            <ul className="tryon-worn">
              {[...wornItems].reverse().map((item) => {
                const sizes = sizesOf(item);
                const st = statusOf[item.layerId];
                return (
                  <li key={item.layerId} className={item.layerId === current?.layerId ? "is-current" : ""}>
                    <button
                      type="button"
                      className="tryon-worn-photo"
                      aria-label={item.title}
                      onClick={() => {
                        const idx = cards.findIndex((c) => c.layerId === item.layerId);
                        if (idx >= 0) setFocus(idx);
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.thumb} alt="" />
                    </button>
                    <div className="tryon-worn-info">
                      <span className="tryon-worn-type">{t.types[item.type]}</span>
                      <strong>{item.title}</strong>
                      <span className="tryon-worn-color">{item.color}</span>
                      <span className="tryon-worn-price">{money(item.price)}</span>
                      {sizes.length > 0 && !item.soldOut && (
                        <div className="tryon-sizes" role="group" aria-label={t.size}>
                          {sizes.map((x) => (
                            <button
                              key={x}
                              type="button"
                              aria-pressed={sizeOf[item.layerId] === x}
                              onClick={() => {
                                setSizeOf((m) => ({ ...m, [item.layerId]: x }));
                                setStatusOf((m) => {
                                  const next = { ...m };
                                  delete next[item.layerId];
                                  return next;
                                });
                              }}
                            >
                              {x}
                            </button>
                          ))}
                        </div>
                      )}
                      {st === "warn" && <span className="tryon-warn">{t.pick}</span>}
                      <div className="tryon-actions">
                        <button
                          type="button"
                          className="tryon-add"
                          disabled={item.soldOut}
                          onClick={() => addToCart(item)}
                        >
                          {item.soldOut ? t.soldOut : st === "added" ? t.added : t.add}
                        </button>
                        <a className="tryon-link" href={`/product/${item.slug}`}>{t.details}</a>
                        {item.slot === "head" && (
                          <button
                            type="button"
                            className="tryon-link"
                            onClick={() => setWorn((w) => ({ ...w, head: undefined }))}
                          >
                            {t.takeOff}
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {wornItems.length > 1 && (
              <div className="tryon-worn-total">
                <span>{t.look}</span>
                <strong>{money(lookTotal)}</strong>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="tryon-note">{t.note}</p>
    </section>
  );
}
