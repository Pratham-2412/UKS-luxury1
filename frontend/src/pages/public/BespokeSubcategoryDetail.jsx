// src/pages/public/BespokeSubcategoryDetail.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { getPublicSubcategories, getPublicSubcategoryBySlug, getPublicSubcategoryItemsBySlug } from "../../api/subcategoryApi";
import { RiArrowRightLine, RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

/* ── Lightbox Component ── */
const Lightbox = ({ images, title, activeIdx, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") onPrev(); if (e.key === "ArrowRight") onNext(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose, onPrev, onNext]);

  const src = images[activeIdx];
  
  return createPortal(
    <div className="bs-lb" onClick={onClose}>
      <button className="bs-lb__close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
        <span>Close Gallery</span>
        <RiCloseLine style={{fontSize: '1.4rem'}} />
      </button>
      
      <div className="bs-lb__inner" onClick={onClose}>
        <div className="bs-lb__img-container" onClick={e => e.stopPropagation()}>
          <img key={activeIdx} src={src} alt={title} className="bs-lb__img" />
        </div>
        
        <div className="bs-lb__footer" onClick={e => e.stopPropagation()}>
          <p className="bs-lb__name">{title}</p>
          <div className="bs-lb__count">{activeIdx + 1} / {images.length}</div>
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button className="bs-lb__arrow bs-lb__arrow--left" onClick={(e) => { e.stopPropagation(); onPrev(); }}><RiArrowLeftSLine /></button>
          <button className="bs-lb__arrow bs-lb__arrow--right" onClick={(e) => { e.stopPropagation(); onNext(); }}><RiArrowRightSLine /></button>
        </>
      )}
    </div>,
    document.body
  );
};

/* ── Scroll Reveal Hook ── */
const useSR = (threshold = 0.1) => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, v];
};

/* ── Product Item Card ── */
const ProductCard = ({ item, index, onClick }) => {
  const [ref, inView] = useSR(0.08);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} className="bs-prod-card" style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(25px)", transitionDelay: `${index * 0.06}s` }}
      onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="bs-prod-card__img-wrap">
        <img src={(item.images && item.images[0]) || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80"} alt={item.name} className="bs-prod-card__img" loading="lazy"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)", filter: hovered ? "brightness(0.6)" : "brightness(0.82)" }} />
        <div className="bs-prod-card__overlay" />
        <div className="bs-prod-card__view" style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)" }}>
          <span>View Image</span>
        </div>
        <div className="bs-prod-card__line" style={{ width: hovered ? "100%" : "0%" }} />
      </div>
      <h4 className="bs-prod-card__name" style={{ color: hovered ? "#c4a064" : "#f0ece4" }}>{item.name}</h4>
    </div>
  );
};

/* ── Main Page ── */
const BespokeSubcategoryDetail = () => {
  const { brand: brandSlug } = useParams();
  const [activeProduct, setActiveProduct] = useState(null);
  const [lbIdx, setLbIdx] = useState(0);
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [otherBrands, setOtherBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const openLightbox = (product) => {
    setActiveProduct(product);
    setLbIdx(0);
  };

  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: "instant" }); 
    const fetchData = async () => {
      try {
        setLoading(true);
        const brandRes = await getPublicSubcategoryBySlug(brandSlug);
        setBrand(brandRes.data.data);
        const itemsRes = await getPublicSubcategoryItemsBySlug(brandSlug);
        setProducts(itemsRes.data.data || []);
        const allRes = await getPublicSubcategories();
        const allBrands = allRes.data.data || [];
        setOtherBrands(allBrands.filter(b => b.slug !== brandSlug).slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [brandSlug]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'Jost',sans-serif", color: "#c4a064" }}>Loading Brand Details...</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", color: "#5a5550", fontStyle: "italic" }}>Brand not found.</p>
        <Link to="/collections/bespoke-kitchens" style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c4a064", textDecoration: "none" }}>← Back to Bespoke Kitchens</Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .bs-page{min-height:100vh;background:#0a0a0a;color:#f0ece4}
        @keyframes bsFade{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .bs-anim{animation:bsFade 0.8s ease forwards}

        .bs-desc-section{max-width:1400px;margin:0 auto;padding:3.5rem clamp(1.25rem,5vw,4rem) 2rem}
        .bs-desc-wrap{display:grid;grid-template-columns:1fr 320px;gap:3.5rem;align-items:start}
        .bs-long-desc{font-family:'Jost',sans-serif;font-size:0.95rem;color:rgba(240,236,228,0.7);line-height:1.92;font-weight:300}
        .bs-long-desc p{margin-bottom:1.25rem}
        .bs-sidebar{position:sticky;top:2rem}
        .bs-sidebar__card{background:#141414;border:1px solid rgba(255,255,255,0.07);border-top:2px solid #a07840;border-radius:14px;padding:1.6rem;margin-bottom:1.25rem}
        .bs-sidebar__heading{font-family:'Jost',sans-serif;font-size:0.58rem;letter-spacing:0.22em;text-transform:uppercase;color:#c4a064;margin-bottom:1.1rem;padding-bottom:0.7rem;border-bottom:1px solid rgba(255,255,255,0.07)}
        .bs-sidebar__feature{display:flex;align-items:center;gap:0.5rem;padding:0.55rem 0;border-bottom:1px solid rgba(255,255,255,0.05);font-family:'Jost',sans-serif;font-size:0.85rem;font-weight:300;color:rgba(240,236,228,0.75)}
        .bs-sidebar__feature:last-child{border-bottom:none}
        .bs-sidebar__dot{width:5px;height:5px;border-radius:50%;background:rgba(196,160,100,0.5);flex-shrink:0}
        .bs-cta{display:flex;align-items:center;justify-content:center;gap:0.5rem;width:100%;padding:0.95rem;background:linear-gradient(135deg,#c4a064,#a07840);color:#0a0a0a;font-family:'Jost',sans-serif;font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;border-radius:10px;transition:opacity 0.25s,transform 0.25s}
        .bs-cta:hover{opacity:0.88;transform:translateY(-1px)}

        .bs-products-header{max-width:1400px;margin:0 auto;padding:2rem clamp(1.25rem,5vw,4rem) 0;border-top:1px solid rgba(255,255,255,0.06)}
        .bs-products-header__eyebrow{font-family:'Jost',sans-serif;font-size:0.6rem;letter-spacing:0.25em;text-transform:uppercase;color:#c4a064;margin-bottom:0.5rem}
        .bs-products-header__title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.4rem,2.5vw,2rem);font-weight:300;font-style:italic;color:#f0ece4;margin-bottom:0.5rem}
        .bs-products-header__subtitle{font-family:'Jost',sans-serif;font-size:0.85rem;font-weight:300;color:rgba(255,255,255,0.45);max-width:550px;line-height:1.7}

        .bs-prod-grid{max-width:1400px;margin:0 auto;padding:2.5rem clamp(1.25rem,5vw,4rem) 4rem;display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(1.25rem,2.5vw,2rem)}
        .bs-prod-card{cursor:pointer;transition:opacity 0.6s ease,transform 0.6s ease}
        .bs-prod-card__img-wrap{position:relative;overflow:hidden;border-radius:16px;aspect-ratio:16/11;background:#111}
        .bs-prod-card__img{width:100%;height:100%;object-fit:cover;transition:transform 0.7s cubic-bezier(0.16,1,0.3,1),filter 0.5s ease}
        .bs-prod-card__overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,10,0.7) 0%,transparent 50%);pointer-events:none}
        .bs-prod-card__view{position:absolute;bottom:1.25rem;left:1.25rem;display:flex;align-items:center;gap:0.3rem;font-family:'Jost',sans-serif;font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:#c4a064;transition:opacity 0.35s ease,transform 0.35s ease;z-index:2}
        .bs-prod-card__line{position:absolute;bottom:0;left:0;height:2px;background:linear-gradient(to right,#c4a064,transparent);z-index:3;transition:width 0.5s cubic-bezier(0.16,1,0.3,1)}
        .bs-prod-card__name{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:400;margin-top:0.75rem;transition:color 0.3s}

        .bs-lb{position:fixed;top:0!important;left:0!important;width:100vw!important;height:100vh!important;z-index:999999999!important;background:#000;display:flex;align-items:center;justify-content:center;animation:bsFadeIn 0.5s ease;user-select:none;overflow:hidden}
        @keyframes bsFadeIn{from{opacity:0}to{opacity:1}}
        .bs-lb__close{position:fixed;top:40px;right:40px;background:#c4a064;border:none;color:#000;padding:12px 24px;border-radius:4px;display:flex;align-items:center;gap:10px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;cursor:pointer;z-index:9999999999!important;transition:all 0.3s cubic-bezier(0.16,1,0.3,1)}
        .bs-lb__close:hover{background:#fff;transform:translateY(-2px);box-shadow:0 10px 40px rgba(0,0,0,0.8)}
        .bs-lb__inner{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px}
        .bs-lb__img-container{height:88vh;width:auto;display:flex;align-items:center;justify-content:center;position:relative;background:#000;border-radius:4px;box-shadow:0 60px 120px rgba(0,0,0,1);overflow:hidden}
        .bs-lb__img{height:100%;width:auto;max-width:95vw;object-fit:contain;animation:bsImgSmooth 0.8s cubic-bezier(0.16,1,0.3,1)}
        @keyframes bsImgSmooth{from{opacity:0;transform:scale(1.02)}to{opacity:1;transform:scale(1)}}
        .bs-lb__footer{margin-top:15px;text-align:center;width:100%;z-index:3}
        .bs-lb__name{font-family:'Cormorant Garamond',serif;font-size:2rem;color:#f0ece4;font-weight:300;margin-bottom:4px}
        .bs-lb__count{font-family:'Jost',sans-serif;font-size:0.8rem;letter-spacing:0.4em;color:#c4a064;text-transform:uppercase}
        .bs-lb__arrow{position:fixed;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);color:#fff;width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;cursor:pointer;transition:all 0.4s;z-index:999999999!important}
        .bs-lb__arrow:hover{background:#c4a064;color:#000;border-color:#c4a064;transform:translateY(-50%) scale(1.1)}
        .bs-lb__arrow--left{left:40px}
        .bs-lb__arrow--right{right:40px}

        .bs-related{max-width:1400px;margin:0 auto;padding:4rem clamp(1.25rem,5vw,4rem) 6rem;border-top:1px solid rgba(255,255,255,0.07)}
        .bs-related__heading{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:400;font-style:italic;color:#f0ece4;margin-bottom:1.75rem}
        .bs-related__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
        .bs-related__card{text-decoration:none;color:inherit;display:flex;flex-direction:column;gap:0.75rem}
        .bs-related__card-img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:12px;transition:transform 0.5s cubic-bezier(0.16,1,0.3,1)}
        .bs-related__card:hover .bs-related__card-img{transform:scale(1.04)}
        .bs-related__card-name{font-family:'Cormorant Garamond',serif;font-size:1.1rem;color:#f0ece4}
        .bs-related__card-tag{font-family:'Jost',sans-serif;font-size:0.72rem;color:rgba(255,255,255,0.4);font-weight:300}

        @media(max-width:1200px){
          .bs-lb__arrow{width:60px;height:60px;font-size:1.8rem}
          .bs-lb__arrow--left{left:10px}.bs-lb__arrow--right{right:10px}
        }
        @media(max-width:960px){
          .bs-desc-wrap{grid-template-columns:1fr;gap:2.5rem}
          .bs-sidebar{position:static}
          .bs-prod-grid{grid-template-columns:repeat(2,1fr)}
          .bs-related__grid{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:768px){
          .bs-lb__img-container{height:65vh}
          .bs-lb__close{top:20px;right:20px;padding:8px 16px;font-size:0.65rem}
          .bs-lb__name{font-size:1.6rem}
          .bs-lb__arrow{width:50px;height:50px;font-size:1.6rem}
        }
        @media(max-width:560px){
          .bs-prod-grid{grid-template-columns:1fr}
          .bs-related__grid{grid-template-columns:1fr}
        }
      `}</style>

      <div className="bs-page">
        {/* ── Lightbox (Rendered at top for z-index stack) ── */}
        {activeProduct && activeProduct.images && activeProduct.images.length > 0 && (
          <Lightbox
            images={activeProduct.images}
            title={activeProduct.name}
            activeIdx={lbIdx}
            onClose={() => setActiveProduct(null)}
            onPrev={() => setLbIdx((p) => (p - 1 + activeProduct.images.length) % activeProduct.images.length)}
            onNext={() => setLbIdx((p) => (p + 1) % activeProduct.images.length)}
          />
        )}

        {/* ── Hero ── */}
        <section className="relative overflow-hidden" style={{ aspectRatio: "16/7", minHeight: "320px" }}>
          <img className="w-full h-full object-cover brightness-50" src={brand?.heroImage || brand?.thumbnail || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"} alt={brand.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-12 sm:pb-16">
            <Link to="/collections/bespoke-kitchens" className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.2em] uppercase text-[#c4a064] mb-8 hover:opacity-70 transition-opacity bs-anim">← Back to Bespoke Kitchens</Link>
            <span className="flex items-center gap-3 text-[0.72rem] tracking-[0.28em] uppercase text-[#c4a064] mb-4 bs-anim" style={{ animationDelay: "0.1s" }}>
              <span className="block w-8 h-px bg-[#c4a064] opacity-50" />Bespoke Kitchens — Partner Brand
            </span>
            <h1 className="font-serif text-[clamp(2.2rem,6vw,5rem)] font-light text-white leading-[1.05] mb-4 bs-anim" style={{ animationDelay: "0.22s" }}>{brand.name}</h1>
            <p className="text-[clamp(0.9rem,1.5vw,1.05rem)] text-white/60 font-light max-w-[500px] leading-[1.8] bs-anim" style={{ animationDelay: "0.38s" }}>{brand.tagline}</p>
          </div>
        </section>

        {/* ── Description + Sidebar ── */}
        <div className="bs-desc-section">
          <div className="bs-desc-wrap">
            <div>
              {brand?.longDescription && <div className="bs-long-desc" dangerouslySetInnerHTML={{ __html: brand.longDescription }} />}
            </div>
            <aside className="bs-sidebar">
              <div className="bs-sidebar__card">
                <p className="bs-sidebar__heading">Brand Details</p>
                <div style={{ padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3e3c3a" }}>Brand</span>
                  <span style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: "0.875rem", color: "#f0ece4", fontWeight: 300 }}>{brand.name}</span>
                </div>
                <div style={{ padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3e3c3a" }}>Category</span>
                  <span style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: "0.875rem", color: "#f0ece4", fontWeight: 300 }}>Bespoke Kitchens</span>
                </div>
                {products.length > 0 && (
                  <div style={{ padding: "0.6rem 0" }}>
                    <span style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3e3c3a" }}>Products</span>
                    <span style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: "0.875rem", color: "#f0ece4", fontWeight: 300 }}>{products.length} Collections</span>
                  </div>
                )}
              </div>
              {brand?.features && brand.features.length > 0 && (
                <div className="bs-sidebar__card">
                  <p className="bs-sidebar__heading">Key Features</p>
                  {brand.features.map((f, i) => (
                    <div key={i} className="bs-sidebar__feature"><span className="bs-sidebar__dot" />{f}</div>
                  ))}
                </div>
              )}
              <Link to="/contact" className="bs-cta">Request a Consultation <RiArrowRightLine /></Link>
            </aside>
          </div>
        </div>

        {/* ── Products Grid (only if brand has products) ── */}
        {products.length > 0 && (
          <>
            <div className="bs-products-header">
              <p className="bs-products-header__eyebrow">{brand.name} Collection</p>
              <h2 className="bs-products-header__title">Explore Our {brand.name} Range</h2>
              <p className="bs-products-header__subtitle">
                Click on any item below to view the full image. Each design represents the pinnacle of {brand.name}'s craftsmanship.
              </p>
            </div>
            <div className="bs-prod-grid">
              {products.map((item, i) => (
                <ProductCard key={item.name} item={item} index={i} onClick={() => openLightbox(item)} />
              ))}
            </div>
          </>
        )}

        {/* ── Related Brands ── */}
        {otherBrands.length > 0 && (
          <section className="bs-related">
            <h2 className="bs-related__heading">More Partner Brands</h2>
            <div className="bs-related__grid">
              {otherBrands.map(b => (
                <Link key={b.slug} to={`/collections/bespoke-kitchens/${b.slug}`} className="bs-related__card">
                  <div style={{ overflow: "hidden", borderRadius: "12px" }}>
                    <img src={b.thumbnail || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80"} alt={b.name} className="bs-related__card-img" />
                  </div>
                  <div>
                    <h3 className="bs-related__card-name">{b.name}</h3>
                    <p className="bs-related__card-tag">{b.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default BespokeSubcategoryDetail;
