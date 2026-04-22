// src/hooks/useScrollReveal.js
// ─────────────────────────────────────────────────────────────────────────────
// Attaches a single IntersectionObserver to every .sr element inside
// the document (or a given root). Adds .sr--visible when in viewport.
// Call once at App level via useEffect.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";

const useScrollReveal = (rootMargin = "0px 0px -60px 0px") => {
  useEffect(() => {
    const elements = document.querySelectorAll(".sr");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sr--visible");
            // Once revealed, stop watching (one-shot entrance)
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold: 0.08 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });
  // No deps — re-runs on every render so newly mounted pages get observed
};

export default useScrollReveal;