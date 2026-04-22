// src/components/sections/FeaturedCollections.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RiArrowRightLine } from "react-icons/ri";
import SectionTitle from "../ui/SectionTitle";

const FALLBACK = [
  { _id: "1", title: "Bespoke Kitchens",  slug: "bespoke-kitchens",  thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", shortDescription: "German precision meets award-winning design." },
  { _id: "2", title: "Living Rooms",      slug: "living-room",       thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80", shortDescription: "Curated spaces for refined living." },
  { _id: "3", title: "Hinged Wardrobes",  slug: "hinged-wardrobes",  thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", shortDescription: "Timeless storage, flawlessly executed." },
  { _id: "4", title: "Walk In Closet",    slug: "walk-in-closet",    thumbnail: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80", shortDescription: "Your personal dressing sanctuary." },
  { _id: "5", title: "Dining Rooms",      slug: "dining-rooms",      thumbnail: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80", shortDescription: "Spaces crafted for memorable gatherings." },
  { _id: "6", title: "Home Offices",      slug: "offices",           thumbnail: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", shortDescription: "Productivity wrapped in quiet luxury." },
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80";
const DELAYS = ["sr-d1","sr-d2","sr-d3","sr-d4","sr-d5","sr-d5"];

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

const CollectionCard = ({ item, index }) => {
  const [ref, inView] = useSR(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      ref={ref}
      to={`/collections/${item.slug}`}
      className={`group flex flex-col no-underline sr sr-up ${DELAYS[index] ?? ""} ${inView ? "sr-visible" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image — landscape with rounded corners */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={item.thumbnail || FALLBACK_IMG}
          alt={item.title}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
          className="h-full w-full object-cover transition-all duration-700"
          style={{
            filter: hovered ? "brightness(0.65) saturate(1.08)" : "brightness(0.88)",
            transform: hovered ? "scale(1.06)" : "scale(1.0)",
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          }}
        />
        <div className="img-overlay" />

        {/* Index number */}
        <span
          className="font-serif absolute right-4 top-4 text-[0.7rem] tracking-[0.1em] text-white/25 transition-opacity duration-300"
          style={{ opacity: hovered ? 0 : 1 }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Hover CTA overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center gap-2 p-5 transition-all duration-400"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(10px)" }}
        >
          <span className="font-sans text-[0.58rem] font-medium uppercase tracking-[0.22em] text-[#c4a064]">
            Explore Collection
          </span>
          <RiArrowRightLine className="text-[0.85rem] text-[#c4a064]" />
        </div>

        {/* Gold bottom line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
          style={{
            width: hovered ? "100%" : "0%",
            background: "linear-gradient(to right, #c4a064, transparent)",
            transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5 pt-4">
        <h3
          className="font-serif font-normal transition-colors duration-300"
          style={{ fontSize: "1.05rem", color: hovered ? "#c4a064" : "#f0ece4" }}
        >
          {item.title}
        </h3>
        {item.shortDescription && (
          <p
            className="font-sans font-light leading-[1.65] line-clamp-2 transition-colors duration-300"
            style={{ fontSize: "0.78rem", color: "#5a5550" }}
          >
            {item.shortDescription}
          </p>
        )}
        <span
          className="font-sans flex items-center gap-1.5 text-[0.58rem] font-medium uppercase tracking-[0.22em] text-[#c4a064] mt-1 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateX(0)" : "translateX(-6px)" }}
        >
          Explore <RiArrowRightLine />
        </span>
      </div>
    </Link>
  );
};

const FeaturedCollections = ({ collections }) => {
  const [secRef, secInView] = useSR(0.08);
  const data = collections?.length > 0 ? collections : FALLBACK;

  return (
    <section className="relative overflow-hidden py-28" style={{ background: "#0a0a0a" }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(196,160,100,0.03), transparent 70%)" }} />

      <div ref={secRef} className="relative mx-auto max-w-[1400px]" style={{ padding: "0 clamp(1.5rem,5vw,5rem)" }}>

        {/* Header */}
        <div className={`sr sr-up ${secInView ? "sr-visible" : ""}`}>
          <SectionTitle
            eyebrow="Our Collections"
            title="Crafted for Every Space"
            subtitle="Explore our range of bespoke interior collections, each designed with European precision and tailored to your vision."
          />
        </div>

        {/* Grid — 3 per row landscape cards */}
        <div
          className="mt-14"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(1rem,2vw,1.75rem)",
          }}
        >
          {data.map((item, i) => (
            <CollectionCard key={item._id} item={item} index={i} />
          ))}
        </div>

        {/* View all */}
        <div className="mt-14 flex justify-center">
          <Link
            to="/collections"
            className="font-sans inline-flex items-center gap-2 border border-white/[0.08] px-9 py-3.5 text-[0.65rem] font-light uppercase tracking-[0.2em] text-[#a09880] transition-all duration-300 hover:text-[#c4a064] hover:border-[rgba(196,160,100,0.3)] hover:bg-[rgba(196,160,100,0.04)]"
          >
            View All Collections <RiArrowRightLine />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;