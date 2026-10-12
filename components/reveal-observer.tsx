"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds `in-view` to `.reveal` / `.line-reveal` elements as they scroll into
 * view, which starts their CSS slide-up animation (see styles.css). Without
 * it those elements stay hidden.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll(".reveal:not(.in-view), .line-reveal:not(.in-view)");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
