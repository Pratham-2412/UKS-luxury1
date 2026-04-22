// src/components/sections/Testimonials.jsx
import { useEffect, useRef, useState } from "react";
import { RiDoubleQuotesL, RiStarFill } from "react-icons/ri";
import SectionTitle from "../ui/SectionTitle";

const FALLBACK = [
  { _id: "1", name: "James Whitmore",          role: "Knightsbridge, London", rating: 5, message: "UKS Interiors transformed our home beyond imagination. The attention to detail in every single piece is extraordinary. The kitchen alone has become the most talked-about feature of every dinner party." },
  { _id: "2", name: "Sophia Castellano",        role: "Mayfair, London",       rating: 5, message: "From the first consultation to the final reveal, the team was flawless. Our walk-in wardrobe is better than anything I have seen in a five-star hotel. Truly world-class craftsmanship." },
  { _id: "3", name: "Robert & Claire Andrews",  role: "Surrey",                rating: 5, message: "We worked with UKS on our entire country home renovation. The results are breathtaking. The quality of the European materials and the precision of installation is simply unmatched." },
  { _id: "4", name: "Priya Nair",               role: "Chelsea, London",       rating: 5, message: "I was sceptical at first about bespoke furniture, but UKS showed us what is truly possible. Every piece fits perfectly and the quality will last generations. Worth every penny." },
];

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

const TestimonialCard = ({ t, index, inView }) => (
  <div
    className={`relative flex flex-col gap-6 rounded-2xl sr sr-up ${index === 0 ? "" : index === 1 ? "sr-d1" : index === 2 ? "sr-d2" : "sr-d3"} ${inView ? "sr-visible" : ""}`}
    style={{
      padding: "clamp(1.75rem,3vw,2.5rem)",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    {/* Gold top accent */}
    <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: "linear-gradient(to right, #c4a064, transparent)" }} />

    {/* Quote icon */}
    <RiDoubleQuotesL className="text-[1.8rem] text-[rgba(196,160,100,0.25)]" />

    {/* Stars */}
    <div className="flex items-center gap-1">
      {Array.from({ length: t.rating || 5 }).map((_, i) => (
        <RiStarFill key={i} className="text-[0.75rem] text-[#c4a064]" />
      ))}
    </div>

    {/* Quote */}
    <blockquote
      className="font-serif font-light italic leading-[1.9] text-white/80 flex-1"
      style={{ fontSize: "clamp(0.95rem,1.5vw,1.08rem)" }}
    >
      "{t.message}"
    </blockquote>

    {/* Author */}
    <div className="flex items-center gap-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        className="font-serif flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[1.1rem] text-[#c4a064]"
        style={{ background: "rgba(196,160,100,0.08)", border: "1px solid rgba(196,160,100,0.25)" }}
      >
        {t.name?.charAt(0)}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-sans text-[0.875rem] font-normal text-[#f0ece4]">{t.name}</p>
        <p className="font-sans text-[0.7rem] font-light tracking-[0.06em] text-[#5a5550]">{t.role || t.location}</p>
      </div>
    </div>
  </div>
);

const Testimonials = ({ testimonials }) => {
  const data = testimonials?.length > 0 ? testimonials : FALLBACK;
  const [secRef, secInView] = useSR(0.1);
  const [gridRef, gridInView] = useSR(0.08);

  return (
    <section className="relative overflow-hidden py-28" style={{ background: "#0a0a0a" }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(196,160,100,0.04), transparent 70%)" }} />

      {/* Large decorative quote */}
      <div
        className="font-serif pointer-events-none absolute top-[6%] left-1/2 -translate-x-1/2 select-none leading-none"
        style={{ fontSize: "clamp(12rem,20vw,22rem)", fontWeight: 300, color: "rgba(196,160,100,0.022)", zIndex: 0 }}
      >
        "
      </div>

      <div ref={secRef} className="relative z-[1] mx-auto max-w-[1400px]" style={{ padding: "0 clamp(1.5rem,5vw,5rem)" }}>

        {/* Header */}
        <div className={`mb-16 text-center sr sr-up ${secInView ? "sr-visible" : ""}`}>
          <SectionTitle eyebrow="Client Stories" title="Words From Our Clients" align="center" />
        </div>

        {/* Grid — 2 per row */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "clamp(1rem,2vw,1.5rem)",
          }}
        >
          {data.map((t, i) => (
            <TestimonialCard key={t._id} t={t} index={i} inView={gridInView} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;