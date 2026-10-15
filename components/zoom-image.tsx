"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { isUploadedImage } from "@/lib/format";

const ZOOM = 2.6;

/**
 * Product photo that magnifies under the mouse, so the knit and fabric can be
 * seen up close. Touch screens just show the photo.
 */
export function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState<string | null>(null);

  const move = (e: React.MouseEvent) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((e.clientX - box.left) / box.width) * 100;
    const y = ((e.clientY - box.top) / box.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      ref={ref}
      className={`zoom-image ${origin ? "is-zoomed" : ""}`}
      onMouseMove={move}
      onMouseLeave={() => setOrigin(null)}
    >
      <Image
        src={src}
        unoptimized={isUploadedImage(src)}
        alt={alt}
        fill
        priority
        // Load enough pixels to stay sharp when magnified.
        sizes="(max-width: 860px) 100vw, 1600px"
        style={origin ? { transformOrigin: origin, transform: `scale(${ZOOM})` } : undefined}
      />
    </div>
  );
}
