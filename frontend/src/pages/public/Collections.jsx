// src/pages/public/Collections.jsx
import { useState, useEffect } from "react";
import { getAllCollections } from "../../api/collectionApi";
import CollectionCard from "../../components/collections/CollectionCard";
import CollectionFilter from "../../components/collections/CollectionFilter";

const SkeletonCard = () => (
  <div style={{
    borderRadius: "14px", overflow: "hidden",
    aspectRatio: "4/3", background: "#111",
    backgroundImage: "linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)",
    backgroundSize: "300% 100%",
    animation: "colShimmer 1.6s infinite",
  }} />
);

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeType, setActiveType]   = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);
    const params = { status: "active" };
    if (activeType) params.type = activeType;
    getAllCollections(params)
      .then((res) => setCollections(res.data.collections || []))
      .catch(() => setCollections([]))
      .finally(() => setLoading(false));
  }, [activeType]);

  const data = collections;

  return (
    <>
      <style>{`
        @keyframes colShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .col-page { min-height: 100vh; background: #0a0a0a; color: #f0ece4; }
        .col-grid {
          max-width: 1400px; margin: 0 auto;
          padding: 3rem clamp(1.25rem,5vw,4rem) 6rem;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2.5rem;
        }
        @media (max-width: 640px) {
          .col-grid { grid-template-columns: 1fr; gap: 1.5rem; }
        }
        .col-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 5rem 2rem;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 1.4rem;
          color: #3e3c3a;
        }
      `}</style>

      <main className="col-page">
        {/* ── Hero ── */}
        <section className="relative aspect-[16/7] min-h-[320px] sm:min-h-[420px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"
            alt="Our Collections"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-12 sm:pb-16">
            <span className="flex items-center gap-3 text-[0.72rem] tracking-[0.28em] uppercase text-[#c4a064] mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="block w-8 h-px bg-[#c4a064] opacity-50" />
              Our Portfolio
            </span>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-light text-white leading-[1.05] mb-4 animate-fade-up" style={{ animationDelay: '0.22s' }}>
              Crafted for Every <em>Space</em>
            </h1>
            <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] text-white/80 font-light max-w-[500px] leading-[1.8] animate-fade-up" style={{ animationDelay: '0.38s' }}>
              Bespoke interior collections — each an exercise in European precision, timeless design, and uncompromising quality.
            </p>
          </div>
        </section>

        <CollectionFilter active={activeType} onChange={setActiveType} />

        <div className="col-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : data.length > 0
              ? data.map((item, i) => (
                  <CollectionCard key={item._id} collection={item} index={i} />
                ))
              : <p className="col-empty">No collections found.</p>
          }
        </div>
      </main>
    </>
  );
};

export default Collections;