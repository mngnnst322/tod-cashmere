"use client";

import { useEffect, useRef } from "react";

/**
 * A row that scrolls sideways, four items in view. With ‹ › buttons, or with
 * `auto` it moves on by itself (one card at a time, pausing while hovered or
 * touched, and returning to the start after the last card).
 */
export function CarouselRow({
  children,
  auto,
}: {
  children: React.ReactNode;
  auto?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const el = track.current;
      if (!el || paused.current) return;
      const card = el.firstElementChild as HTMLElement | null;
      const step = (card?.offsetWidth ?? el.clientWidth / 4) + 24;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, 3500);
    return () => window.clearInterval(id);
  }, [auto]);

  const pause = (on: boolean) => () => {
    paused.current = on;
  };

  return (
    <div
      className={`carousel-row ${auto ? "is-auto" : ""}`}
      onMouseEnter={pause(true)}
      onMouseLeave={pause(false)}
      onTouchStart={pause(true)}
      onTouchEnd={pause(false)}
    >
      {!auto && (
        <button type="button" className="carousel-arrow is-prev" aria-label="‹" onClick={() => scroll(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      )}
      <div className="carousel-track" ref={track}>
        {children}
      </div>
      {!auto && (
        <button type="button" className="carousel-arrow is-next" aria-label="›" onClick={() => scroll(1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
