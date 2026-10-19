"use client";

import { useEffect, useRef, useState } from "react";
import { btnSoft, label } from "../ui";

type Photo = { key: string; src: string; file?: File };

/**
 * All of a catalog item's photos (different angles). Add several at once,
 * remove any, and pick the cover shown on cards. Posts `keep` (kept paths),
 * `galleryFiles` (new uploads) and `cover` (a kept path or "new:<n>").
 */
export function GalleryField({ images, cover }: { images: string[]; cover?: string | null }) {
  const [photos, setPhotos] = useState<Photo[]>(images.map((src) => ({ key: src, src })));
  const [coverKey, setCoverKey] = useState<string>(cover ?? images[0] ?? "");
  const [zoomed, setZoomed] = useState<string | null>(null);
  const filesRef = useRef<HTMLInputElement>(null);

  // Keep the hidden file input in step with the new photos still listed.
  useEffect(() => {
    if (!filesRef.current) return;
    const dt = new DataTransfer();
    photos.forEach((p) => p.file && dt.items.add(p.file));
    filesRef.current.files = dt.files;
  }, [photos]);

  const newPhotos = photos.filter((p) => p.file);
  const effectiveCover = photos.some((p) => p.key === coverKey) ? coverKey : photos[0]?.key;
  const coverValue = (() => {
    const i = newPhotos.findIndex((p) => p.key === effectiveCover);
    return i >= 0 ? `new:${i}` : (effectiveCover ?? "");
  })();

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
              {!p.file && <input type="hidden" name="keep" value={p.src} />}
            </div>
          );
        })}
        <label
          className={`${btnSoft} flex h-[122px] w-[92px] cursor-pointer flex-col items-center justify-center text-center text-xs`}
        >
          <span className="text-2xl leading-none">+</span>
          Зураг нэмэх
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              const added = Array.from(e.target.files ?? []).map((file) => ({
                key: `${file.name}-${file.size}-${Math.random()}`,
                src: URL.createObjectURL(file),
                file,
              }));
              setPhotos((ps) => [...ps, ...added]);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-adm-mute">
        Олон өнцгөөс авсан зургуудыг нэг дор сонгож болно. ★ тэмдэгтэй нь нүүр зураг болж жагсаалтад харагдана.
      </p>
      <input ref={filesRef} type="file" name="galleryFiles" multiple className="hidden" />
      <input type="hidden" name="cover" value={coverValue} />

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
