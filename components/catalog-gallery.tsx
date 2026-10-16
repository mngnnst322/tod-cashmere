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
  images: string[];
  alt: string;
  /** Overlaid on the large photo (the heart). */
  children?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const src = images[active] ?? images[0];

  return (
    <div className={`katalog-gallery ${images.length > 1 ? "has-thumbs" : ""}`}>
      {images.length > 1 && (
        <div className="katalog-thumbs">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              className={`katalog-thumb ${i === active ? "is-active" : ""}`}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-label={`${alt} ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isUploadedImage(img) ? img : `/_next/image?url=${encodeURIComponent(img)}&w=256&q=90`}
                alt=""
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
      <div className="katalog-item-image">
        {src && <ZoomImage key={src} src={src} alt={alt} />}
        {children}
      </div>
    </div>
  );
}
