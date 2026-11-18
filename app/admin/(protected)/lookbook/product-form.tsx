"use client";

import { useState, useTransition } from "react";
import { addLookbookProduct } from "@/lib/admin-actions";
import { LOOKBOOK_TYPES, type LookbookGender } from "@/lib/lookbook";
import { btnDark, btnSoft, input, label } from "../../ui";
import { uploadPhoto } from "../shrink-image";
import { uploadRaw } from "./uploaders";

/**
 * Admin -> Lookbook: one form for a lookbook garment. It creates the product
 * (name, type, colour, price, sizes, card photo) and its layer together.
 */
export function LookbookProductForm({ gender }: { gender: LookbookGender }) {
  const types = LOOKBOOK_TYPES.filter((t) => (t.genders as readonly string[]).includes(gender));
  const [type, setType] = useState<string>(types[0]?.key ?? "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [layer, setLayer] = useState<File | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        setError("");
        setDone("");
        if (!layer) {
          setError("Давхаргын файлаа (PNG/WebP) сонгоно уу.");
          return;
        }
        start(async () => {
          try {
            const [image, layerPath] = await Promise.all([
              photo ? uploadPhoto(photo) : Promise.resolve(""),
              uploadRaw(layer),
            ]);
            await addLookbookProduct({
              gender,
              type,
              titleMn: String(data.get("titleMn") || ""),
              color: String(data.get("color") || ""),
              price: Number(data.get("price") || 0),
              sizes: String(data.get("sizes") || ""),
              image,
              layer: layerPath,
            });
            setDone(`“${data.get("titleMn")}” нэмэгдлээ. Доор "Нийтлэх" дарна уу.`);
            form.reset();
            setPhoto(null);
            setLayer(null);
          } catch (err) {
            setError(err instanceof Error && err.message ? err.message : "Хадгалж чадсангүй.");
          }
        });
      }}
    >
      <label className="block">
        <span className={label}>Нэр</span>
        <input name="titleMn" required className={input} placeholder="Нооргон цамц" />
      </label>
      <label className="block">
        <span className={label}>Төрөл</span>
        <select value={type} onChange={(e) => setType(e.target.value)} className={input}>
          {types.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={label}>Өнгө</span>
        <input name="color" required className={input} placeholder="Тэмээн бор" />
      </label>
      <label className="block">
        <span className={label}>Үнэ (₮)</span>
        <input name="price" type="number" min={1} required className={input} placeholder="289000" />
      </label>
      <label className="block md:col-span-2">
        <span className={label}>Размер</span>
        <input name="sizes" className={input} placeholder="S / M / L (хоосон бол нэг размер)" />
      </label>

      <label className={`${btnSoft} cursor-pointer justify-center`}>
        {photo ? `Картын зураг: ${photo.name}` : "Картын зураг (заавал биш)"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
        />
      </label>
      <label className={`${btnSoft} cursor-pointer justify-center`}>
        {layer ? `Давхарга: ${layer.name}` : "Давхарга (тунгалаг PNG/WebP)"}
        <input
          type="file"
          accept="image/png,image/webp"
          className="sr-only"
          onChange={(e) => setLayer(e.target.files?.[0] ?? null)}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
        <button type="submit" disabled={pending} className={`${btnDark} disabled:opacity-50`}>
          {pending ? "Хадгалж байна…" : "Lookbook бараа нэмэх"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {done && <p className="text-sm text-emerald-700">{done}</p>}
      </div>
    </form>
  );
}
