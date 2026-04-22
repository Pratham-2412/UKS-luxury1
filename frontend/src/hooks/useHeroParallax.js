// src/hooks/useHeroParallax.js
// ─────────────────────────────────────────────────────────────────────────────
// Applies a subtle CSS parallax to hero background elements on scroll.
// Pass the ref of the hero bg element and an intensity multiplier (default 0.3).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";

const useHeroParallax = (bgRef, intensity = 0.3) => {
  useEffect(() => {
    const el = bgRef?.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          el.style.transform = `scale(1.08) translateY(${scrollY * intensity}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [bgRef, intensity]);
};

export default useHeroParallax;