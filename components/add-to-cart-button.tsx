"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";
import { useLang } from "./lang-provider";

export function AddToCartButton({
  id,
  title,
  price,
  image,
  className,
  slug,
  size,
  sizes,
}: {
  id: string;
  title: string;
  price: number;
  image: string;
  className?: string;
  slug?: string;
  size?: string;
  sizes?: string[];
}) {
  const { addItem } = useCart();
  const { t } = useLang();
  const [status, setStatus] = useState<"idle" | "added">("idle");

  return (
    <button
      type="button"
      className={className}
      data-product-id={id}
      onClick={() => {
        addItem({ id, title, price, image, slug: slug ?? id, size, sizes });
        setStatus("added");
        setTimeout(() => setStatus("idle"), 1200);
      }}
    >
      {status === "added" ? t("added") : t("addToCart")}
    </button>
  );
}
