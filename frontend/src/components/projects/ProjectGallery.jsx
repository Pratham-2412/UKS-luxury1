import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { RiCloseLine, RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";

const FALLBACK = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80";

/* ── Lightbox Portal ── */
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
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(4,3,2,0.98)",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        animation: "glbIn 0.2s ease-out",
      }}
    >
      <style>{`
        @keyframes glbIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes glbImgIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* Close Button — High Contrast & High Z-Index */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "30px",
          right: "30px",
          width: "50px",
          height: "50px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          cursor: "pointer",
          zIndex: 100000,
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#c4a064";
          e.currentTarget.style.color = "#000";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "#fff";
        }}
      >
        <RiCloseLine size={28} />
      </button>

      {/* Nav Buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="glb-nav-btn"
        style={{
          position: "absolute", left: "2rem", top: "50%", transform: "translateY(-50%)",
          width: "50px", height: "50px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", color: "#fff",
          cursor: "pointer", zIndex: 10, backdropFilter: "blur(4px)", transition: "all 0.2s"
        }}
      >
        <RiArrowLeftLine size={24} style={{ margin: "auto" }} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="glb-nav-btn"
        style={{
          position: "absolute", right: "2rem", top: "50%", transform: "translateY(-50%)",
          width: "50px", height: "50px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", color: "#fff",
          cursor: "pointer", zIndex: 10, backdropFilter: "blur(4px)", transition: "all 0.2s"
        }}
      >
        <RiArrowRightLine size={24} style={{ margin: "auto" }} />
      </button>

      {/* Content */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", maxWidth: "90vw", maxHeight: "80vh" }}
      >
        <img
          src={(typeof images[idx] === 'string' ? images[idx] : images[idx].url) || FALLBACK}
          alt="Lightbox"
          style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "12px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", animation: "glbImgIn 0.3s ease-out" }}
        />
        {typeof images[idx] === 'object' && images[idx].description && (
          <p style={{ color: "#f0ece4", textAlign: "center", maxWidth: "600px", fontWeight: 300, fontSize: "1rem", lineHeight: 1.6 }}>
            {images[idx].description}
          </p>
        )}
      </div>

      {/* Counter */}
      <div style={{ position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
        {idx + 1} / {images.length}
      </div>
    </div>,
    document.body
  );
};

const ProjectGallery = ({ images = [] }) => {
  const [idx, setIdx] = useState(null);

  if (!images.length) return null;

  const close = () => setIdx(null);
  const prev  = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next  = () => setIdx((i) => (i + 1) % images.length);

  return (
    <>
      <style>{`
        .pg { margin-top: 1rem; }
        .pg__heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem; font-style: italic; font-weight: 400;
          color: #f0ece4; margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .pg__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .pg__grid { grid-template-columns: repeat(3, 1fr); }
        }
        .pg__item {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          cursor: zoom-in;
        }
        .pg__item:first-child {
          grid-column: 1 / -1;
        }
        .pg__img-box {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          background: #111;
          aspect-ratio: 4 / 3;
        }
        .pg__item:first-child .pg__img-box {
          aspect-ratio: 16 / 9;
        }
        .pg__img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pg__item:hover .pg__img {
          transform: scale(1.05);
        }
        .pg__desc {
          font-size: 0.8rem;
          color: #a09880;
          line-height: 1.5;
          font-weight: 300;
          letter-spacing: 0.02em;
        }
      `}</style>

      <section className="pg">
        <h2 className="pg__heading">Project Gallery</h2>
        <div className="pg__grid">
          {images.map((img, i) => {
            const src = typeof img === 'string' ? img : img.url;
            const desc = typeof img === 'object' ? img.description : "";

            return (
              <div key={i} className="pg__item" onClick={() => setIdx(i)}>
                <div className="pg__img-box">
                  <img
                    src={src || FALLBACK}
                    alt={desc || `Project image ${i + 1}`}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = FALLBACK)}
                    className="pg__img"
                  />
                </div>
                {desc && <p className="pg__desc">{desc}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {idx !== null && (
        <Lightbox
          images={images}
          idx={idx}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
};

export default ProjectGallery;