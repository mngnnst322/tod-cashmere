"use client";

import { useState } from "react";
import { saveCatalogItem } from "@/lib/admin-actions";
import type { catalogItems } from "@/lib/db/schema";
import { Modal } from "../modal";
import { btnDark, icons, input, label } from "../../ui";

type Item = typeof catalogItems.$inferSelect;

/** "+ Каталог нэмэх" (no item) or the row's "Засах" link (with item). */
export function CatalogItemButton({ type, item }: { type: string; item?: Item }) {
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
          <input type="hidden" name="type" value={type} />
          <div>
            <label className={label} htmlFor="catalog-name">
              Нэр
            </label>
            <input id="catalog-name" name="name" defaultValue={item?.name} required className={input} />
          </div>
          <div>
            <label className={label} htmlFor="catalog-material">
              Материал
            </label>
            <input
              id="catalog-material"
              name="material"
              defaultValue={item?.material}
              placeholder="100% ноолуур"
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
          <div>
            <label className={label} htmlFor="catalog-image">
              Зураг
            </label>
            <input id="catalog-image" type="file" name="imageFile" accept="image/*" className="w-full text-sm" />
            <input type="hidden" name="imagePath" value={item?.image ?? ""} />
          </div>
          <button type="submit" className={`${btnDark} w-full`}>
            Хадгалах
          </button>
        </form>
      </Modal>
    </>
  );
}
