"use client";

import { useState, useTransition } from "react";
import { addLookbookLayer, addLookbookModel } from "@/lib/admin-actions";
import { btnDark, btnSoft, input } from "../../ui";
import { uploadPhoto } from "../shrink-image";

/** Stores a file in R2 as-is. Layers keep their transparency, so they skip the JPEG shrink. */
async function uploadRaw(file: File) {
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(await res.text());
  return ((await res.json()) as { path: string }).path;
}

export function ModelUploader({ gender }: { gender: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <div className="space-y-2">
      <label className={`${btnSoft} cursor-pointer`}>
        {pending ? "Хуулж байна…" : "Суурь зураг оруулах"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={pending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setError("");
            start(async () => {
              try {
                await addLookbookModel(gender, await uploadPhoto(file));
              } catch {
                setError("Зургийг оруулж чадсангүй. Дахин оролдоно уу.");
              }
            });
          }}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function LayerUploader({ products }: { products: { id: string; label: string }[] }) {
  const [productId, setProductId] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        id="layer-product"
        aria-label="Бараа"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className={`${input} max-w-md`}
      >
        <option value="">Бараа сонгох…</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <label className={`${btnDark} ${productId ? "cursor-pointer" : "pointer-events-none opacity-50"}`}>
        {pending ? "Хуулж байна…" : "Давхарга оруулах"}
        <input
          type="file"
          accept="image/png,image/webp"
          className="sr-only"
          disabled={!productId || pending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setError("");
            start(async () => {
              try {
                await addLookbookLayer(productId, await uploadRaw(file));
              } catch (err) {
                setError(err instanceof Error && err.message ? err.message : "Оруулж чадсангүй.");
              }
            });
          }}
        />
      </label>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </div>
  );
}
