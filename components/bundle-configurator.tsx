"use client";

import { useMemo, useState } from "react";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/products";

const lookItems = [
  {
    id: "look-coat-1",
    no: "01",
    title: "Ноолуур хосолсон урт пальто",
    detail1: "Хар саарал · M размер",
    detail2: "Самнасан гадарга · дотортой",
    price: 890000,
    x: 27,
    y: 42,
    side: "left" as const,
  },
  {
    id: "look-turtleneck-1",
    no: "02",
    title: "Зөөлөн ноолууран өндөр захт",
    detail1: "Дулаан зааны яс · M размер",
    detail2: "16 микрон · сул загвар",
    price: 289000,
    x: 70,
    y: 33,
    side: "right" as const,
  },
  {
    id: "look-trouser-1",
    no: "03",
    title: "Өргөн эсгүүртэй өмд",
    detail1: "Зэс хүрэн · 38 размер",
    detail2: "Зөөлөн эсгүүр · урт загвар",
    price: 349000,
    x: 68,
    y: 63,
    side: "right" as const,
  },
  {
    id: "look-scarf-1",
    no: "04",
    title: "Хөнгөн ноолууран ороолт",
    detail1: "Мөөгөн бор · Нэг размер",
    detail2: "Цэвэр ноолуур · 180 × 40 см",
    price: 159000,
    x: 28,
    y: 25,
    side: "left" as const,
  },
  {
    id: "look-boots-1",
    no: "05",
    title: "Арьсан шагайн гутал",
    detail1: "Эспрессо хүрэн · 38 размер",
    detail2: "Тугалын арьс · 55 мм өсгий",
    price: 279000,
    x: 66,
    y: 91,
    side: "right" as const,
  },
];

export function BundleConfigurator() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(lookItems.map((i) => i.id)),
  );
  const { addItem } = useCart();
  const [status, setStatus] = useState("");

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { subtotal, discount, total, tierLabel, hint } = useMemo(() => {
    const chosen = lookItems.filter((i) => selected.has(i.id));
    const subtotal = chosen.reduce((sum, i) => sum + i.price, 0);
    let rate = 0;
    let tierLabel = "Бараа тус бүрийн үнэ";
    let hint = "Багцын үнэ авахын тулд 3-аас дээш бараа сонгоно уу.";
    if (chosen.length === 5) {
      rate = 0.2;
      tierLabel = "Бүтэн төрхийн үнэ · 20% хямд";
      hint = "5 бараатай бүтэн төрхөөс 20% хэмнээрэй.";
    } else if (chosen.length >= 3) {
      rate = 0.12;
      tierLabel = "Сонголтын үнэ · 12% хямд";
      hint = "3-аас дээш бараа сонгоод 12% хэмнээрэй.";
    }
    const discount = Math.round(subtotal * rate);
    return { subtotal, discount, total: subtotal - discount, tierLabel, hint };
  }, [selected]);

  return (
    <section
      className="bundle-home-section"
      id="bundle"
      aria-labelledby="bundle-title"
    >
      <div className="bundle-main">
        <header className="bundle-intro">
          <div>
            <p className="bundle-eyebrow">Төрх 04 · Намрын ателье</p>
            <h2 id="bundle-title">Нам гүм илэрхийлэл</h2>
          </div>
          <p className="bundle-intro-copy">
            Хүссэн хувцсаа сонгох эсвэл бүтэн төрхийг хамгийн таатай үнээр
            аваарай.
          </p>
        </header>

        <div className="bundle-workspace">
          <figure className="bundle-look" aria-label="Нам гүм илэрхийлэл">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/bundle-look-01.png"
              alt="Model wearing the five-piece Atelier bundle"
              loading="lazy"
            />
            <div className="bundle-look-shade" aria-hidden="true"></div>
            {lookItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`look-marker look-marker--${item.side} ${selected.has(item.id) ? "is-active" : ""}`}
                style={
                  {
                    "--marker-x": `${item.x}%`,
                    "--marker-y": `${item.y}%`,
                  } as React.CSSProperties
                }
                data-marker-id={item.id}
                aria-label={`${item.title}, ${formatPrice(item.price)}`}
                onClick={() => toggle(item.id)}
              >
                <span className="look-marker-dot">{item.no}</span>
                <span className="look-marker-label">
                  <span>{item.title}</span>
                  <strong>{formatPrice(item.price)}</strong>
                </span>
              </button>
            ))}
            <figcaption>
              <span>Atelier series</span>
              <span>Ulaanbaatar · 2026</span>
            </figcaption>
          </figure>

          <aside className="bundle-panel" aria-labelledby="bundle-edit-title">
            <div className="bundle-panel-head">
              <div>
                <p className="bundle-panel-kicker">TOD / 04</p>
                <h3 id="bundle-edit-title">Төрхөө бүрдүүлэх</h3>
              </div>
              <button
                type="button"
                className="bundle-select-all"
                onClick={() => setSelected(new Set(lookItems.map((i) => i.id)))}
              >
                Бүгдийг сонгох
              </button>
            </div>

            <div className="bundle-selection-count" aria-live="polite">
              <span>{selected.size}</span>/5 сонгосон
            </div>

            <div className="bundle-items">
              {lookItems.map((item) => (
                <label
                  key={item.id}
                  className={`bundle-item ${selected.has(item.id) ? "is-selected" : ""}`}
                  data-bundle-item={item.id}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    value={item.id}
                    onChange={() => toggle(item.id)}
                  />
                  <span className="bundle-check" aria-hidden="true"></span>
                  <span className="bundle-item-no">{item.no}</span>
                  <span className="bundle-item-copy">
                    <strong>{item.title}</strong>
                    <small>{item.detail1}</small>
                    <small>{item.detail2}</small>
                  </span>
                  <span className="bundle-item-price">
                    {formatPrice(item.price)}
                  </span>
                </label>
              ))}
            </div>

            <section className="bundle-summary" aria-labelledby="bundle-pricing-title">
              <div className="bundle-summary-head">
                <h4 id="bundle-pricing-title">Багцын үнэ</h4>
                <span className="bundle-tier">{tierLabel}</span>
              </div>
              <dl>
                <div>
                  <dt>Барааны нийт</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="bundle-saving-row">
                  <dt>Таны хэмнэлт</dt>
                  <dd>−{formatPrice(discount)}</dd>
                </div>
                <div className="bundle-total-row">
                  <dt>Багцын нийт</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
              <p className="bundle-hint">{hint}</p>
              <button
                type="button"
                className="bundle-add"
                disabled={selected.size === 0}
                onClick={() => {
                  lookItems
                    .filter((i) => selected.has(i.id))
                    .forEach((i) =>
                      addItem({
                        id: i.id,
                        title: i.title,
                        price: i.price,
                        image: "/images/bundle-look-01.png",
                      }),
                    );
                  setStatus("Багц сагсанд нэмэгдлээ");
                  setTimeout(() => setStatus(""), 2000);
                }}
              >
                <span>Сонгосон багцыг сагслах</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13M14 7l5 5-5 5" />
                </svg>
              </button>
              <p className="bundle-status" role="status" aria-live="polite">
                {status}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
