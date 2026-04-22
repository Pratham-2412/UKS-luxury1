// src/components/sections/FeaturedProjects.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RiArrowRightLine, RiMapPinLine } from "react-icons/ri";
import SectionTitle from "../ui/SectionTitle";

const FALLBACK = [
  { _id: "1", title: "Knightsbridge Penthouse",  slug: "knightsbridge-penthouse",  thumbnail: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80", shortDescription: "A complete transformation of a luxury London penthouse.", category: "Kitchen & Wardrobes", year: "2024", location: "London" },
  { _id: "2", title: "Mayfair Private Residence", slug: "mayfair-private-residence", thumbnail: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&q=80", shortDescription: "Art deco inspired living and dining space.", category: "Living & Dining", year: "2024", location: "Mayfair" },
  { _id: "3", title: "Surrey Country Home",        slug: "surrey-country-home",       thumbnail: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=900&q=80", shortDescription: "Bespoke walk-in closets, grand kitchen and study.", category: "Full Interior", year: "2023", location: "Surrey" },
  { _id: "4", title: "Chelsea Studio Apartment",   slug: "chelsea-studio",            thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80", shortDescription: "Space-optimised storage for a refined urban studio.", category: "Wardrobes", year: "2023", location: "Chelsea" },
];
const FALLBACK_IMG = "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80";

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

const FeaturedProjects = ({ projects }) => {
  const data = projects?.length > 0 ? projects : FALLBACK;
  const [main, ...rest] = data;
  const [secRef, secInView] = useSR(0.07);
  const [mainHov, setMainHov] = useState(false);
  const [sideHov, setSideHov] = useState(null);

  return (
    <section className="relative overflow-hidden py-28" style={{ background: "#0d0d0d" }}>
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(196,160,100,0.015) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

      <div ref={secRef} className="relative mx-auto max-w-[1400px]" style={{ padding: "0 clamp(1.5rem,5vw,5rem)" }}>

        {/* Header */}
        <div className={`mb-16 flex flex-wrap items-end justify-between gap-6 sr sr-up ${secInView ? "sr-visible" : ""}`}>
          <SectionTitle
            eyebrow="Recent Projects"
            title="Stories of Transformation"
            subtitle="Each project is a testament to precision craftsmanship and thoughtful design."
          />
          <Link
            to="/projects"
            className="font-sans inline-flex items-center gap-2 border border-[rgba(196,160,100,0.28)] px-5 py-2.5 text-[0.6rem] font-light uppercase tracking-[0.22em] text-[#c4a064] transition-all duration-300 whitespace-nowrap hover:bg-[rgba(196,160,100,0.07)] hover:text-[#e8c87a]"
          >
            All Projects <RiArrowRightLine />
          </Link>
        </div>

        {/* ── Main featured — full-width cinematic ── */}
        {main && (
          <div className={`mb-5 sr sr-up sr-d1 ${secInView ? "sr-visible" : ""}`}>
            <Link
              to={`/projects/${main.slug}`}
              className="group relative block no-underline overflow-hidden rounded-2xl"
              onMouseEnter={() => setMainHov(true)}
              onMouseLeave={() => setMainHov(false)}
            >
              <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "21/9", minHeight: "340px" }}>
                <img
                  src={main.thumbnail || main.image || FALLBACK_IMG}
                  alt={main.title}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                  className="h-full w-full object-cover transition-all duration-700"
                  style={{
                    filter: mainHov ? "brightness(0.60)" : "brightness(0.75)",
                    transform: mainHov ? "scale(1.04)" : "scale(1.0)",
                    transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.32) 0%, transparent 55%)" }} />

                {/* Content pinned bottom-left */}
                <div className="absolute bottom-0 left-0 right-0 flex flex-col md:flex-row md:items-end md:justify-between gap-4 p-8 md:p-12">
                  <div className="flex flex-col gap-3 max-w-[560px]">
                    <div className="flex items-center gap-3 flex-wrap">
                      {main.category && (
                        <span className="font-sans text-[0.52rem] font-medium uppercase tracking-[0.2em] text-[#c4a064] border border-[rgba(196,160,100,0.35)] px-2.5 py-1 bg-black/30 backdrop-blur-sm">
                          {main.category}
                        </span>
                      )}
                      {main.year && (
                        <span className="font-sans text-[0.58rem] text-white/35">{main.year}</span>
                      )}
                    </div>
                    <h3 className="font-serif font-light text-white leading-[1.12]" style={{ fontSize: "clamp(1.6rem,3.5vw,2.6rem)" }}>
                      {main.title}
                    </h3>
                    <p className="font-sans font-light leading-[1.75] text-white/55 line-clamp-2" style={{ fontSize: "0.84rem" }}>
                      {main.shortDescription}
                    </p>
                    {main.location && (
                      <div className="font-sans flex items-center gap-1.5 text-[0.62rem] text-white/35">
                        <RiMapPinLine className="text-[#c4a064] flex-shrink-0" /> {main.location}
                      </div>
                    )}
                  </div>
                  {/* Arrow CTA */}
                  <div
                    className="flex items-center gap-3 transition-all duration-400"
                    style={{ opacity: mainHov ? 1 : 0, transform: mainHov ? "translateX(0)" : "translateX(-12px)" }}
                  >
                    <span className="font-sans text-[0.6rem] font-medium uppercase tracking-[0.22em] text-[#c4a064]">View Project</span>
                    <div className="flex h-10 w-10 items-center justify-center border border-[rgba(196,160,100,0.4)] text-[#c4a064]">
                      <RiArrowRightLine />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ── Side cards — 3 per row, landscape, rounded ── */}
        {rest.length > 0 && (
          <div
            className={`grid gap-5 sr sr-up sr-d2 ${secInView ? "sr-visible" : ""}`}
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            {rest.slice(0, 3).map((p, i) => (
              <Link
                key={p._id}
                to={`/projects/${p.slug}`}
                className="group flex flex-col no-underline"
                onMouseEnter={() => setSideHov(i)}
                onMouseLeave={() => setSideHov(null)}
              >
                {/* Image — landscape with rounded corners */}
                <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "16/9" }}>
                  <img
                    src={p.thumbnail || p.image || FALLBACK_IMG}
                    alt={p.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                    className="h-full w-full object-cover transition-all duration-700"
                    style={{
                      filter: sideHov === i ? "brightness(0.68)" : "brightness(0.84)",
                      transform: sideHov === i ? "scale(1.06)" : "scale(1.0)",
                      transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
                  {/* Gold line */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
                    style={{
                      width: sideHov === i ? "100%" : "0%",
                      background: "linear-gradient(to right, #c4a064, transparent)",
                      transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </div>

                {/* Body */}
                <div className="flex flex-col gap-2 pt-4">
                  <div className="flex items-center gap-2">
                    {p.category && (
                      <span className="font-sans text-[0.5rem] font-medium uppercase tracking-[0.2em] text-[#c4a064]">
                        {p.category}
                      </span>
                    )}
                    {p.year && (
                      <span className="font-sans text-[0.55rem] text-[#5a5550]">· {p.year}</span>
                    )}
                  </div>
                  <h4
                    className="font-serif font-normal leading-[1.25] transition-colors duration-300"
                    style={{ fontSize: "1.05rem", color: sideHov === i ? "#c4a064" : "#f0ece4" }}
                  >
                    {p.title}
                  </h4>
                  {p.location && (
                    <div className="font-sans flex items-center gap-1.5 text-[0.6rem] text-[#5a5550]">
                      <RiMapPinLine className="text-[#c4a064] flex-shrink-0" /> {p.location}
                    </div>
                  )}
                  <span
                    className="font-sans flex items-center gap-1.5 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-[#c4a064] mt-1 transition-all duration-300"
                    style={{ opacity: sideHov === i ? 1 : 0, transform: sideHov === i ? "translateX(0)" : "translateX(-6px)" }}
                  >
                    View Project <RiArrowRightLine />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedProjects;