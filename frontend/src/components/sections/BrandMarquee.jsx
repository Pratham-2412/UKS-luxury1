import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllBrands } from "../../api/brandApi";

const BrandMarquee = () => {
  const [brands, setBrands] = useState([]);
  const trackRef = useRef(null);

  useEffect(() => {
    getAllBrands()
      .then((res) => {
        const items = res.data.brands || res.data.data || [];
        setBrands(items.filter((b) => b.isActive !== false));
      })
      .catch(() => setBrands([]));
  }, []);

  if (brands.length === 0) return null;

  // Duplicate items so the marquee can loop seamlessly
  const loopItems = [...brands, ...brands];

  const renderBrandContent = (brand) => {
    const content = brand.logo ? (
      <img
        src={brand.logo}
        alt={brand.name}
        style={{
          height: "65px",
          maxWidth: "140px",
          objectFit: "contain",
        }}
      />
    ) : (
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.4rem",
          fontWeight: 500,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#e8d5a3",
          whiteSpace: "nowrap",
        }}
      >
        {brand.name}
      </span>
    );

    return content;
  };

  return (
    <>
      <style>{`
        @keyframes brandScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brand-track {
          animation: brandScroll 30s linear infinite;
        }
        .brand-track:hover {
          animation-play-state: paused;
        }
        .brand-item {
          opacity: 0.7;
          transition: opacity 0.4s ease, transform 0.4s ease;
          text-decoration: none;
        }
        .brand-item:hover {
          opacity: 1;
          transform: scale(1.08);
        }
      `}</style>

      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #060606 0%, #0d0d0d 50%, #060606 100%)",
          borderTop: "1px solid rgba(196,160,100,0.15)",
          borderBottom: "1px solid rgba(196,160,100,0.15)",
          padding: "2.2rem 0",
          marginBottom: "0",
        }}
      >
        {/* Edge fades */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10"
          style={{
            width: "120px",
            background: "linear-gradient(to right, #060606, transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10"
          style={{
            width: "120px",
            background: "linear-gradient(to left, #060606, transparent)",
          }}
        />

        {/* Marquee track */}
        <div
          ref={trackRef}
          className="brand-track flex items-center"
          style={{
            width: "max-content",
            gap: "4rem",
          }}
        >
          {loopItems.map((brand, i) => {
            const inner = (
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  minWidth: "160px",
                  height: "48px",
                }}
              >
                {renderBrandContent(brand)}
              </div>
            );

            // If brand has a link, wrap in router Link (for internal) or <a> (for external)
            if (brand.link) {
              const isExternal = brand.link.startsWith("http");
              if (isExternal) {
                return (
                  <a
                    key={`${brand._id}-${i}`}
                    href={brand.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brand-item"
                    style={{ cursor: "pointer" }}
                  >
                    {inner}
                  </a>
                );
              }
              return (
                <Link
                  key={`${brand._id}-${i}`}
                  to={brand.link}
                  className="brand-item"
                  style={{ cursor: "pointer" }}
                >
                  {inner}
                </Link>
              );
            }

            // No link — not clickable
            return (
              <div
                key={`${brand._id}-${i}`}
                className="brand-item"
                style={{ cursor: "default" }}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default BrandMarquee;
