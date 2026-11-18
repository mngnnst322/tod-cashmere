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
  },
  en: {
    eyebrow: "Virtual fitting",
    title: "Try it on",
    women: "Women", men: "Men",
    types: { hat: "Hats", tshirt: "T-shirts", shirt: "Tops", pants: "Trousers", skirt: "Skirts" },
    size: "Size", pick: "Please choose a size", add: "Add to cart", added: "Added",
    soldOut: "Sold out", details: "Details", takeOff: "Take off", look: "Look total",
    prev: "Previous", next: "Next", note: "Images show an approximate fit.",
  },
  ru: {
    eyebrow: "Виртуальная примерка",
    title: "Примерьте",
    women: "Женщинам", men: "Мужчинам",
    types: { hat: "Шапки", tshirt: "Футболки", shirt: "Кофты", pants: "Брюки", skirt: "Юбки" },
    size: "Размер", pick: "Выберите размер", add: "В корзину", added: "Добавлено",
    soldOut: "Нет в наличии", details: "Подробнее", takeOff: "Снять", look: "Итого за образ",
    prev: "Назад", next: "Вперёд", note: "Изображение показывает посадку приблизительно.",
  },
  zh: {
    eyebrow: "虚拟试穿",
    title: "试穿一下",
    women: "女士", men: "男士",
    types: { hat: "帽子", tshirt: "T恤", shirt: "上衣", pants: "裤子", skirt: "半身裙" },
    size: "尺码", pick: "请选择尺码", add: "加入购物车", added: "已加入",
    soldOut: "售罄", details: "详情", takeOff: "取下", look: "整套价格",
    prev: "上一个", next: "下一个", note: "图片仅显示大致上身效果。",
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
  const [type, setType] = useState<LookbookType>(types[0]);
  const activeType = types.includes(type) ? type : types[0];
  const cards = look.items.filter((i) => i.type === activeType);

  const [worn, setWorn] = useState<Worn>(() => initialLook(look.items));
  const [focus, setFocus] = useState(0); // index in `cards` shown in the panel
  const [size, setSize] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "warn" | "added">("idle");

  // A new gender starts from its own default outfit.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWorn(initialLook(look.items));
  }, [look]);

  // Opening a shelf shows what the model wears from it; if she wears nothing
  // from it yet (hats, or skirts while in trousers), its first item goes on,
  // so the model always matches the panel.
  useEffect(() => {
    if (!cards.length) return;
    const wornIdx = cards.findIndex((c) => worn[c.slot] === c.layerId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocus(wornIdx >= 0 ? wornIdx : 0);
    if (wornIdx < 0) setWorn((w) => ({ ...w, [cards[0].slot]: cards[0].layerId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, activeType]);

  const current = cards[Math.min(focus, cards.length - 1)];
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSize(null);
    setStatus("idle");
  }, [current?.layerId]);

  const select = (index: number) => {
    const n = cards.length;
    const i = ((index % n) + n) % n;
    setFocus(i);
    const item = cards[i];
    setWorn((w) => ({ ...w, [item.slot]: item.layerId }));
  };

  // Swipe / drag on the shelf.
  const drag = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (drag.current == null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (Math.abs(dx) > 40) select(focus + (dx < 0 ? 1 : -1));
  };

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
    <section className="tryon" aria-labelledby="tryon-title">
      <header className="tryon-head">
        <div>
          <p className="tryon-eyebrow">{t.eyebrow}</p>
          <h2 id="tryon-title" className="tryon-title">{t.title}</h2>
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
      </header>

      <div className="tryon-tabs" role="tablist">
        {types.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={key === activeType}
            onClick={() => setType(key)}
          >
            {t.types[key]}
          </button>
        ))}
      </div>

      <div className="tryon-body">
        <div
          className="tryon-floor"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") select(focus - 1);
            if (e.key === "ArrowRight") select(focus + 1);
          }}
        >
          <div className="tryon-shelf" aria-label={t.types[activeType]}>
            {cards.map((item, i) => {
              const offset = i - focus;
              const side = Math.sign(offset);
              const dist = Math.abs(offset);
              return (
                <button
                  key={item.layerId}
                  type="button"
                  className={`tryon-card ${dist === 0 ? "is-focus" : ""} ${item.soldOut ? "is-out" : ""}`}
                  style={{ "--off": offset, "--side": side, "--dist": dist } as React.CSSProperties}
                  aria-label={`${item.title}, ${item.color}, ${money(item.price)}`}
                  aria-current={worn[item.slot] === item.layerId}
                  tabIndex={dist === 0 ? 0 : -1}
                  hidden={dist > 4}
                  onClick={() => select(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.thumb} alt="" loading="lazy" draggable={false} />
                  <span className="tryon-card-name">{item.title}</span>
                  <span className="tryon-card-meta">{item.color}</span>
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
              <button type="button" className="tryon-arrow is-prev" aria-label={t.prev} onClick={() => select(focus - 1)}>
                ‹
              </button>
              <button type="button" className="tryon-arrow is-next" aria-label={t.next} onClick={() => select(focus + 1)}>
                ›
              </button>
            </>
          )}
        </div>

        {current && (
          <aside className="tryon-panel" aria-live="polite">
            <div className="tryon-panel-top">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.thumb} alt="" />
              <div>
                <h3>{current.title}</h3>
                <p className="tryon-muted">{current.color}</p>
                <p className="tryon-price">{money(current.price)}</p>
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
            {status === "warn" && <p className="tryon-warn">{t.pick}</p>}

            <div className="tryon-actions">
              <button type="button" className="tryon-add" disabled={current.soldOut} onClick={addToCart}>
                {current.soldOut ? t.soldOut : status === "added" ? t.added : t.add}
              </button>
              <a className="tryon-link" href={`/product/${current.slug}`}>{t.details}</a>
              {current.slot === "head" && worn.head && (
                <button type="button" className="tryon-link" onClick={() => setWorn((w) => ({ ...w, head: undefined }))}>
                  {t.takeOff}
                </button>
              )}
            </div>

            {wornItems.length > 1 && (
              <div className="tryon-look">
                <span>{t.look}</span>
                <strong>{money(lookTotal)}</strong>
              </div>
            )}
            <p className="tryon-note">{t.note}</p>
          </aside>
        )}
      </div>
    </section>
  );
}
