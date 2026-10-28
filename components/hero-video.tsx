"use client";

import { useRef, useState } from "react";

const SRC = "/api/media/videos/tod-film-v2.mp4";
const POSTER = "/api/media/videos/tod-film-v2-poster.jpg";

/**
 * Brand film filling the home hero. Browsers only autoplay muted video, so it
 * starts silent and loops; the corner button turns the sound on and off.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) void v.play();
    setMuted(v.muted);
  };

  return (
    <>
      <video
        ref={ref}
        className="hero-photo hero-film"
        src={SRC}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <button
        type="button"
        className="hero-sound"
        onClick={toggleSound}
        aria-label={muted ? "Дуу асаах" : "Дуу хаах"}
        aria-pressed={!muted}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4Z" strokeLinejoin="round" strokeWidth="1.6" />
          {muted ? (
            <path d="m16 9.5 5 5m0-5-5 5" strokeLinecap="round" strokeWidth="1.6" />
          ) : (
            <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" strokeLinecap="round" strokeWidth="1.6" />
          )}
        </svg>
      </button>
    </>
  );
}
