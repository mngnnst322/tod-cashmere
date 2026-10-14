"use client";

import { useEffect, useState } from "react";
import { btnSoft, label } from "../ui";

/**
 * Photo picker for admin forms: shows the current photo (or the newly chosen
 * one) and posts it as `imageFile`, keeping the current path in `imagePath`
 * when nothing new is chosen.
 */
export function ImageField({ current, id = "imageFile" }: { current?: string | null; id?: string }) {
  const [preview, setPreview] = useState<string | null>(current ?? null);
  const [fileName, setFileName] = useState("");

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
        <div className="h-28 w-[84px] shrink-0 overflow-hidden rounded-lg bg-adm-paper">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          )}
        </div>
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setFileName(file.name);
              setPreview(URL.createObjectURL(file));
            }}
          />
          <p className="truncate text-xs text-adm-mute">
            {fileName || (preview ? "Одоогийн зураг" : "JPG, PNG — 10MB хүртэл")}
          </p>
        </div>
      </div>
      <input type="hidden" name="imagePath" value={current ?? ""} />
    </div>
  );
}
