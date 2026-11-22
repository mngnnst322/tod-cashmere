"use client";

import { useState, useTransition } from "react";
import { replaceLookbookLayer, updateLookbookProduct } from "@/lib/admin-actions";
import { LOOKBOOK_TYPES } from "@/lib/lookbook";
import { input } from "../../ui";
import { uploadPhoto } from "../shrink-image";
import { uploadRaw } from "./uploaders";

type Product = {
  id: string;
  titleMn: string;
  color: string;
  price: number;
  sizes: string;
  lookbookType: string | null;
  lookbookGender: string | null;
};

/** "Засах" on a layer card: edits that garment's details in place. */
export function EditLookbookProduct({ product, layerId }: { product: Product; layerId: string }) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [layer, setLayer] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const types = LOOKBOOK_TYPES.filter((t) => (t.genders as readonly string[]).includes(product.lookbookGender ?? ""));

  if (!open) {
    return (
      <button type="button" className="font-medium text-blue-700 hover:underline" onClick={() => setOpen(true)}>
        Засах
      </button>
    );
  }

  const field = `${input} !py-1.5 !text-xs`;
  return (
    <form
      className="mt-2 grid w-full gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        setError("");
        start(async () => {
          try {
            const [image, layerPath] = await Promise.all([
              photo ? uploadPhoto(photo) : Promise.resolve(""),
              layer ? uploadRaw(layer) : Promise.resolve(""),
            ]);
            if (layerPath) await replaceLookbookLayer(layerId, layerPath);
            await updateLookbookProduct(product.id, {
              image,
              titleMn: String(d.get("titleMn") || ""),
              type: String(d.get("type") || ""),
              color: String(d.get("color") || ""),
              price: Number(d.get("price") || 0),
              sizes: String(d.get("sizes") || ""),
            });
            setOpen(false);
            setPhoto(null);
            setLayer(null);
          } catch (err) {
            setError(err instanceof Error && err.message ? err.message : "Хадгалж чадсангүй.");
          }
        });
      }}
    >
      <input name="titleMn" defaultValue={product.titleMn} required aria-label="Нэр" className={field} />
      <select name="type" defaultValue={product.lookbookType ?? ""} required aria-label="Төрөл" className={field}>
        {types.map((t) => (
          <option key={t.key} value={t.key}>
            {t.label}
          </option>
        ))}
      </select>
      <input name="color" defaultValue={product.color} required aria-label="Өнгө" className={field} />
      <input
        name="price"
        type="number"
        min={1}
        defaultValue={product.price}
        required
        aria-label="Үнэ (₮)"
        className={field}
      />
      <input name="sizes" defaultValue={product.sizes} placeholder="S / M / L" aria-label="Размер" className={field} />
      <label className={`${field} cursor-pointer truncate`}>
        {photo ? `Картын зураг: ${photo.name}` : "Картын зураг солих"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
        />
      </label>
      <label className={`${field} cursor-pointer truncate`}>
        {layer ? `Давхарга: ${layer.name}` : "Давхарга солих (PNG/WebP)"}
        <input
          type="file"
          accept="image/png,image/webp"
          className="sr-only"
          onChange={(e) => setLayer(e.target.files?.[0] ?? null)}
        />
      </label>
      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="font-medium text-emerald-700 hover:underline disabled:opacity-50">
          {pending ? "Хадгалж байна…" : "Хадгалах"}
        </button>
        <button type="button" className="hover:underline" onClick={() => setOpen(false)}>
          Болих
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
