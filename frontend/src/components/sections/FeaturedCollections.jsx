// src/components/sections/FeaturedCollections.jsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { RiArrowRightLine } from "react-icons/ri";
import SectionTitle from "../ui/SectionTitle";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80";
const DELAYS = ["sr-d1", "sr-d2", "sr-d3", "sr-d4", "sr-d5", "sr-d6", "sr-d7", "sr-d8", "sr-d9", "sr-d10"];

const STANDARD_ORDER = [
  "bespoke-kitchens",
  "dining-rooms",
  "living-room",
  "offices",
  "bookcases",
  "hinged-wardrobes",
  "sliding-wardrobes",
  "walk-in-closet",
  "storage-units",
  "interior-finishes"
];

const FALLBACK = [
  {
    _id: "1",
    title: "Bespoke Kitchens",
    slug: "bespoke-kitchens",
    thumbnail: "/bespoke-kitchen.jpg",
    shortDescription: "German precision meets award-winning design.",
    gallery: [
      "/bespoke-kitchen.jpg",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&q=80",
    ]
  },
  {
    _id: "2",
    title: "Living Rooms",
    slug: "living-room",
    thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    shortDescription: "Curated spaces for refined living.",
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    ]
  },
  {
    _id: "3",
    title: "Hinged Wardrobes",
    slug: "hinged-wardrobes",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    shortDescription: "Timeless storage, flawlessly executed.",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80",
      "https://images.unsplash.com/photo-1558997519-53bb890929a3?w=800&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    ]
  },
  {
    _id: "4",
    title: "Walk In Closet",
    slug: "walk-in-closet",
    thumbnail: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
    shortDescription: "Your personal dressing sanctuary.",
    gallery: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&q=80",
      "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&q=80",
    ]
  },
  {
    _id: "5",
    title: "Dining Rooms",
    slug: "dining-rooms",
    thumbnail: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    shortDescription: "Spaces crafted for memorable gatherings.",
    gallery: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
      "https://images.unsplash.com/photo-1534080391025-a77b31e22b46?w=800&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80",
    ]
  },
  {
    _id: "6",
    title: "Home Offices",
    slug: "offices",
    thumbnail: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    shortDescription: "Productivity wrapped in quiet luxury.",
    gallery: [
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80",
    ]
  },
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

const LightboxPortal = ({ images, initialIndex, onClose }) => {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, images]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent" onClick={e => e.stopPropagation()}>
        <span className="font-sans text-[0.65rem] tracking-[0.25em] uppercase text-white/50">
          Image {index + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-[#c4a064]/20 hover:text-[#c4a064] transition-all text-xl cursor-pointer"
        >
          &times;
        </button>
      </div>

      {/* Main image container */}
      <div className="relative flex items-center justify-center p-4 w-full max-w-[1200px]" onClick={e => e.stopPropagation()}>
        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-[#c4a064]/20 hover:text-[#c4a064] transition-all text-2xl z-10 cursor-pointer"
        >
          &#8249;
        </button>

        <img
          src={images[index]}
          alt={`Gallery zoom ${index + 1}`}
          className="max-w-[85vw] max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/5 transition-all duration-300"
        />

        <button
          onClick={handleNext}
          className="absolute right-4 md:right-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-[#c4a064]/20 hover:text-[#c4a064] transition-all text-2xl z-10 cursor-pointer"
        >
          &#8250;
        </button>
      </div>

      {/* Dot indicators */}
      {images.length <= 10 && (
        <div className="absolute bottom-6 flex gap-2" onClick={e => e.stopPropagation()}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="h-1.5 w-1.5 rounded-full transition-all duration-300"
              style={{
                background: i === index ? "#c4a064" : "rgba(255, 255, 255, 0.2)",
                transform: i === index ? "scale(1.4)" : "scale(1)",
              }}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  );
};

const CollectionCard = ({ item, index }) => {
  const [ref, inView] = useSR(0.1);
  const [hovered, setHovered] = useState(false);

  // Set up main image and state swaps
  const mainImage = item.thumbnail || FALLBACK_IMG;
  const [previewImage, setPreviewImage] = useState(mainImage);

  useEffect(() => {
    setPreviewImage(mainImage);
  }, [mainImage]);

  // Gallery array
  const gallery = item.gallery || [];

  // Lightbox trigger states
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const handleThumbnailClick = (e, imgIndex) => {
    e.preventDefault();
    e.stopPropagation();
    setLightboxIndex(imgIndex);
  };

  return (
    <>
      <div
        ref={ref}
        className={`group flex flex-col no-underline sr sr-up ${DELAYS[index] ?? ""} ${inView ? "sr-visible" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPreviewImage(mainImage); // reset to main image when mouse leaves card
        }}
        style={{
          background: "rgba(255,255,255,0.01)",
          border: "1px solid rgba(255,255,255,0.03)",
          borderRadius: "24px",
          padding: "1.5rem",
          transition: "background 0.4s, border-color 0.4s, transform 0.4s",
        }}
      >
        {/* Image — landscape with rounded corners */}
        <Link
          to={`/collections/${item.slug}`}
          className="relative overflow-hidden rounded-2xl block"
          style={{ aspectRatio: "16/9" }}
        >
          <img
            src={previewImage}
            alt={item.title}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
            className="h-full w-full object-cover transition-all duration-700"
            style={{
              filter: hovered ? "brightness(0.7) saturate(1.04)" : "brightness(0.85)",
              transform: hovered ? "scale(1.03)" : "scale(1.0)",
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
        </Link>

        {/* Body */}
        <Link to={`/collections/${item.slug}`} className="flex flex-col gap-1.5 pt-5 pb-2 no-underline">
          <h3
            className="font-serif font-medium transition-colors duration-300"
            style={{ fontSize: "1.4rem", color: hovered ? "#c4a064" : "#f0ece4", fontWeight: 400 }}
          >
            {item.title}
          </h3>
          {item.shortDescription && (
            <p
              className="font-sans font-normal leading-[1.65] line-clamp-2 transition-colors duration-300"
              style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}
            >
              {item.shortDescription}
            </p>
          )}
        </Link>

        {/* Sub-gallery photo thumbnails under card */}
        {gallery.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-white/[0.04]">
            <span className="text-[0.55rem] uppercase tracking-[0.2em] text-white/35 font-sans">
              Collection Gallery Preview
            </span>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {gallery.slice(0, 4).map((imgUrl, imgIdx) => {
                const isActive = previewImage === imgUrl;
                return (
                  <button
                    key={imgIdx}
                    onClick={(e) => handleThumbnailClick(e, imgIdx)}
                    onMouseEnter={() => setPreviewImage(imgUrl)}
                    className="relative aspect-[3/2] h-12 w-[4.5rem] flex-shrink-0 overflow-hidden rounded-lg bg-black/40 border transition-all duration-300 focus:outline-none cursor-zoom-in"
                    style={{
                      borderColor: isActive ? "#c4a064" : "rgba(255, 255, 255, 0.08)",
                      transform: isActive ? "scale(1.05) translateY(-2px)" : "scale(1)",
                      boxShadow: isActive ? "0 4px 12px rgba(196,160,100,0.2)" : "none",
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`${item.title} preview ${imgIdx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                    />
                    {/* Zoom icon hint on hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <span className="text-xs text-white/90">⊕</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <LightboxPortal
          images={gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};

const getGalleryForCollection = (c, isFallbackUsed) => {
  if (!c) return [];

  const rawGallery = [
    c.bannerImage,
    c.thumbnail,
    c.image,
    ...(c.gallery || []),
    ...(c.images || []),
  ].filter(Boolean);

  // Deduplicate by URL
  const uniqueImages = [...new Map(rawGallery.map((u) => [u, u])).values()];

  if (uniqueImages.length > 0) {
    return uniqueImages;
  }

  // ONLY use dummy fallback gallery if the database returned absolutely 0 collections (empty site state)
  if (isFallbackUsed) {
    const fb = FALLBACK.find(f => f.slug === c.slug);
    return fb ? fb.gallery : [];
  }

  return [c.thumbnail || c.bannerImage || c.image].filter(Boolean);
};

const FeaturedCollections = ({ collections }) => {
  const [secRef, secInView] = useSR(0.08);

  const isFallbackUsed = !collections || collections.length === 0;
  const rawData = !isFallbackUsed ? collections : FALLBACK;

  // Dynamically map active collection items and sort them by STANDARD_ORDER strictly
  const sortedData = [...rawData].sort((a, b) => {
    const indexA = STANDARD_ORDER.indexOf(a.slug);
    const indexB = STANDARD_ORDER.indexOf(b.slug);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const data = sortedData.map(c => {
    return {
      ...c,
      gallery: getGalleryForCollection(c, isFallbackUsed)
    };
  }).slice(0, 6);

  return (
    <section className="relative overflow-hidden pb-28" style={{ background: "#0a0a0a" }}>
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

        {/* Grid — 2 per row spacious layout */}
        <div
          className="mt-14 grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: "clamp(1.5rem,3.5vw,3rem)",
          }}
        >
          {data.map((item, i) => (
            <CollectionCard key={item._id} item={item} index={i} />
          ))}
        </div>

        {/* View all */}
        <div className="mt-20 flex justify-center">
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