// src/components/shop/ProductGallery.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const FALLBACK =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80";

/* ── Lightbox rendered into document.body via portal ── */
const Lightbox = ({ images, idx, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext, onClose]);

  return createPortal(
    <>
      <style>{`
        .pg-lb {
          position: fixed; inset: 0;
          z-index: 99999;
          background: rgba(4,3,2,0.97);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: pgLbIn 0.22s ease;
        }
        @keyframes pgLbIn { from { opacity:0 } to { opacity:1 } }

        .pg-lb__bar {
          position: absolute; top: 0; left: 0; right: 0;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 1.25rem;
          background: linear-gradient(to bottom, rgba(0,0,0,0.55), transparent);
          z-index: 2;
        }
        .pg-lb__counter {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .pg-lb__close {
          width: 40px; height: 40px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          color: rgba(240,236,228,0.75);
          font-size: 1.3rem; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .pg-lb__close:hover { background: rgba(196,160,100,0.25); color: #c4a064; }

        .pg-lb__img-wrap {
          flex: 1; width: 100%;
          display: flex; align-items: center; justify-content: center;
          padding: 64px 80px 72px;
          overflow: hidden;
        }
        .pg-lb__img {
          max-width: 100%; max-height: 100%;
          object-fit: contain;
          border-radius: 10px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.7);
          animation: pgImgIn 0.25s cubic-bezier(0.22,1,0.36,1);
          user-select: none; display: block;
        }
        @keyframes pgImgIn {
          from { opacity:0; transform:scale(0.96) }
          to   { opacity:1; transform:scale(1) }
        }

        .pg-lb__nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 46px; height: 46px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 50%;
          color: rgba(240,236,228,0.7);
          font-size: 1.5rem;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background 0.2s, color 0.2s;
          z-index: 2;
        }
        .pg-lb__nav:hover { background: rgba(196,160,100,0.22); color: #c4a064; }
        .pg-lb__prev { left: 1rem; }
        .pg-lb__next { right: 1rem; }

        .pg-lb__dots {
          position: absolute; bottom: 1.25rem; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 0.45rem; align-items: center;
          z-index: 2;
        }
        .pg-lb__dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.25);
          border: none; cursor: pointer; padding: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .pg-lb__dot.is-active {
          background: #c4a064; transform: scale(1.3);
        }

        @media (max-width: 600px) {
          .pg-lb__img-wrap { padding: 60px 56px 64px; }
          .pg-lb__nav { width: 38px; height: 38px; font-size: 1.2rem; }
          .pg-lb__prev { left: 0.5rem; }
          .pg-lb__next { right: 0.5rem; }
        }
      `}</style>

      <div className="pg-lb" onClick={onClose}>
        {/* Top bar */}
        <div className="pg-lb__bar" onClick={(e) => e.stopPropagation()}>
          <span className="pg-lb__counter">{idx + 1} / {images.length}</span>
          <button className="pg-lb__close" onClick={onClose}>×</button>
        </div>

        {/* Prev */}
        <button
          className="pg-lb__nav pg-lb__prev"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >‹</button>

        {/* Image */}
        <div className="pg-lb__img-wrap" onClick={(e) => e.stopPropagation()}>
          <img
            key={idx}
            className="pg-lb__img"
            src={images[idx] || FALLBACK}
            alt={`Product ${idx + 1}`}
            onError={(e) => (e.currentTarget.src = FALLBACK)}
          />
        </div>

        {/* Next */}
        <button
          className="pg-lb__nav pg-lb__next"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >›</button>

        {/* Dots */}
        {images.length <= 10 && (
          <div className="pg-lb__dots" onClick={(e) => e.stopPropagation()}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`pg-lb__dot${i === idx ? " is-active" : ""}`}
                onClick={() => onNext(i)}
              />
            ))}
          </div>
        )}
      </div>
    </>,
    document.body
  );
};

/* ── Product Gallery grid — matches Collection Gallery style ── */
const ProductGallery = ({ images = [], mainImage }) => {
  const allImages = mainImage
    ? [mainImage, ...images.filter((img) => img !== mainImage)]
    : images.length > 0 ? images : [FALLBACK];

  const [idx, setIdx] = useState(null);

  const close = () => setIdx(null);
  const prev  = () => setIdx((i) => (i - 1 + allImages.length) % allImages.length);
  const next  = (n) => {
    if (typeof n === "number") setIdx(n);
    else setIdx((i) => (i + 1) % allImages.length);
  };

  return (
    <>
      <style>{`
        .pg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.65rem;
        }

        .pg-item {
          overflow: hidden;
          border-radius: 12px;
          cursor: zoom-in;
          background: #111;
          position: relative;
        }
        .pg-item:first-child { grid-column: 1 / -1; }

        .pg-item img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          aspect-ratio: 4 / 3;
          filter: brightness(0.88);
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease;
        }
        .pg-item:first-child img { aspect-ratio: 16 / 9; }
        .pg-item:hover img { transform: scale(1.04); filter: brightness(1); }

        .pg-item::after {
          content: "⊕";
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; color: rgba(255,255,255,0);
          transition: color 0.3s;
          pointer-events: none;
        }
        .pg-item:hover::after { color: rgba(255,255,255,0.55); }

        @media (max-width: 768px) {
          .pg-grid { grid-template-columns: 1fr 1fr; gap: 0.5rem; }
          .pg-item:first-child { grid-column: 1 / -1; }
          .pg-item:first-child img { aspect-ratio: 16 / 9; }
        }
        @media (max-width: 480px) {
          .pg-grid { grid-template-columns: 1fr; }
          .pg-item img { aspect-ratio: 4 / 3; }
          .pg-item:first-child img { aspect-ratio: 16 / 9; }
        }
      `}</style>

      <div className="pg-grid">
        {allImages.map((src, i) => (
          <div key={i} className="pg-item" onClick={() => setIdx(i)}>
            <img
              src={src || FALLBACK}
              alt={`Product view ${i + 1}`}
              loading="lazy"
              onError={(e) => (e.currentTarget.src = FALLBACK)}
            />
          </div>
        ))}
      </div>

      {idx !== null && (
        <Lightbox
          images={allImages}
          idx={idx}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
};

export default ProductGallery;