"use client";

import { useState } from "react";
import { saveCatalogItem } from "@/lib/admin-actions";
import type { catalogItems } from "@/lib/db/schema";
import { Modal } from "../modal";
import { GalleryField } from "../gallery-field";
import { ColorPicker } from "./color-picker";
import { btnDark, icons, input, label } from "../../ui";

type Item = typeof catalogItems.$inferSelect;

/** The item's photos; older items only have the single cover `image`. */
function parseImages(item?: Item): string[] {
  if (!item) return [];
  try {
    const list = JSON.parse(item.images) as string[];
    if (list.length) return list;
  } catch {
    // fall through to the cover
  }
  return item.image ? [item.image] : [];
}

/** "+ Каталог нэмэх" (no item) or the row's "Засах" link (with item). */
export function CatalogItemButton({
  gender,
  type,
  item,
}: {
  gender: string;
  type: string;
  item?: Item;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {item ? (
        <button type="button" className="mr-4 text-blue-700 hover:underline" onClick={() => setOpen(true)}>
          Засах
        </button>
      ) : (
        <button type="button" className={btnDark} onClick={() => setOpen(true)}>
          {icons.plus}
          Каталог нэмэх
        </button>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={item ? "Каталог засах" : "Каталог нэмэх"}
        subtitle={type}
      >
        <form action={saveCatalogItem.bind(null, item?.id ?? null)} className="space-y-4 text-left">
          <input type="hidden" name="gender" value={gender} />
          <input type="hidden" name="type" value={type} />
          <div>
            <label className={label} htmlFor="catalog-name">
              Нэр
            </label>
            <input id="catalog-name" name="name" defaultValue={item?.name} required className={input} />
          </div>
          <div>
            <label className={label} htmlFor="catalog-code">
              Код
            </label>
            <input
              id="catalog-code"
              name="code"
              defaultValue={item?.code}
              placeholder="12-10-335"
              className={input}
            />
          </div>
          <div>
            <label className={label} htmlFor="catalog-material">
              Материал
            </label>
            <input
              id="catalog-material"
              name="material"
              defaultValue={item?.material}
              placeholder="100% Mongolian cashmere"
              className={input}
            />
          </div>
          <ColorPicker defaultValue={item?.colors} />
          <div>
            <label className={label} htmlFor="catalog-sizes">
              Хэмжээ
            </label>
            <input
              id="catalog-sizes"
              name="sizes"
              defaultValue={item?.sizes}
              placeholder="S / M / L / XL / 2XL"
              className={input}
            />
          </div>
          <div>
            <label className={label} htmlFor="catalog-order">
              Дараалал
            </label>
            <input
              id="catalog-order"
              name="sortOrder"
              type="number"
              defaultValue={item?.sortOrder ?? 0}
              className={input}
            />
          </div>
          <GalleryField images={parseImages(item)} cover={item?.image} />
          <button type="submit" className={`${btnDark} w-full`}>
            Хадгалах
          </button>
        </form>
      </Modal>
    </>
  );
}
