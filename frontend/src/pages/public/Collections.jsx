// src/pages/public/Collections.jsx
import { useState, useEffect } from "react";
import { getAllCollections } from "../../api/collectionApi";
import CollectionCard from "../../components/collections/CollectionCard";

// ── These are the ONLY categories we show — matching the navbar ───────────
const STANDARD_COLLECTIONS = [
  {
    slug: "bespoke-kitchens",
    title: "Bespoke Kitchens",
    type: "Kitchen",
    thumbnail: "/bespoke-kitchen.jpg",
    shortDescription: "German precision meets award-winning design. Discover our premium partner brands.",
  },
  {
    slug: "dining-rooms",
    title: "Dining Rooms",
    type: "DiningRoom",
    thumbnail: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80",
    shortDescription: "Elegant spaces designed for unforgettable gatherings and timeless memories.",
  },
  {
    slug: "living-room",
    title: "Living Room",
    type: "LivingRoom",
    thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
    shortDescription: "Sophisticated comfort crafted with the finest materials and European aesthetics.",
  },
  {
    slug: "offices",
    title: "Offices",
    type: "HomeOffice",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    shortDescription: "Productivity meets elegance in our custom-designed professional workspaces.",
  },
  {
    slug: "bookcases",
    title: "Bookcases",
    type: "LivingRoom",
    thumbnail: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200&q=80",
    shortDescription: "Bespoke shelving solutions that showcase your collection with understated luxury.",
  },
  {
    slug: "hinged-wardrobes",
    title: "Hinged Wardrobes",
    type: "Wardrobe",
    thumbnail: "https://images.unsplash.com/photo-1558997519-53bb890929a3?w=1200&q=80",
    shortDescription: "Classic wardrobe design with timeless elegance and premium craftsmanship.",
  },
  {
    slug: "sliding-wardrobes",
    title: "Sliding Wardrobes",
    type: "Wardrobe",
    thumbnail: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80",
    shortDescription: "Space-efficient luxury with smooth, seamless sliding mechanisms.",
  },
  {
    slug: "walk-in-closet",
    title: "Walk In Closet",
    type: "Wardrobe",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    shortDescription: "Your personal dressing sanctuary, designed to perfection.",
  },
  {
    slug: "storage-units",
    title: "Storage Units",
    type: "LivingRoom",
    thumbnail: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80",
    shortDescription: "Intelligent storage solutions that blend seamlessly into your living space.",
  },
];

const SkeletonCard = () => (
  <div style={{
    borderRadius: "14px", overflow: "hidden",
    aspectRatio: "3/2", background: "#111",
    backgroundImage: "linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)",
    backgroundSize: "300% 100%",
    animation: "colShimmer 1.6s infinite",
  }} />
);

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);
    getAllCollections({ status: "active", limit: 100 })
      .then((res) => setCollections(res.data.collections || []))
      .catch(() => setCollections([]))
      .finally(() => setLoading(false));
  }, []);

  // Merge backend data with standard list — backend data takes priority for thumbnail/description
  const data = STANDARD_COLLECTIONS.map((std) => {
    const fromDB = collections.find((c) => c.slug === std.slug);
    if (fromDB) {
      return {
        ...std,
        ...fromDB,
        // Keep our standard title if backend doesn't have a good one
        title: fromDB.title || std.title,
        thumbnail: fromDB.thumbnail || std.thumbnail,
        shortDescription: fromDB.shortDescription || std.shortDescription,
      };
    }
    return { ...std, _id: std.slug };
  });

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

        <div className="col-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : data.length > 0
              ? data.map((item, i) => (
                  <CollectionCard key={item._id || item.slug} collection={item} index={i} />
                ))
              : <p className="col-empty">No collections found.</p>
          }
        </div>
      </main>
    </>
  );
};

export default Collections;