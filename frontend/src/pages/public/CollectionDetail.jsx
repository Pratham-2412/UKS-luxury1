// src/pages/public/CollectionDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCollectionBySlug, getAllCollections } from "../../api/collectionApi";
import CollectionCard from "../../components/collections/CollectionCard";
import CollectionGallery from "../../components/collections/CollectionGallery";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80";

const CollectionDetail = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [related, setRelated]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);
    setError(null);
    getCollectionBySlug(slug)
      .then(async (res) => {
        const coll = res.data.collection || res.data.data || res.data;
        setCollection(coll);
        try {
          const rel = await getAllCollections({ limit: 4, status: "active" });
          const items = rel.data.collections || [];
          setRelated(items.filter((c) => c.slug !== slug).slice(0, 3));
        } catch { /* silent */ }
      })
      .catch((err) =>
        setError(err.response?.status === 404 ? "404" : "error")
      )
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          border: "1px solid rgba(196,160,100,0.2)",
          borderTop: "1px solid #c4a064",
          animation: "spin 0.9s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "1.5rem",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "1.8rem", color: "#5a5550", fontStyle: "italic",
        }}>
          {error === "404" ? "Collection not found." : "Something went wrong."}
        </p>
        <Link to="/collections" style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: "0.65rem", letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#c4a064", textDecoration: "none",
        }}>
          ← All Collections
        </Link>
      </div>
    );
  }

  // Build gallery — collect every possible image field, deduplicate, drop nulls
  const rawGallery = [
    collection.bannerImage,
    collection.thumbnail,
    collection.image,
    ...(collection.gallery  || []),
    ...(collection.images   || []),
  ].filter(Boolean);

  // Deduplicate by URL
  const allImages = [...new Map(rawGallery.map((u) => [u, u])).values()];

  // If still nothing, use a single fallback so gallery isn't blank
  if (!allImages.length) allImages.push(FALLBACK_IMG);

  return (
    <>
      <style>{`
        @keyframes detailReveal {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cd-page { min-height: 100vh; background: #0a0a0a; color: #f0ece4; }

        .cd-page { min-height: 100vh; background: #0a0a0a; color: #f0ece4; }

        .cd-body {
          max-width: 1400px; margin: 0 auto;
          padding: 3.5rem clamp(1.25rem,5vw,4rem) 6rem;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 4rem;
          align-items: start;
        }

        .cd-long-desc {
          font-family: 'Jost', sans-serif;
          font-size: 0.92rem; color: rgba(240,236,228,0.7);
          line-height: 1.92; font-weight: 300;
          margin-bottom: 2.5rem;
        }

        .cd-sidebar { position: sticky; top: 2rem; }

        .cd-sidebar__card {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 2px solid #a07840;
          border-radius: 14px;
          padding: 1.6rem;
          margin-bottom: 1.25rem;
        }
        .cd-sidebar__heading {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem; letter-spacing: 0.22em;
          text-transform: uppercase; color: #c4a064;
          margin-bottom: 1.1rem;
          padding-bottom: 0.7rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .cd-sidebar__row {
          display: flex; flex-direction: column; gap: 0.15rem;
          padding: 0.7rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .cd-sidebar__row:last-child { border-bottom: none; }
        .cd-sidebar__label {
          font-family: 'Jost', sans-serif;
          font-size: 0.57rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: #3e3c3a;
        }
        .cd-sidebar__value {
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem; color: #f0ece4; font-weight: 300;
        }

        .cd-cta {
          display: flex; align-items: center; justify-content: center;
          width: 100%; padding: 0.95rem;
          background: linear-gradient(135deg, #c4a064, #a07840);
          color: #0a0a0a;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem; letter-spacing: 0.2em;
          text-transform: uppercase; text-decoration: none;
          border-radius: 10px;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .cd-cta:hover { opacity: 0.88; transform: translateY(-1px); }

        .cd-related {
          max-width: 1400px; margin: 0 auto;
          padding: 4rem clamp(1.25rem,5vw,4rem) 6rem;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .cd-related__heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; font-weight: 400; font-style: italic;
          color: #f0ece4; margin-bottom: 1.75rem;
        }
        .cd-related__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        @media (max-width: 960px) {
          .cd-body { grid-template-columns: 1fr; gap: 2.5rem; }
          .cd-sidebar { position: static; }
          .cd-related__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .cd-banner { margin: 1rem; border-radius: 12px; }
          .cd-related__grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cd-page">

        {/* ── Hero ── */}
        <section className="relative aspect-[16/7] min-h-[320px] sm:min-h-[420px] overflow-hidden">
          <img
            className="w-full h-full object-cover brightness-50"
            src={collection.bannerImage || collection.thumbnail || collection.image || FALLBACK_IMG}
            alt={collection.title}
            onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-12 sm:pb-16">
             <Link to="/collections" className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.2em] uppercase text-[#c4a064] mb-8 hover:opacity-70 transition-opacity animate-fade-up">
               ← Back to Collections
             </Link>

            <span className="flex items-center gap-3 text-[0.72rem] tracking-[0.28em] uppercase text-[#c4a064] mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="block w-8 h-px bg-[#c4a064] opacity-50" />
              Bespoke Collection
            </span>
            <h1 className="font-serif text-[clamp(2.2rem,6vw,5rem)] font-light text-white leading-[1.05] mb-4 animate-fade-up" style={{ animationDelay: '0.22s' }}>
              {collection.title}
            </h1>
            {collection.shortDescription && (
              <p className="text-[clamp(0.9rem,1.5vw,1.05rem)] text-white/60 font-light max-w-[500px] leading-[1.8] animate-fade-up" style={{ animationDelay: '0.38s' }}>
                {collection.shortDescription}
              </p>
            )}
          </div>
        </section>

        {/* Body */}
        <div className="cd-body">

          <div>
            {collection.longDescription && (
              <div
                className="cd-long-desc"
                dangerouslySetInnerHTML={{ __html: collection.longDescription }}
              />
            )}
            <CollectionGallery images={allImages} />
          </div>

          <aside className="cd-sidebar">
            <div className="cd-sidebar__card">
              <p className="cd-sidebar__heading">Collection Details</p>
              {[
                { label: "Type",   value: collection.type || collection.title },
                { label: "Status", value: collection.featured ? "Featured" : "Active" },
              ].map((r) => (
                <div key={r.label} className="cd-sidebar__row">
                  <span className="cd-sidebar__label">{r.label}</span>
                  <span className="cd-sidebar__value">{r.value}</span>
                </div>
              ))}
            </div>
            <Link to="/contact" className="cd-cta">
              Request a Consultation
            </Link>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="cd-related">
            <h2 className="cd-related__heading">Other Collections</h2>
            <div className="cd-related__grid">
              {related.map((item, i) => (
                <CollectionCard key={item._id} collection={item} index={i} />
              ))}
            </div>
          </section>
        )}

      </div>
    </>
  );
};

export default CollectionDetail;