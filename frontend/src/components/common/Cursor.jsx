// src/components/common/Cursor.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Custom luxury cursor — renders dot + ring, follows mouse.
// Only active on pointer: fine devices (hides on touch).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
const Cursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only activate on non-touch devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.body.classList.add("custom-cursor");

    const dot  = dotRef.current;
    const ring = ringRef.current;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let rafId  = null;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.left = `${mouseX}px`;
        dot.style.top  = `${mouseY}px`;
      }
    };

    // Ring follows with lerp for smooth trailing effect
    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      if (ring) {
        ring.style.left = `${ringX}px`;
        ring.style.top  = `${ringY}px`;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // Hover detection — add to links, buttons, images
    const addHover = (e) => {
      const target = e.target.closest("a, button, [role='button'], img, .cl-card, .pj-card");
      if (target) {
        document.body.classList.add("cursor-hover");
        if (target.tagName === "IMG") document.body.classList.add("cursor-image");
      }
    };
    const removeHover = () => {
      document.body.classList.remove("cursor-hover", "cursor-image");
    };

    const onDown = () => document.body.classList.add("cursor-click");
    const onUp   = () => document.body.classList.remove("cursor-click");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", addHover);
    window.addEventListener("mouseout",  removeHover);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    return () => {
      document.body.classList.remove("custom-cursor", "cursor-hover", "cursor-image", "cursor-click");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", addHover);
      window.removeEventListener("mouseout",  removeHover);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
};

export default Cursor;
