"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  bulkProductAction,
  deleteProduct,
  duplicateProduct,
  setProductHidden,
} from "@/lib/admin-actions";
import { formatPrice, isSoldOut } from "@/lib/format";
import { input, panel, th } from "../../ui";

type Row = {
  id: string;
  slug: string;
  code: string;
  title: string;
  titleEn: string;
  image: string;
  categorySlug: string;
  collection: string;
  color: string;
  price: number;
  compareAtPrice: number | null;
  stock: number | null;
  inStock: boolean;
  hidden: boolean;
};

const collectionLabel = (c: string) =>
  c === "arrival" ? "Шинэ" : c === "catalog" ? "Каталог" : c;

export function ProductsTable({
  products,
  categories,
  canEdit,
}: {
  products: Row[];
  categories: { slug: string; name: string }[];
  canEdit: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const categoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(
      (p) =>
        (!category || p.categorySlug === category) &&
        (!q ||
          [p.title, p.titleEn, p.slug, p.code, categoryName(p.categorySlug)].some((v) =>
            v.toLowerCase().includes(q),
          )),
    );
    const order = [...categories.map((c) => c.slug)];
    for (const p of filtered) if (!order.includes(p.categorySlug)) order.push(p.categorySlug);
    return order
      .map((slug) => ({ slug, items: filtered.filter((p) => p.categorySlug === slug) }))
      .filter((g) => g.items.length > 0);
    // categoryName only depends on `categories`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, categories, query, category]);

  const visibleIds = groups.flatMap((g) => g.items.map((p) => p.id));
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const run = (fn: () => Promise<unknown>) => startTransition(async () => void (await fn()));

  const bulk = (action: "hide" | "show" | "delete") => {
    if (action === "delete" && !confirm(`${selected.size} барааг устгах уу?`)) return;
    const ids = [...selected];
    run(async () => {
      await bulkProductAction(ids, action);
      setSelected(new Set());
    });
  };

  const cols = canEdit ? 9 : 7;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <input
          className={`${input} max-w-md`}
          placeholder="Нэр, slug, ангиллаар хайх..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={`${input} w-auto`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Бүх ангилал</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {canEdit && selected.size > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-adm-mute">{selected.size} сонгосон:</span>
            <button className="rounded-md bg-white px-3 py-2 hover:bg-adm-cream" onClick={() => bulk("hide")} disabled={pending}>
              Нуух
            </button>
            <button className="rounded-md bg-white px-3 py-2 hover:bg-adm-cream" onClick={() => bulk("show")} disabled={pending}>
              Нээх
            </button>
            <button className="rounded-md bg-white px-3 py-2 text-red-600 hover:bg-red-50" onClick={() => bulk("delete")} disabled={pending}>
              Устгах
            </button>
          </div>
        )}
      </div>

      <div className={`${panel} overflow-x-auto ${pending ? "opacity-60" : ""}`}>
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-adm-line">
              {canEdit && (
                <th className={`${th} w-12`}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-adm-ink"
                    checked={allSelected}
                    onChange={() =>
                      setSelected(allSelected ? new Set() : new Set(visibleIds))
                    }
                    aria-label="Бүгдийг сонгох"
                  />
                </th>
              )}
              <th className={th} colSpan={2}>Нэр</th>
              <th className={th}>Ангилал</th>
              <th className={th}>Төрөл</th>
              <th className={th}>Үнэ</th>
              <th className={th}>Нөөц</th>
              <th className={th}>Байдал</th>
              {canEdit && <th className={th}></th>}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <GroupRows
                key={group.slug}
                title={categoryName(group.slug)}
                count={group.items.length}
                cols={cols}
              >
                {group.items.map((p) => {
                  const soldOut = isSoldOut(p);
                  return (
                    <tr key={p.id} className="border-t border-adm-line hover:bg-adm-cream/60">
                      {canEdit && (
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-adm-ink"
                            checked={selected.has(p.id)}
                            onChange={() => toggle(p.id)}
                            aria-label={`${p.title} сонгох`}
                          />
                        </td>
                      )}
                      <td className="w-16 py-3 pl-5">
                        <div className="relative h-16 w-14 overflow-hidden rounded-lg bg-adm-paper">
                          <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
                        </div>
                      </td>
                      <td className="max-w-xs px-5 py-4">
                        <div className="font-semibold leading-snug">{p.title}</div>
                        <div className="mt-1 text-xs text-adm-mute">{p.code}</div>
                      </td>
                      <td className="px-5 py-4 text-adm-ink/80">{categoryName(p.categorySlug)}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-adm-paper px-2.5 py-1 text-xs font-medium">
                          {collectionLabel(p.collection)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold">{formatPrice(p.price)}</div>
                        {p.compareAtPrice != null && (
                          <div className="text-xs text-adm-mute line-through">
                            {formatPrice(p.compareAtPrice)}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">{p.stock ?? "—"}</td>
                      <td className="space-y-1.5 px-5 py-4">
                        {p.hidden ? (
                          <span className="block w-fit rounded-md bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">
                            НУУСАН
                          </span>
                        ) : (
                          <span className="block w-fit rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                            ИДЭВХТЭЙ
                          </span>
                        )}
                        {soldOut &&
                          (canEdit ? (
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="block w-fit rounded-md bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700 hover:underline"
                            >
                              ДУУССАН · нөөц нэмэх
                            </Link>
                          ) : (
                            <span className="block w-fit rounded-md bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-700">
                              ДУУССАН
                            </span>
                          ))}
                      </td>
                      {canEdit && (
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <Link href={`/admin/products/${p.id}/edit`} className="text-blue-700 hover:underline">
                              Засах
                            </Link>
                            <button
                              className="text-red-600 hover:underline"
                              onClick={() => {
                                if (confirm(`"${p.title}" барааг устгах уу?`)) run(() => deleteProduct(p.id));
                              }}
                            >
                              Устгах
                            </button>
                            <button className="hover:underline" onClick={() => run(() => duplicateProduct(p.id))}>
                              Хуулах
                            </button>
                            <button
                              className={p.hidden ? "text-emerald-700 hover:underline" : "text-amber-700 hover:underline"}
                              onClick={() => run(() => setProductHidden(p.id, !p.hidden))}
                            >
                              {p.hidden ? "Нээх" : "Түр нуух"}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </GroupRows>
            ))}
            {groups.length === 0 && (
              <tr>
                <td colSpan={cols} className="px-5 py-14 text-center text-adm-mute">
                  Бараа олдсонгүй.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GroupRows({
  title,
  count,
  cols,
  children,
}: {
  title: string;
  count: number;
  cols: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <tr className="border-t border-adm-line bg-adm-cream">
        <td colSpan={cols} className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em]">
          {title} <span className="font-normal text-adm-mute">({count})</span>
        </td>
      </tr>
      {children}
    </>
  );
}
