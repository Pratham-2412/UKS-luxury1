// src/components/ui/Lightbox.jsx
import { useEffect, useCallback } from "react";
import { RiCloseLine, RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";

const Lightbox = ({ images, index, onClose, onPrev, onNext }) => {
  const handleKey = useCallback((e) => {
    if (e.key === "Escape")     onClose();
    if (e.key === "ArrowLeft")  onPrev();
    if (e.key === "ArrowRight") onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-[300] bg-[rgba(5,4,3,0.97)] flex items-center justify-center animate-fade-up"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-4 w-full max-w-5xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-0 right-4 text-[#a09880] hover:text-[#c4a064] text-2xl transition-colors cursor-pointer z-10"
        >
          <RiCloseLine />
        </button>

        {/* Prev */}
        <button
          onClick={onPrev}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/10 flex items-center justify-center text-[#a09880] hover:border-[#c4a064]/40 hover:text-[#c4a064] transition-all cursor-pointer z-10"
        >
          <RiArrowLeftLine />
        </button>

        {/* Image */}
        <div className="w-full flex items-center justify-center">
          <img
            key={index}
            src={images[index]}
            alt={`Gallery image ${index + 1}`}
            className="max-w-[88vw] max-h-[78vh] object-contain animate-fade-up"
          />
        </div>

        {/* Next */}
        <button
          onClick={onNext}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/10 flex items-center justify-center text-[#a09880] hover:border-[#c4a064]/40 hover:text-[#c4a064] transition-all cursor-pointer z-10"
        >
          <RiArrowRightLine />
        </button>

        {/* Counter */}
        <div className="text-[0.65rem] tracking-[0.2em] uppercase text-[#5a5550]">
          {index + 1} / {images.length}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap justify-center max-w-[80vw]">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => {
                  const diff = i - index;
                  if (diff > 0) for (let x = 0; x < diff; x++) onNext();
                  else          for (let x = 0; x < -diff; x++) onPrev();
                }}
                className={`w-12 h-12 overflow-hidden border-2 transition-all cursor-pointer ${
                  i === index ? "border-[#c4a064]" : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img src={src} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;