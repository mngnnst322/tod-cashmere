"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./cart-provider";
import { useLang } from "./lang-provider";
import { useMoney } from "./pricing-provider";

const text = {
  mn: { title: "Сагс", empty: "Таны сагс хоосон байна.", size: "Хэмжээ", qty: "Тоо", remove: "Хасах", total: "Нийт", checkout: "Захиалах", close: "Хаах", keep: "Үргэлжлүүлэн үзэх" },
  en: { title: "Cart", empty: "Your cart is empty.", size: "Size", qty: "Qty", remove: "Remove", total: "Total", checkout: "Checkout", close: "Close", keep: "Continue shopping" },
  ru: { title: "Корзина", empty: "Ваша корзина пуста.", size: "Размер", qty: "Кол-во", remove: "Удалить", total: "Итого", checkout: "Оформить", close: "Закрыть", keep: "Продолжить покупки" },
  zh: { title: "购物车", empty: "您的购物车是空的。", size: "尺码", qty: "数量", remove: "删除", total: "合计", checkout: "结算", close: "关闭", keep: "继续购物" },
};

/**
 * Slide-in cart: opens when something is added (or from the bag icon). Size
 * and quantity change in place; checkout continues on /cart.
 */
export function CartDrawer() {
  const { items, total, open, setOpen, addItem, decrementItem, removeItem, changeSize } = useCart();
  const { lang } = useLang();
  const money = useMoney();
  const t = text[lang];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <div className={`cart-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button type="button" className="cart-drawer-backdrop" aria-label={t.close} onClick={() => setOpen(false)} />
      <aside className="cart-drawer-panel" role="dialog" aria-label={t.title}>
        <header className="cart-drawer-head">
          <h2>
            {t.title} <span>({items.reduce((n, l) => n + l.qty, 0)})</span>
          </h2>
          <button type="button" className="cart-drawer-close" aria-label={t.close} onClick={() => setOpen(false)}>
            ×
          </button>
        </header>

        {items.length === 0 ? (
          <p className="cart-drawer-empty">{t.empty}</p>
        ) : (
          <ul className="cart-drawer-lines">
            {items.map((line) => (
              <li key={line.id} className="cart-drawer-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={line.image} alt="" />
                <div className="cart-drawer-info">
                  <div className="cart-drawer-name">{line.title}</div>
                  <div className="cart-drawer-price">{money(line.price)}</div>
                  {line.sizes && line.sizes.length > 0 && (
                    <label className="cart-drawer-field">
                      {t.size}
                      <select value={line.size ?? ""} onChange={(e) => changeSize(line.id, e.target.value)}>
                        {line.sizes.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <div className="cart-drawer-row">
                    <div className="cart-drawer-qty" aria-label={t.qty}>
                      <button type="button" onClick={() => decrementItem(line.id)} aria-label="−">
                        −
                      </button>
                      <span>{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => {
                          addItem(line);
                        }}
                        aria-label="+"
                      >
                        +
                      </button>
                    </div>
                    <button type="button" className="cart-drawer-remove" onClick={() => removeItem(line.id)}>
                      {t.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <footer className="cart-drawer-foot">
            <div className="cart-drawer-total">
              <span>{t.total}</span>
              <strong>{money(total)}</strong>
            </div>
            <Link href="/cart" className="cart-drawer-checkout" onClick={() => setOpen(false)}>
              {t.checkout}
            </Link>
            <button type="button" className="cart-drawer-keep" onClick={() => setOpen(false)}>
              {t.keep}
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
