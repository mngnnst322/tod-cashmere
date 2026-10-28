"use client";

import { useState } from "react";
import { btnSoft, label } from "../ui";
import { uploadPhoto } from "./shrink-image";

type Photo = { key: string; src: string };

/**
 * All of a catalog item's photos (different angles). Add several at once,
 * remove any, and pick the cover shown on cards. New photos go straight to
 * R2 when chosen, so the form only posts `keep` (paths) and `cover` (a path).
 */
export function GalleryField({ images, cover }: { images: string[]; cover?: string | null }) {
  const [photos, setPhotos] = useState<Photo[]>(images.map((src) => ({ key: src, src })));
  const [coverKey, setCoverKey] = useState<string>(cover ?? images[0] ?? "");
  const [zoomed, setZoomed] = useState<string | null>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState("");

  const effectiveCover = photos.some((p) => p.key === coverKey) ? coverKey : photos[0]?.key;

  return (
    <div>
      <span className={label}>Зургууд</span>
      <div className="flex flex-wrap gap-3">
        {photos.map((p) => {
          const isCover = p.key === effectiveCover;
          return (
            <div key={p.key} className="w-[92px]">
              <button
                type="button"
                onClick={() => setZoomed(p.src)}
                className={`block h-[122px] w-[92px] cursor-zoom-in overflow-hidden rounded-lg bg-adm-paper ${
                  isCover ? "ring-2 ring-adm-ink ring-offset-2" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" className="h-full w-full object-cover" />
              </button>
              <div className="mt-1.5 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setCoverKey(p.key)}
                  className={isCover ? "font-semibold text-adm-ink" : "text-adm-mute hover:underline"}
                >
                  {isCover ? "★ Нүүр" : "Нүүр болгох"}
                </button>
                <button
                  type="button"
                  aria-label="Устгах"
                  onClick={() => setPhotos((ps) => ps.filter((x) => x.key !== p.key))}
                  className="text-red-600 hover:underline"
                >
                  ×
                </button>
              </div>
              <input type="hidden" name="keep" value={p.src} />
            </div>
          );
        })}
        <label
          className={`${btnSoft} flex h-[122px] w-[92px] cursor-pointer flex-col items-center justify-center text-center text-xs`}
        >
          <span className="text-2xl leading-none">{uploading ? "…" : "+"}</span>
          {uploading ? `Хуулж байна (${uploading})` : "Зураг нэмэх"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={async (e) => {
              const chosen = Array.from(e.target.files ?? []);
              e.target.value = "";
              setError("");
              setUploading((n) => n + chosen.length);
              await Promise.all(
                chosen.map(async (file) => {
                  try {
                    const src = await uploadPhoto(file);
                    setPhotos((ps) => [...ps, { key: src, src }]);
                  } catch {
                    setError(`“${file.name}” оруулж чадсангүй. Дахин оролдоно уу.`);
                  } finally {
                    setUploading((n) => n - 1);
                  }
                }),
              );
            }}
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-adm-mute">
        Олон өнцгөөс авсан зургуудыг нэг дор сонгож болно. ★ тэмдэгтэй нь нүүр зураг болж жагсаалтад харагдана.
      </p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <input type="hidden" name="cover" value={effectiveCover ?? ""} />

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
