"use client";

import { useState } from "react";
import { isUploadedImage } from "@/lib/format";
import { ZoomImage } from "./zoom-image";

/**
 * An item's photos: thumbnails in a column beside the large photo (a row
 * under it on phones); clicking one shows it large, with the hover zoom.
 */
export function CatalogGallery({
  images,
  alt,
  children,
}: {
  /** null keeps an empty thumbnail slot (a product view not photographed yet). */
  images: (string | null)[];
  alt: string;
  /** Overlaid on the large photo (the heart). */
  children?: React.ReactNode;
}) {
  const photos = images.filter((img): img is string => !!img);
  const [active, setActive] = useState(photos[0] ?? null);
  const src = active ?? photos[0];

  return (
    <div className={`katalog-gallery ${images.length > 1 ? "has-thumbs" : ""}`}>
      {images.length > 1 && (
        <div className="katalog-thumbs">
          {images.map((img, i) =>
            img ? (
              <button
                key={`${i}-${img}`}
                type="button"
                className={`katalog-thumb ${img === src ? "is-active" : ""}`}
                onClick={() => setActive(img)}
                onMouseEnter={() => setActive(img)}
                aria-label={`${alt} ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={isUploadedImage(img) ? img : `/_next/image?url=${encodeURIComponent(img)}&w=256&q=90`}
                  alt=""
                  loading="lazy"
                />
              </button>
            ) : (
              <span key={i} className="katalog-thumb is-empty" aria-hidden="true" />
            ),
          )}
        </div>
      )}
      <div className="katalog-item-image">
        {src && <ZoomImage key={src} src={src} alt={alt} />}
        {children}
      </div>
    </div>
  );
}
