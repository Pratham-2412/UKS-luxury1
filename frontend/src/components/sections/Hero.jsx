import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { RiArrowDownLine, RiPlayCircleLine } from "react-icons/ri";
import { getHeros } from "../../api/adminApi";

const DEFAULT_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
    eyebrow: "Bespoke Kitchens",
    heading: ["Where Precision", "Meets Elegance"],
    sub: "Award-winning European kitchen design, crafted exclusively for discerning homes.",
  },
  {
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1920&q=80",
    eyebrow: "Luxury Wardrobes",
    heading: ["Storage Refined", "To Perfection"],
    sub: "Bespoke wardrobe solutions that blend seamless function with timeless luxury.",
  },
];

const Hero = () => {
  const [slides, setSlides]       = useState([]);
  const [current, setCurrent]     = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const intervalRef               = useRef(null);

  useEffect(() => {
    getHeros()
      .then((res) => {
        const items = res.data.data || res.data.heroSections || [];
        if (items.length > 0) {
          const mapped = items.map(item => ({
            image: item.image,
            eyebrow: item.eyebrow,
            heading: item.heading.includes("|") ? item.heading.split("|") : [item.heading, ""],
            sub: item.subheading,
            ctaLabel: item.ctaLabel,
            ctaLink: item.ctaLink
          }));
          setSlides(mapped);
        } else {
          setSlides(DEFAULT_SLIDES);
        }
      })
      .catch(() => setSlides(DEFAULT_SLIDES))
      .finally(() => setLoading(false));
  }, []);

  const goTo = useCallback((index) => {
    if (animating || index === current || slides.length === 0) return;
    setAnimating(true);
    setVisible(false);
    setTimeout(() => { setCurrent(index); setAnimating(false); }, 800);
  }, [animating, current, slides.length]);

  const next = useCallback(() => {
    if (slides.length > 0) {
      goTo((current + 1) % slides.length);
    }
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length > 1) {
      intervalRef.current = setInterval(next, 6000);
      return () => clearInterval(intervalRef.current);
    }
  }, [next, slides.length]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(t);
  }, [current]);

  if (loading || slides.length === 0) return (
    <section className="relative h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-12 h-[1px] bg-[#c4a064] animate-pulse" />
    </section>
  );

  const slide = slides[current];

  return (
    <>
      <style>{`
        @keyframes grain {
          0%,100%{ transform:translate(0,0) }
          10%{ transform:translate(-2%,-3%) }
          20%{ transform:translate(-4%,2%) }
          30%{ transform:translate(3%,-4%) }
          40%{ transform:translate(2%,3%) }
          50%{ transform:translate(-3%,2%) }
          60%{ transform:translate(4%,-2%) }
          70%{ transform:translate(-2%,4%) }
          80%{ transform:translate(3%,2%) }
          90%{ transform:translate(-4%,-2%) }
        }
        @keyframes heroImgIn {
          from { transform:scale(1.07); }
          to   { transform:scale(1.02); }
        }
        @keyframes heroTextUp {
          from { opacity:0; transform:translateY(26px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scrollBounce {
          0%,100%{ transform:translateY(0); opacity:1; }
          50%{ transform:translateY(6px); opacity:0.4; }
        }
        @keyframes progressRun {
          from{ width:0% }
          to{ width:100% }
        }
        .hero-grain { animation: grain 8s steps(10) infinite; }
        .hero-img-active { animation: heroImgIn 8s cubic-bezier(0.16,1,0.3,1) forwards; }
        .hero-line-1 { animation: heroTextUp 0.75s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .hero-line-2 { animation: heroTextUp 0.75s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .hero-line-3 { animation: heroTextUp 0.75s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .hero-line-4 { animation: heroTextUp 0.75s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
        .hero-line-5 { animation: heroTextUp 0.75s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
        .scroll-bounce { animation: scrollBounce 2s ease-in-out infinite; }
        .progress-run  { animation: progressRun 6s linear forwards; }
        .hero-btn-gold:hover {
          opacity: 0.85;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(196,160,100,0.22);
        }
        .hero-btn-outline:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.32);
          color: #fff;
        }
        @media(max-width:768px){
          .hero-stats-grid{ grid-template-columns:repeat(2,1fr) !important; }
          .hero-deco{ display:none !important; }
          .hero-counter{ display:none !important; }
          .hero-scroll{ display:none !important; }
          .hero-slide-controls{ display:none !important; }
        }
        @media(max-width:480px){
          .hero-actions{ flex-direction:column !important; align-items:flex-start !important; }
        }
      `}</style>

      <section
        className="relative flex flex-col overflow-hidden bg-[#0a0a0a]"
        style={{ height: "100vh", minHeight: "640px" }}
      >

        {/* Grain overlay */}
        <div
          className="hero-grain pointer-events-none absolute z-10"
          style={{
            inset: "-50%", width: "200%", height: "200%",
            opacity: 0.032,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Top gold accent line */}
        <div className="absolute top-0 left-0 right-0 z-10 h-[2px]" style={{ background: "linear-gradient(to right, transparent, rgba(196,160,100,0.5) 30%, rgba(196,160,100,0.5) 70%, transparent)" }} />

        {/* Slide backgrounds */}
        <div className="absolute inset-0">
          {slides.map((s, i) => (
            <div
              key={i}
              className={i === current ? "hero-img-active" : ""}
              style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${s.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: i === current ? 1 : 0,
                transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1)",
                willChange: "opacity, transform",
              }}
            />
          ))}
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.50)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.08) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)" }} />
        </div>

        {/* Deco vertical lines */}
        <div className="hero-deco absolute top-0 z-[1]" style={{ left: "clamp(3rem,8vw,8rem)", height: "100%", width: "1px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.055) 20%, rgba(255,255,255,0.055) 80%, transparent)" }} />
        <div className="hero-deco absolute top-0 z-[1]" style={{ right: "clamp(3rem,8vw,8rem)", height: "100%", width: "1px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.055) 20%, rgba(255,255,255,0.055) 80%, transparent)" }} />

        {/* ── Main content — pushed down by navbar height ── */}
        <div className="relative z-[2] flex flex-1 items-center" style={{ paddingTop: "80px" }}>
          <div className="mx-auto w-full max-w-[1400px]" style={{ padding: "0 clamp(1.5rem,5vw,5rem)" }}>

            {visible && (
              <div className="max-w-[660px]" key={current}>

                {/* Eyebrow */}
                <div className="hero-line-1 mb-6 flex items-center gap-3">
                  <span className="eyebrow-line" />
                  <span className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.32em] text-[#c4a064]">
                    {slide.eyebrow}
                  </span>
                </div>

                {/* H1 line 1 */}
                <div className="hero-line-2 overflow-hidden">
                  <h1 className="font-serif font-light leading-[1.0] text-white" style={{ fontSize: "clamp(3.2rem,7.5vw,6.5rem)" }}>
                    {slide.heading[0]}
                  </h1>
                </div>

                {/* H1 line 2 */}
                {slide.heading[1] && (
                  <div className="hero-line-3 mb-7 overflow-hidden">
                    <h1 className="font-serif font-light italic leading-[1.05]" style={{ fontSize: "clamp(3.2rem,7.5vw,6.5rem)", color: "#e8d5a3" }}>
                      {slide.heading[1]}
                    </h1>
                  </div>
                )}

                {/* Subtext */}
                <p className="hero-line-4 font-sans mb-10 max-w-[460px] font-light leading-[1.9] text-white/55" style={{ fontSize: "clamp(0.85rem,1.4vw,0.95rem)", letterSpacing: "0.02em" }}>
                  {slide.sub}
                </p>

                {/* CTA buttons */}
                <div className="hero-line-5 hero-actions flex flex-wrap items-center gap-3">
                  <Link
                    to={slide.ctaLink || "/collections"}
                    className="hero-btn-gold font-sans inline-flex items-center gap-2 rounded-[2px] text-[0.65rem] font-medium uppercase tracking-[0.2em] transition-all duration-300"
                    style={{ padding: "0.9rem 2.25rem", background: "linear-gradient(135deg,#c4a064,#a07840)", color: "#0a0a0a" }}
                  >
                    {slide.ctaLabel || "Explore Collections"}
                  </Link>
                  <Link
                    to="/projects"
                    className="hero-btn-outline font-sans inline-flex items-center gap-2 rounded-[2px] border border-white/20 text-[0.65rem] font-light uppercase tracking-[0.2em] text-white/75 transition-all duration-300"
                    style={{ padding: "0.9rem 1.75rem", backdropFilter: "blur(4px)" }}
                  >
                    <RiPlayCircleLine className="text-[1.1rem]" />
                    View Projects
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom controls row — counter + dots together, no overlap ── */}
        <div className="relative z-[2] flex items-end justify-between pb-6" style={{ padding: "0 clamp(1.5rem,5vw,5rem) 1.5rem" }}>

          {/* Scroll indicator — left */}
          <div className="hero-scroll flex flex-col items-center gap-2">
            <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom,rgba(255,255,255,0.15),rgba(196,160,100,0.5))" }} />
            <div className="scroll-bounce">
              <RiArrowDownLine className="text-[0.9rem] text-[#c4a064]" />
            </div>
          </div>

          {/* Slide counter + dots — center-right, all in one row ── */}
          <div className="hero-slide-controls flex items-center gap-5">
            {/* Counter */}
            <div className="flex items-center gap-3">
              <span className="font-serif font-light leading-none text-[#c4a064]" style={{ fontSize: "1.5rem" }}>
                {String(current + 1).padStart(2, "0")}
              </span>
              <div className="relative overflow-hidden" style={{ width: "56px", height: "1px", background: "rgba(255,255,255,0.12)" }}>
                <span key={current} className="progress-run absolute left-0 top-0 h-full" style={{ background: "linear-gradient(to right,#c4a064,#e8c87a)" }} />
              </div>
              <span className="font-sans text-[0.62rem] text-white/25">
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            {/* Dot navigation */}
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: i === current ? "24px" : "6px",
                    height: "6px",
                    background: i === current ? "#c4a064" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        

      </section>
    </>
  );
};

export default Hero;