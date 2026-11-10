"use client";

import { useState } from "react";
import { PRODUCT_VIEWS, type ProductView } from "@/lib/product-views";
import { label } from "../../ui";
import { uploadPhoto } from "../shrink-image";

/**
 * One photo slot per view (front, right, left, garment alone). A chosen
 * photo goes straight to R2 and the slot posts its path as `view-<key>`.
 */
export function ViewPhotosField({ initial }: { initial: Partial<Record<ProductView, string>> }) {
  const [photos, setPhotos] = useState(initial);
  const [busy, setBusy] = useState<ProductView | null>(null);
  const [zoomed, setZoomed] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function pick(key: ProductView, file?: File) {
    if (!file) return;
    setError("");
    setBusy(key);
    try {
      const src = await uploadPhoto(file);
      setPhotos((p) => ({ ...p, [key]: src }));
    } catch {
      setError(`“${file.name}” оруулж чадсангүй. Дахин оролдоно уу.`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <span className={label}>Зургууд</span>
      <div className="grid grid-cols-4 gap-3">
        {PRODUCT_VIEWS.map((v) => {
          const src = photos[v.key];
          return (
            <div key={v.key}>
              <div className="relative h-[150px] overflow-hidden rounded-lg border border-dashed border-adm-line bg-adm-paper">
                {src ? (
                  <button type="button" onClick={() => setZoomed(src)} className="block h-full w-full cursor-zoom-in">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-xs text-adm-mute hover:bg-adm-cream">
                    <span className="text-2xl leading-none">{busy === v.key ? "…" : "+"}</span>
                    {busy === v.key ? "Хуулж байна" : "Зураг нэмэх"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={busy !== null}
                      onChange={(e) => {
                        pick(v.key, e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span className="font-semibold text-adm-ink">{v.label}</span>
                {src && (
                  <button
                    type="button"
                    aria-label="Устгах"
                    onClick={() => setPhotos((p) => ({ ...p, [v.key]: undefined }))}
                    className="text-red-600 hover:underline"
                  >
                    ×
                  </button>
                )}
              </div>
              <input type="hidden" name={`view-${v.key}`} value={src ?? ""} />
            </div>
          );
        })}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-adm-mute">
        Сайт дээр том зургийн зүүн талд энэ дарааллаар харагдана. Урдаас авсан зураг нүүр зураг болно.
      </p>

      {zoomed && (
        <div
          role="dialog"
          aria-label="Зураг"
          className="fixed inset-0 z-[60] grid cursor-zoom-out place-items-center bg-black/80 p-6"
          onClick={() => setZoomed(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoomed} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}
