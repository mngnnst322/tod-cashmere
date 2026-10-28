"use client";

import { useState } from "react";
import { saveCatalogItem } from "@/lib/admin-actions";
import type { catalogItems } from "@/lib/db/schema";
import { Modal } from "../modal";
import { GalleryField } from "../gallery-field";
import { ColorPicker } from "./color-picker";
import { SizePicker } from "../size-picker";
import { MEASUREMENTS, parseMeasurements } from "@/lib/measurements";
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
          <SizePicker defaultValue={item?.sizes} />
          <div>
            <span className={label}>Хэмжилт</span>
            <div className="grid grid-cols-3 gap-3">
              {MEASUREMENTS.map((d) => (
                <div key={d.key}>
                  <label className="mb-1 block text-xs text-adm-mute" htmlFor={`m-${d.key}`}>
                    {d.names.mn} ({d.unit})
                  </label>
                  <input
                    id={`m-${d.key}`}
                    name={`m-${d.key}`}
                    type="number"
                    step="0.5"
                    defaultValue={parseMeasurements(item?.measurements)[d.key] ?? ""}
                    className={input}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className={label}>Моделийн хэмжээ</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-adm-mute" htmlFor="c-modelHeight">
                  Моделийн өндөр (см)
                </label>
                <input
                  id="c-modelHeight"
                  name="modelHeight"
                  type="number"
                  defaultValue={item?.modelHeight ?? ""}
                  placeholder="175"
                  className={input}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-adm-mute" htmlFor="c-modelSize">
                  Өмссөн хэмжээ
                </label>
                <input
                  id="c-modelSize"
                  name="modelSize"
                  defaultValue={item?.modelSize ?? ""}
                  placeholder="S"
                  className={input}
                />
              </div>
            </div>
            <p className="mt-1.5 text-xs text-adm-mute">
              Сайт дээр: “Модель 175 см өндөртэй, S хэмжээ өмссөн.” гэж 4 хэлээр харагдана.
            </p>
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
