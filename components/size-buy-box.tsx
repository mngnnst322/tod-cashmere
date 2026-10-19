"use client";

import { useState } from "react";
import { AddToCartButton } from "./add-to-cart-button";
import { useLang } from "./lang-provider";

const text = {
  mn: { size: "Хэмжээ", pick: "Хэмжээгээ сонгоно уу" },
  en: { size: "Size", pick: "Please choose a size" },
  ru: { size: "Размер", pick: "Выберите размер" },
  zh: { size: "尺码", pick: "请选择尺码" },
};

/**
 * Size buttons and the add-to-cart button for a product page. Each size goes
 * into the cart as its own line ("Кардиган (M)").
 */
export function SizeBuyBox({
  slug,
  title,
  price,
  image,
  sizes,
}: {
  slug: string;
  title: string;
  price: number;
  image: string;
  /** "S / M / L"; empty when the product comes in one size. */
  sizes: string;
}) {
  const { lang } = useLang();
  const t = text[lang];
  const options = sizes
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
  const [size, setSize] = useState<string | null>(null);
  const [warn, setWarn] = useState(false);

  return (
    <div>
      {options.length > 0 && (
        <div className="katalog-item-option">
          <div className="katalog-item-label">{t.size}</div>
          <div className="katalog-sizes">
            {options.map((s) => (
              <button
                key={s}
                type="button"
                className={`katalog-size ${size === s ? "is-picked" : ""}`}
                aria-pressed={size === s}
                onClick={() => {
                  setSize(s);
                  setWarn(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {warn && <p className="size-warn">{t.pick}</p>}
        </div>
      )}
      <div
        className="product-detail-actions size-buy-actions"
        onClickCapture={(e) => {
          if (options.length > 0 && !size) {
            e.stopPropagation();
            setWarn(true);
          }
        }}
      >
        <AddToCartButton
          id={size ? `${slug}:${size}` : slug}
          title={size ? `${title} (${size})` : title}
          price={price}
          image={image}
          className="btn btn-primary product-page-cart"
        />
      </div>
    </div>
  );
}
