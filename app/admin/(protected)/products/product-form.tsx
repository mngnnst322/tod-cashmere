"use client";

import Link from "next/link";
import { useState } from "react";
import type { categories, products } from "@/lib/db/schema";
import { input } from "../../ui";
import { GalleryField } from "../gallery-field";
import { SizePicker } from "../size-picker";

type Category = typeof categories.$inferSelect;
type Product = typeof products.$inferSelect;

const LANGS = [
  { code: "mn", label: "MN", field: "titleMn" },
  { code: "en", label: "EN", field: "titleEn" },
  { code: "ru", label: "RU", field: "titleRu" },
  { code: "zh", label: "ZH", field: "titleZh" },
] as const;

const cap = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-adm-mute";
const group = "mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-adm-mute";

/**
 * Add / edit product, shown as a drawer from the right over the product list.
 * The name has MN/EN/RU/ZH tabs: only Mongolian is required, and any other
 * language left empty is translated automatically on save.
 */
export function ProductForm({
  action,
  categories,
  product,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  product?: Product;
}) {
  const [tab, setTab] = useState<(typeof LANGS)[number]["code"]>("mn");
  const editing = !!product;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <Link href="/admin/products" aria-label="Хаах" className="flex-1 bg-black/40" />
      <form
        action={action}
        className="flex h-full w-full max-w-[760px] flex-col bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-adm-line px-8 py-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
            {editing ? "Бүтээгдэхүүн засах" : "Бүтээгдэхүүн нэмэх"}
          </h2>
          <Link href="/admin/products" aria-label="Хаах" className="text-2xl leading-none text-adm-ink">
            ×
          </Link>
        </header>

        <div className="flex-1 space-y-8 overflow-y-auto px-8 py-7">
          {/* Name in four languages */}
          <div>
            <span className={cap}>Хэл</span>
            <div className="flex gap-2">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setTab(l.code)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wider transition ${
                    tab === l.code
                      ? "border-adm-ink bg-adm-ink text-white"
                      : "border-adm-line bg-white text-adm-ink hover:bg-adm-cream"
                  }`}
                >
                  {l.label}
                  {l.code === "mn" && <span className="ml-0.5 text-red-500">*</span>}
                </button>
              ))}
            </div>
          </div>

          {LANGS.map((l) => (
            <div key={l.code} className={tab === l.code ? "" : "hidden"}>
              <label className={cap} htmlFor={l.field}>
                Нэр ({l.label}) {l.code === "mn" && <span className="text-red-500">*</span>}
              </label>
              <input
                id={l.field}
                name={l.field}
                defaultValue={(product?.[l.field] as string | null | undefined) ?? ""}
                required={l.code === "mn"}
                placeholder={l.code === "mn" ? "Бүтээгдэхүүний нэр" : "Хоосон бол автоматаар орчуулна"}
                className={`${input} ${l.code === "mn" ? "invalid:border-red-300 invalid:bg-red-50" : ""}`}
              />
            </div>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={cap} htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                defaultValue={product?.slug ?? ""}
                required
                placeholder="product-name-mn"
                className={input}
              />
            </div>
            <div>
              <label className={cap} htmlFor="categorySlug">
                Категори
              </label>
              <select
                id="categorySlug"
                name="categorySlug"
                defaultValue={product?.categorySlug ?? ""}
                required
                className={input}
              >
                <option value="" disabled>
                  Сонгох…
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.nameMn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={cap} htmlFor="color">
              Өнгө (MN) <span className="text-red-500">*</span>
            </label>
            <input
              id="color"
              name="color"
              defaultValue={product?.color ?? ""}
              required
              placeholder="Тэмээн бор"
              className={input}
            />
            <p className="mt-1.5 text-xs text-adm-mute">
              Англи, орос, хятад руу автоматаар орчуулагдана.
            </p>
          </div>

          <div>
            <div className={group}>Үнэ &amp; нөөц</div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-adm-mute" htmlFor="price">
                  Үнэ (₮)
                </label>
                <input id="price" name="price" type="number" defaultValue={product?.price ?? ""} required className={input} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-adm-mute" htmlFor="compareAtPrice">
                  Хямдралын өмнөх үнэ
                </label>
                <input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  defaultValue={product?.compareAtPrice ?? ""}
                  className={input}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-adm-mute" htmlFor="stock">
                  Нөөц
                </label>
                <input id="stock" name="stock" type="number" defaultValue={product?.stock ?? ""} className={input} />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={cap} htmlFor="collection">
                Төрөл
              </label>
              <select id="collection" name="collection" defaultValue={product?.collection ?? "catalog"} className={input}>
                <option value="catalog">Каталог</option>
                <option value="arrival">Шинэ</option>
              </select>
            </div>
            <div>
              <label className={cap} htmlFor="badge">
                Шошго
              </label>
              <input id="badge" name="badge" defaultValue={product?.badge ?? ""} placeholder="Шинэ, Хямдрал…" className={input} />
            </div>
          </div>

          <SizePicker defaultValue={product?.sizes} />

          <GalleryField images={productImages(product)} cover={product?.image} />

          <div className="flex flex-wrap gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="inStock"
                defaultChecked={product?.inStock ?? true}
                className="h-4 w-4 accent-adm-ink"
              />
              Худалдаанд байгаа
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="hidden"
                defaultChecked={product?.hidden ?? false}
                className="h-4 w-4 accent-adm-ink"
              />
              Сайтаас нуух
            </label>
          </div>
        </div>

        <footer className="space-y-2 border-t border-adm-line px-8 py-5">
          <button
            type="submit"
            className="w-full bg-adm-ink py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-white hover:opacity-90"
          >
            {editing ? "Хадгалах" : "Нэмэх"}
          </button>
          <Link
            href="/admin/products"
            className="block w-full border border-adm-line py-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-adm-ink hover:bg-adm-cream"
          >
            Болих
          </Link>
        </footer>
      </form>
    </div>
  );
}

/** A product's photos; older products only have the single cover `image`. */
function productImages(product?: { image: string; images: string } | null): string[] {
  if (!product) return [];
  try {
    const list = JSON.parse(product.images) as string[];
    if (list.length) return list;
  } catch {
    // fall through to the cover
  }
  return product.image ? [product.image] : [];
}
