// src/hooks/useScrollProgress.js
// ─────────────────────────────────────────────────────────────────────────────
// Returns current scroll progress (0–100) and updates the progress bar width.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";

const useScrollProgress = () => {
  useEffect(() => {
    const bar = document.getElementById("scroll-progress-bar");
    if (!bar) return;

    const onScroll = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width  = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Set on mount

    return () => window.removeEventListener("scroll", onScroll);
  }, []);
};

export default useScrollProgress;