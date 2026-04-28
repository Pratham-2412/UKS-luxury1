// src/components/sections/WhyUs.jsx
import { useEffect, useRef, useState } from "react";
import SectionTitle from "../ui/SectionTitle";
import { RiAwardLine, RiRulerLine, RiLeafLine, RiCustomerService2Line, RiGlobalLine, RiShieldCheckLine } from "react-icons/ri";

const PILLARS = [
  { icon: <RiAwardLine />,             title: "Award-Winning Design",    desc: "Recognised across Europe for excellence in interior design and craftsmanship." },
  { icon: <RiRulerLine />,             title: "100% Bespoke",            desc: "Every piece is custom-made to your exact specifications. Nothing is off-the-shelf." },
  { icon: <RiLeafLine />,              title: "Sustainable Materials",   desc: "We source responsibly, using premium materials that respect the environment." },
  { icon: <RiCustomerService2Line />,  title: "Dedicated Aftercare",     desc: "Our relationship doesn't end at installation. Lifetime support for every client." },
  { icon: <RiGlobalLine />,            title: "European Craftsmanship",  desc: "Partnered with the finest German and Italian manufacturers for unmatched quality." },
  { icon: <RiShieldCheckLine />,       title: "10-Year Guarantee",       desc: "Every project is backed by our comprehensive decade-long quality guarantee." },
];

const DELAYS = ["","sr-d1","sr-d2","sr-d3","sr-d4","sr-d5"];

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

const PillarCard = ({ pillar, index, allInView }) => {
  const [hov, setHov] = useState(false);

  return (
    <div
      className={`group relative flex flex-col gap-5 rounded-2xl transition-all duration-400 sr sr-up ${DELAYS[index] ?? ""} ${allInView ? "sr-visible" : ""}`}
      style={{
        padding: "clamp(1.75rem,3vw,2.5rem)",
        background: hov ? "rgba(196,160,100,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov ? "rgba(196,160,100,0.25)" : "rgba(255,255,255,0.06)"}`,
        transition: "background 0.4s, border-color 0.4s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Top gold accent line */}
      <div
        className="absolute left-0 top-0 h-[2px] rounded-t-2xl origin-left transition-transform duration-500"
        style={{
          right: 0,
          background: "linear-gradient(90deg,#c4a064,transparent)",
          transform: hov ? "scaleX(1)" : "scaleX(0)",
          transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      {/* Icon */}
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center text-[1.35rem] text-[#c4a064] rounded-xl transition-all duration-400"
        style={{
          border: `1px solid ${hov ? "rgba(196,160,100,0.5)" : "rgba(196,160,100,0.2)"}`,
          background: hov ? "rgba(196,160,100,0.08)" : "rgba(196,160,100,0.03)",
        }}
      >
        {pillar.icon}
      </div>

      {/* Title */}
      <h4
        className="font-serif font-normal transition-colors duration-300"
        style={{ fontSize: "1.2rem", color: hov ? "#f5efe5" : "#f0ece4", lineHeight: 1.3 }}
      >
        {pillar.title}
      </h4>

      {/* Desc */}
      <p
        className="font-sans font-light leading-[1.8] transition-colors duration-300"
        style={{ fontSize: "0.9rem", color: hov ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.42)" }}
      >
        {pillar.desc}
      </p>

      {/* Ghost index */}
      <span
        className="font-serif pointer-events-none absolute bottom-4 right-5 select-none leading-none transition-colors duration-400"
        style={{ fontSize: "3rem", fontWeight: 300, color: hov ? "rgba(196,160,100,0.07)" : "rgba(255,255,255,0.03)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
};

const WhyUs = () => {
  const [secRef, secInView]   = useSR(0.08);
  const [gridRef, gridInView] = useSR(0.08);

  return (
    <section className="relative overflow-hidden py-28" style={{ background: "#0a0a0a" }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(196,160,100,0.04), transparent 65%)" }} />
      <div className="absolute top-0 left-[5%] right-[5%] h-px" style={{ background: "linear-gradient(to right,transparent,rgba(255,255,255,0.05) 20%,rgba(255,255,255,0.05) 80%,transparent)" }} />

      <div ref={secRef} className="relative mx-auto max-w-[1400px]" style={{ padding: "0 clamp(1.5rem,5vw,5rem)" }}>

        {/* Header */}
        <div className={`text-center sr sr-up ${secInView ? "sr-visible" : ""}`} style={{ marginBottom: "4.5rem" }}>
          <SectionTitle
            eyebrow="Why UKS Interiors"
            title="Excellence Is Our Standard"
            subtitle="From the first consultation to the final reveal, we uphold an unwavering commitment to quality."
            align="center"
          />
        </div>

        {/* Grid — spaced rounded cards */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(1rem,2vw,1.5rem)",
          }}
        >
          {PILLARS.map((p, i) => (
            <PillarCard key={p.title} pillar={p} index={i} allInView={gridInView} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyUs;