// src/components/shop/ProductGallery.jsx
import { useState } from "react";
import { RiCloseLine, RiZoomInLine } from "react-icons/ri";

const FALLBACK = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80";

const ProductGallery = ({ images = [], mainImage }) => {
  const allImages = mainImage
    ? [mainImage, ...images.filter((img) => img !== mainImage)]
    : images;

  const [active, setActive]     = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!allImages.length) {
    return (
      <div className="border border-white/7 aspect-[4/3] overflow-hidden">
        <img src={FALLBACK} alt="Product" className="w-full h-full object-cover brightness-85" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div
          onClick={() => setLightbox(true)}
          className="relative group aspect-[4/3] border border-white/7 overflow-hidden cursor-zoom-in"
        >
          <img
            src={allImages[active] || FALLBACK}
            alt="Product"
            onError={(e) => (e.currentTarget.src = FALLBACK)}
            className="w-full h-full object-cover brightness-90 transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-white/30 bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <RiZoomInLine className="text-base" />
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex-shrink-0 w-[72px] h-[54px] border overflow-hidden transition-all duration-200 cursor-pointer ${
                  active === i
                    ? "border-[#c4a064]"
                    : "border-white/10 hover:border-white/30 opacity-55 hover:opacity-85"
                }`}
              >
                <img
                  src={img || FALLBACK}
                  alt={`View ${i + 1}`}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = FALLBACK)}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox — uses normal flow wrapper to avoid fixed positioning collapse */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-5 right-5 w-10 h-10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all duration-200 cursor-pointer"
          >
            <RiCloseLine className="text-xl" />
          </button>
          <img
            src={allImages[active] || FALLBACK}
            alt="Product enlarged"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[85vh] object-contain border border-white/10"
          />
        </div>
      )}
    </>
  );
};

export default ProductGallery;