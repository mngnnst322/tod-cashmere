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
  const [size, setSize] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "warn" | "added">("idle");

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
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSize(null);
    setStatus("idle");
  }, [current?.layerId]);

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
  const sizes = (current?.sizes ?? "").split("/").map((s) => s.trim()).filter(Boolean);

  const addToCart = () => {
    if (!current || current.soldOut) return;
    if (sizes.length && !size) {
      setStatus("warn");
      return;
    }
    addItem({
      id: size ? `${current.slug}:${size}` : current.slug,
      title: size ? `${current.title} (${size})` : current.title,
      price: current.price,
      image: current.image,
      slug: current.slug,
      size: size ?? undefined,
      sizes: sizes.length ? sizes : undefined,
    });
    setStatus("added");
    setTimeout(() => setStatus("idle"), 1400);
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

          <div className="tryon-stage" aria-label={wornItems.map((i) => i.title).join(", ")}>
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

        {current && (
          <div className="tryon-bar" aria-live="polite">
            <div className="tryon-bar-head">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="tryon-bar-thumb" src={current.thumb} alt="" />
              <div className="tryon-bar-info">
                <strong>{current.title}</strong>
                <span>{current.color}</span>
              </div>
            </div>
            {sizes.length > 0 && !current.soldOut && (
              <div className="tryon-sizes" role="group" aria-label={t.size}>
                {sizes.map((s) => (
                  <button key={s} type="button" aria-pressed={size === s} onClick={() => { setSize(s); setStatus("idle"); }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="tryon-bar-price">
              <strong>{money(current.price)}</strong>
            </div>
            <div className="tryon-actions">
              {worn[current.slot] !== current.layerId ? (
                <button type="button" className="tryon-add is-ghost" onClick={() => tryOn(focus)}>
                  {t.tryOn}
                </button>
              ) : (
                <button type="button" className="tryon-add" disabled={current.soldOut} onClick={addToCart}>
                  {current.soldOut ? t.soldOut : status === "added" ? t.added : t.add}
                </button>
              )}
              <a className="tryon-link" href={`/product/${current.slug}`}>{t.details}</a>
              {current.slot === "head" && worn.head && (
                <button type="button" className="tryon-link" onClick={() => setWorn((w) => ({ ...w, head: undefined }))}>
                  {t.takeOff}
                </button>
              )}
            </div>
            {status === "warn" && <p className="tryon-warn">{t.pick}</p>}
            {wornItems.length > 0 && (
              <div className="tryon-worn">
                <ul>
                  {/* Each piece on the model with its own price, top to bottom. */}
                  {[...wornItems].reverse().map((i) => (
                    <li key={i.layerId}>
                      <button
                        type="button"
                        onClick={() => {
                          const idx = cards.findIndex((c) => c.layerId === i.layerId);
                          if (idx >= 0) setFocus(idx);
                        }}
                      >
                        <span>{t.types[i.type]}</span>
                        <em>{i.title}</em>
                      </button>
                      <strong>{money(i.price)}</strong>
                    </li>
                  ))}
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
        )}
      </div>
      <p className="tryon-note">{t.note}</p>
    </section>
  );
}
