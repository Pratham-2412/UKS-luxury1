// src/components/sections/OffersBanner.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RiArrowRightLine, RiTimeLine } from "react-icons/ri";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80";

const useSR = (threshold = 0.1) => {
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

const OffersBanner = ({ offers }) => {
  const activeOffer = offers?.find((o) => o.isActive) || offers?.[0];
  const [secRef, secInView] = useSR(0.1);
  const [imgHov, setImgHov]   = useState(false);
  const [primHov, setPrimHov] = useState(false);
  const [secHov, setSecHov]   = useState(false);

  return (
    <section className="relative overflow-hidden py-28" style={{ background: "#0d0d0d" }}>
      {/* Ruled texture */}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.012) 40px)" }} />

      <div ref={secRef} className="relative mx-auto max-w-[1400px]" style={{ padding: "0 clamp(1.5rem,5vw,5rem)" }}>

        {/* ── Asymmetric layout: large image left, content right ── */}
        <div
          className={`flex flex-col lg:flex-row items-stretch gap-0 sr sr-up ${secInView ? "sr-visible" : ""}`}
          style={{ minHeight: "520px" }}
        >

          {/* Image — 55% width, full bleed */}
          <div
            className="relative overflow-hidden flex-shrink-0"
            style={{ width: "100%", flex: "0 0 55%" }}
            onMouseEnter={() => setImgHov(true)}
            onMouseLeave={() => setImgHov(false)}
          >
            <img
              src={activeOffer?.image || activeOffer?.thumbnail || FALLBACK_IMG}
              alt="Current Offer"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
              className="h-full w-full object-cover transition-all duration-700"
              style={{
                filter: imgHov ? "brightness(0.68) saturate(1.08)" : "brightness(0.82)",
                transform: imgHov ? "scale(1.04)" : "scale(1.0)",
                transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                minHeight: "380px",
              }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(0,0,0,0.10),transparent 55%,rgba(0,0,0,0.22))" }} />

            {/* Offer badge */}
            {activeOffer && (
              <div
                className={`absolute left-7 top-7 transition-all duration-700 ${secInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
                style={{ transitionDelay: "0.4s" }}
              >
                <span
                  className="font-sans inline-block px-5 py-2 text-[0.55rem] font-medium uppercase tracking-[0.22em] text-[#0a0a0a]"
                  style={{ background: "linear-gradient(135deg,#c4a064,#a07840)" }}
                >
                  {activeOffer.discountText || "Limited Offer"}
                </span>
              </div>
            )}

            {/* Bottom caption */}
            <div
              className={`font-sans absolute bottom-7 left-7 text-[0.55rem] uppercase tracking-[0.25em] text-white/30 transition-all duration-700 ${secInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              style={{ transitionDelay: "0.5s" }}
            >
              Exclusive Design Service
            </div>
          </div>

          {/* Content — open, generous padding, no border */}
          <div
            className={`flex flex-col justify-center gap-7 bg-[#0a0a0a] sr sr-left sr-d1 ${secInView ? "sr-visible" : ""}`}
            style={{ padding: "clamp(2.5rem,5vw,5rem)", flex: 1 }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="eyebrow-line" />
              <span className="font-sans text-[0.58rem] font-medium uppercase tracking-[0.3em] text-[#c4a064]">
                Exclusive Offer
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-serif font-light leading-[1.12] text-[#f0ece4]" style={{ fontSize: "clamp(1.9rem,3.5vw,3rem)" }}>
              {activeOffer?.title || (
                <>Transform Your Home<br /><em className="italic text-[#c4a064]">This Season</em></>
              )}
            </h2>

            {/* Description */}
            <p className="font-sans max-w-[480px] font-light leading-[1.85] text-[#a09880]" style={{ fontSize: "0.875rem" }}>
              {activeOffer?.description || "Book a free consultation this month and receive a complimentary 3D design render of your chosen space — worth £500. Limited appointments available."}
            </p>

            {/* End date */}
            {activeOffer?.endDate && (
              <div className="font-sans inline-flex w-fit items-center gap-2.5 border border-white/[0.07] bg-[#111111] px-4 py-3 text-[0.75rem] text-[#5a5550]">
                <RiTimeLine className="shrink-0 text-[#c4a064]" />
                Offer ends: {new Date(activeOffer.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            )}

            {/* Thin divider */}
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, rgba(196,160,100,0.4), transparent)" }} />

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                onMouseEnter={() => setPrimHov(true)}
                onMouseLeave={() => setPrimHov(false)}
                className="font-sans inline-flex items-center gap-2 px-8 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#0a0a0a] no-underline transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg,#c4a064,#a07840)",
                  opacity: primHov ? 0.86 : 1,
                  transform: primHov ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: primHov ? "0 8px 28px rgba(196,160,100,0.22)" : "none",
                }}
              >
                Claim This Offer <RiArrowRightLine />
              </Link>
              <Link
                to="/offers"
                onMouseEnter={() => setSecHov(true)}
                onMouseLeave={() => setSecHov(false)}
                className="font-sans inline-flex items-center gap-2 px-5 py-3.5 text-[0.65rem] font-light uppercase tracking-[0.2em] no-underline transition-all duration-300"
                style={{
                  border: `1px solid ${secHov ? "rgba(196,160,100,0.3)" : "rgba(255,255,255,0.08)"}`,
                  color: secHov ? "#c4a064" : "#a09880",
                  background: secHov ? "rgba(196,160,100,0.05)" : "transparent",
                }}
              >
                View All Offers
              </Link>
            </div>

            {/* Trust signal */}
            <div className="font-sans flex items-center gap-2.5 text-[0.68rem] font-light text-[#5a5550]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#c4a064]" style={{ boxShadow: "0 0 8px rgba(196,160,100,0.5)" }} />
              No obligation. Free design consultation included.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OffersBanner;