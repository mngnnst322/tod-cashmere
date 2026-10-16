"use client";

import { useRef } from "react";

/** A row that scrolls sideways, four items in view, with ‹ › buttons. */
export function CarouselRow({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el)
      el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };
  return (
    <div className="carousel-row">
      <button
        type="button"
        className="carousel-arrow is-prev"
        aria-label="‹"
        onClick={() => scroll(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <div className="carousel-track" ref={track}>
        {children}
      </div>
      <button
        type="button"
        className="carousel-arrow is-next"
        aria-label="›"
        onClick={() => scroll(1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
