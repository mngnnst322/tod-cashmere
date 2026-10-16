"use client";

import { useEffect, useState } from "react";

/** Floating "back to top" button, shown once the page is scrolled down. */
export function ScrollTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const update = () => setShow(window.scrollY > 600);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <button
      type="button"
      className={`scroll-top ${show ? "is-visible" : ""}`}
      aria-label="↑"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
