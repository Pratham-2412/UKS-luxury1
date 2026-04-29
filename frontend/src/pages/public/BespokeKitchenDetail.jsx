// src/pages/public/BespokeKitchenDetail.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { RiArrowRightLine } from "react-icons/ri";

import { getPublicSubcategories } from "../../api/subcategoryApi";

/* ── Scroll reveal hook ─────────────────────────────────────────────────── */
const useSR = (threshold = 0.12) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

/* ── Brand Card Component ───────────────────────────────────────────────── */
const BrandCard = ({ brand, index }) => {
  const [ref, inView] = useSR(0.08);
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      ref={ref}
      to={`/collections/bespoke-kitchens/${brand.slug}`}
      className="bk-brand-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${index * 0.07}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="bk-brand-card__img-wrap">
        <img
          src={brand.thumbnail || brand.firstItemImage || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80"}
          alt={brand.name}
          loading="lazy"
          className="bk-brand-card__img"
          style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
            filter: hovered ? "brightness(0.55)" : "brightness(0.75)",
          }}
        />
        <div className="bk-brand-card__overlay" />

        {/* Brand name overlay */}
        <div className="bk-brand-card__name-wrap">
          <span className="bk-brand-card__eyebrow">Partner Brand</span>
          <h3 className="bk-brand-card__name">{brand.name}</h3>
          <p className="bk-brand-card__tagline">{brand.tagline}</p>
        </div>

        {/* Hover CTA */}
        <div
          className="bk-brand-card__cta"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <span>Explore</span>
          <RiArrowRightLine />
        </div>

        {/* Gold bottom line */}
        <div
          className="bk-brand-card__line"
          style={{ width: hovered ? "100%" : "0%" }}
        />
      </div>
    </Link>
  );
};

/* ── Main Page Component ────────────────────────────────────────────────── */
const BespokeKitchenDetail = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    
    const fetchBrands = async () => {
      try {
        const res = await getPublicSubcategories({ collectionSlug: "bespoke-kitchens" });
        setBrands(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch brands", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrands();
  }, []);

  return (
    <>
      <style>{`
        /* ── Page ── */
        .bk-page { min-height: 100vh; background: #0a0a0a; color: #f0ece4; }

        /* ── Hero ── */
        .bk-hero {
          position: relative;
          width: 100%;
          min-height: 480px;
          overflow: hidden;
        }
        .bk-hero__img {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          object-fit: cover;
          filter: brightness(0.75);
        }
        .bk-hero__gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.4) 30%, transparent 70%);
        }
        .bk-hero__content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 clamp(1.5rem, 5vw, 5rem) 3.5rem;
          z-index: 5;
        }
        .bk-hero__back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c4a064;
          text-decoration: none;
          margin-bottom: 2rem;
          transition: opacity 0.2s;
        }
        .bk-hero__back:hover { opacity: 0.7; }
        .bk-hero__eyebrow {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c4a064;
          margin-bottom: 1rem;
        }
        .bk-hero__eyebrow-line {
          display: block;
          width: 2rem;
          height: 1px;
          background: #c4a064;
          opacity: 0.5;
        }
        .bk-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 300;
          color: #fff;
          line-height: 1.05;
          margin-bottom: 1rem;
          text-shadow: 0 2px 15px rgba(0,0,0,0.5);
        }
        .bk-hero__desc {
          font-family: 'Jost', sans-serif;
          font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          font-weight: 300;
          color: rgba(255,255,255,0.85);
          max-width: 600px;
          line-height: 1.8;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        /* ── Section Header ── */
        .bk-section-header {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem clamp(1.5rem, 5vw, 5rem) 0;
          text-align: center;
        }
        .bk-section-header__eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c4a064;
          margin-bottom: 0.75rem;
        }
        .bk-section-header__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 300;
          font-style: italic;
          color: #f0ece4;
          margin-bottom: 0.75rem;
        }
        .bk-section-header__desc {
          font-family: 'Jost', sans-serif;
          font-size: 0.92rem;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.8;
        }
        .bk-section-header__divider {
          display: block;
          width: 60px;
          height: 1px;
          background: linear-gradient(to right, transparent, #c4a064, transparent);
          margin: 1.5rem auto 0;
        }

        /* ── Brand Grid — 3 per row landscape ── */
        .bk-grid {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem clamp(1.25rem, 5vw, 4rem) 6rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1rem, 2vw, 1.75rem);
        }

        /* ── Brand Card ── */
        .bk-brand-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .bk-brand-card__img-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          aspect-ratio: 16 / 10;
          background: #111;
        }
        .bk-brand-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease;
        }
        .bk-brand-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.15) 50%, transparent 100%);
          pointer-events: none;
        }
        .bk-brand-card__name-wrap {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem;
          z-index: 2;
        }
        .bk-brand-card__eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c4a064;
          margin-bottom: 0.35rem;
          display: block;
        }
        .bk-brand-card__name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.2rem, 2vw, 1.6rem);
          font-weight: 400;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 0.3rem;
        }
        .bk-brand-card__tagline {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
        }
        .bk-brand-card__cta {
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
        .bk-brand-card__line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(to right, #c4a064, transparent);
          z-index: 3;
          transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .bk-grid { grid-template-columns: repeat(2, 1fr); }
          .bk-hero { min-height: 380px; }
        }
        @media (max-width: 560px) {
          .bk-grid { grid-template-columns: 1fr; }
          .bk-hero { min-height: 320px; }
        }

        /* ── Animations ── */
        @keyframes bkFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bk-anim { animation: bkFadeUp 0.8s ease forwards; }
        .bk-anim-d1 { animation-delay: 0.1s; }
        .bk-anim-d2 { animation-delay: 0.22s; }
        .bk-anim-d3 { animation-delay: 0.38s; }
      `}</style>

      <main className="bk-page">

        {/* ── Hero ── */}
        <section className="bk-hero" style={{ aspectRatio: "16/7" }}>
          <img
            className="bk-hero__img"
            src="/bespoke-kitchen.jpg"
            alt="Bespoke Kitchens"
            onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80")}
          />
          <div className="bk-hero__gradient" />
          <div className="bk-hero__content">
            <Link to="/collections" className="bk-hero__back bk-anim bk-anim-d1">
              ← Back to Collections
            </Link>
            <span className="bk-hero__eyebrow bk-anim bk-anim-d1">
              <span className="bk-hero__eyebrow-line" />
              Bespoke Collection
            </span>
            <h1 className="bk-hero__title bk-anim bk-anim-d2">
              Bespoke <em>Kitchens</em>
            </h1>
            <p className="bk-hero__desc bk-anim bk-anim-d3">
              We partner with the world's finest kitchen manufacturers and appliance brands
              to deliver truly bespoke kitchen experiences. Explore our curated selection of
              premium partners below.
            </p>
          </div>
        </section>

        {/* ── Section Header ── */}
        <div className="bk-section-header">
          <p className="bk-section-header__eyebrow">Our Partners</p>
          <h2 className="bk-section-header__title">Premium Kitchen Brands</h2>
          <p className="bk-section-header__desc">
            Each brand has been meticulously selected for its commitment to quality,
            innovation, and design excellence — the same values we bring to every kitchen we create.
          </p>
          <span className="bk-section-header__divider" />
        </div>

        {/* ── Brand Grid — 3 per row ── */}
        <div className="bk-grid">
          {loading ? (
            <p style={{ textAlign: "center", gridColumn: "1 / -1", color: "#c4a064", fontFamily: "Jost" }}>
              Loading partners...
            </p>
          ) : brands.length === 0 ? (
            <p style={{ textAlign: "center", gridColumn: "1 / -1", color: "rgba(255,255,255,0.5)", fontFamily: "Jost" }}>
              No partners available at the moment.
            </p>
          ) : (
            brands.map((brand, i) => (
              <BrandCard key={brand.slug} brand={brand} index={i} />
            ))
          )}
        </div>

        {/* ── CTA Section ── */}
        <section style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 5rem) 6rem",
        }}>
          <div style={{
            background: "#111",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px",
            padding: "clamp(2rem, 4vw, 3.5rem)",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#c4a064",
              marginBottom: "0.75rem",
            }}>
              Ready to Begin?
            </p>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#f0ece4",
              marginBottom: "1rem",
            }}>
              Design Your Dream Kitchen
            </h3>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.88rem",
              fontWeight: 300,
              color: "rgba(255,255,255,0.45)",
              maxWidth: "500px",
              margin: "0 auto 2rem",
              lineHeight: 1.8,
            }}>
              Book a private consultation with our design team to explore
              how these world-class brands can transform your space.
            </p>
            <Link to="/contact" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 2.5rem",
              background: "linear-gradient(135deg, #c4a064, #a07840)",
              color: "#0a0a0a",
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "10px",
              transition: "all 0.3s ease",
            }}>
              Book a Consultation
              <RiArrowRightLine />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default BespokeKitchenDetail;
