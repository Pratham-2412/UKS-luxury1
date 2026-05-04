// src/pages/public/CollectionDetail.jsx
import { useState, useEffect, useRef, memo } from "react";
import { useParams, Link } from "react-router-dom";
import { getCollectionBySlug, getAllCollections } from "../../api/collectionApi";
import { getPublicSubcategories } from "../../api/subcategoryApi";
import CollectionCard from "../../components/collections/CollectionCard";
import CollectionGallery from "../../components/collections/CollectionGallery";
import { RiArrowRightLine } from "react-icons/ri";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80";

/* ── Scroll reveal hook ── */
const useSR = (threshold = 0.01) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

/* ── Brand Card Component ── */
const BrandCard = memo(({ brand, index, collectionSlug }) => {
  const [ref, inView] = useSR(0.01);
  const [hovered, setHovered] = useState(false);

  const innerContent = (
    <div className="cd-brand-card__img-wrap" style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}>
      <img
        src={brand.thumbnail || brand.heroImage || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80"}
        alt={brand.name}
        loading="lazy"
        className="cd-brand-card__img"
        style={{
          transform: hovered ? "scale(1.04)" : "scale(1)",
          filter: hovered ? "brightness(0.65)" : "brightness(0.8)",
          transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), filter 1s ease",
          willChange: "transform"
        }}
      />
      <div className="cd-brand-card__overlay" />

      <div className="cd-brand-card__name-wrap">
        <span className="cd-brand-card__eyebrow">Partner Brand</span>
        <h3 className="cd-brand-card__name">{brand.name}</h3>
        <p className="cd-brand-card__tagline">{brand.tagline}</p>
      </div>

      <div
        className="cd-brand-card__cta"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <span>Explore</span>
        <RiArrowRightLine />
      </div>

      <div
        className="cd-brand-card__line"
        style={{ width: hovered ? "100%" : "0%" }}
      />
    </div>
  );

  const styleProps = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translate3d(0,0,0)" : "translate3d(0,40px,0)",
    transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${(index % 3) * 0.12}s`,
    willChange: "transform, opacity"
  };

  if (brand.externalUrl) {
    return (
      <a
        ref={ref}
        href={brand.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="cd-brand-card"
        style={styleProps}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      to={`/collections/${collectionSlug}/${brand.slug}`}
      className="cd-brand-card"
      style={styleProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {innerContent}
    </Link>
  );
});

const CollectionDetail = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [brands, setBrands]         = useState([]);
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
          const brandsRes = await getPublicSubcategories({ collectionSlug: coll.slug });
          setBrands(brandsRes.data?.data || []);
          
          const rel = await getAllCollections({ limit: 4, status: "active" });
          const items = rel.data.collections || [];
          setRelated(items.filter((c) => c.slug !== slug).slice(0, 3));
        } catch { /* silent */ }
      })
      .catch((err) => {
        // Fallback for known luxury categories to show "Coming Soon" instead of 404
        const knownSlugs = ["dining-room", "living-room", "bedroom", "wardrobe", "bathroom", "home-office"];
        if (knownSlugs.includes(slug)) {
          setCollection({
            title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
            slug: slug,
            type: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
            shortDescription: "Our premium portfolio is currently being curated. Check back soon for the full reveal.",
            longDescription: "<p>We are currently finalizing the photography and technical specifications for this collection. Our commitment to excellence means every detail must be perfect before we share it with you.</p>",
            isComingSoon: true
          });
        } else {
          setError(err.response?.status === 404 ? "404" : "error");
        }
      })
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

        /* ── Brands Section ── */
        .cd-brands-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem clamp(1.5rem, 5vw, 5rem) 4rem;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .cd-brands-header__eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c4a064;
          margin-bottom: 0.75rem;
        }
        .cd-brands-header__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 300;
          font-style: italic;
          color: #f0ece4;
          margin-bottom: 0.75rem;
        }
        .cd-brands-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1rem, 2vw, 1.75rem);
          margin-top: 3rem;
          text-align: left;
        }
        
        /* ── Brand Card ── */
        .cd-brand-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .cd-brand-card__img-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          aspect-ratio: 16 / 10;
          background: #111;
        }
        .cd-brand-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease;
        }
        .cd-brand-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.15) 50%, transparent 100%);
          pointer-events: none;
        }
        .cd-brand-card__name-wrap {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem;
          z-index: 2;
        }
        .cd-brand-card__eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c4a064;
          margin-bottom: 0.35rem;
          display: block;
        }
        .cd-brand-card__name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 2vw, 1.6rem);
          font-weight: 400;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 0.3rem;
        }
        .cd-brand-card__tagline {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
        }
        .cd-brand-card__cta {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c4a064;
          z-index: 3;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .cd-brand-card__line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(to right, #c4a064, transparent);
          z-index: 3;
          transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        @media (max-width: 960px) {
          .cd-body { grid-template-columns: 1fr; gap: 2.5rem; }
          .cd-sidebar { position: static; }
          .cd-related__grid { grid-template-columns: repeat(2, 1fr); }
          .cd-brands-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .cd-banner { margin: 1rem; border-radius: 12px; }
          .cd-related__grid { grid-template-columns: 1fr; }
          .cd-brands-grid { grid-template-columns: 1fr; }
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
            
            {allImages.length === 1 && allImages[0] === FALLBACK_IMG && collection.isComingSoon ? (
               <div className="py-20 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
                  <p className="font-serif text-xl italic text-white/40">Portfolio Curating — Check back soon</p>
               </div>
            ) : (
              <CollectionGallery images={allImages} />
            )}
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
              {brands.length > 0 && (
                <div className="cd-sidebar__row">
                  <span className="cd-sidebar__label">Partner Brands</span>
                  <span className="cd-sidebar__value">{brands.length} Brands</span>
                </div>
              )}
            </div>
            <Link to="/contact" className="cd-cta">
              Request a Consultation
            </Link>
          </aside>
        </div>

        {/* Brands Section */}
        {brands.length > 0 && (
          <section className="cd-brands-section">
            <p className="cd-brands-header__eyebrow">Our Partners</p>
            <h2 className="cd-brands-header__title">Premium {collection.title} Brands</h2>
            <div className="cd-brands-grid">
              {brands.map((brand, i) => (
                <BrandCard key={brand.slug} brand={brand} index={i} collectionSlug={slug} />
              ))}
            </div>
          </section>
        )}

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