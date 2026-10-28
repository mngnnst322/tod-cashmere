"use client";

import { useEffect, useState } from "react";
import { btnSoft, label } from "../ui";
import { shrinkImage } from "./shrink-image";

/**
 * Photo picker for admin forms: shows the current photo (or the newly chosen
 * one) and posts it as `imageFile`, keeping the current path in `imagePath`
 * when nothing new is chosen.
 */
export function ImageField({ current, id = "imageFile" }: { current?: string | null; id?: string }) {
  const [preview, setPreview] = useState<string | null>(current ?? null);
  const [fileName, setFileName] = useState("");
  const [zoomed, setZoomed] = useState(false);

  // Esc closes the enlarged view.
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setZoomed(false);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [zoomed]);

  // Free the object URL of a previously chosen file.
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div>
      <span className={label}>Зураг</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={!preview}
          onClick={() => setZoomed(true)}
          title={preview ? "Томруулж харах" : undefined}
          className="h-28 w-[84px] shrink-0 cursor-zoom-in overflow-hidden rounded-lg bg-adm-paper disabled:cursor-default"
        >
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          )}
        </button>
        <div className="min-w-0 space-y-2">
          <label htmlFor={id} className={`${btnSoft} cursor-pointer`}>
            {preview ? "Зураг солих" : "Зураг оруулах"}
          </label>
          <input
            id={id}
            type="file"
            name="imageFile"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const input = e.currentTarget;
              const chosen = input.files?.[0];
              if (!chosen) return;
              setFileName(chosen.name);
              const file = await shrinkImage(chosen);
              if (file !== chosen) {
                const dt = new DataTransfer();
                dt.items.add(file);
                input.files = dt.files;
              }
              setPreview(URL.createObjectURL(file));
            }}
          />
          <p className="truncate text-xs text-adm-mute">
            {fileName || (preview ? "Одоогийн зураг" : "JPG, PNG")}
          </p>
        </div>
      </div>
      <input type="hidden" name="imagePath" value={current ?? ""} />
      {zoomed && preview && (
        <div
          role="dialog"
          aria-label="Зураг"
          className="fixed inset-0 z-[60] grid cursor-zoom-out place-items-center bg-black/80 p-6"
          onClick={() => setZoomed(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
          <button
            type="button"
            aria-label="Хаах"
            className="absolute right-5 top-4 text-3xl leading-none text-white/80 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
