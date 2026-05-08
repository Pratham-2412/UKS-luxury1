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
    <section className="relative overflow-hidden luxury-gradient gold-border-y py-9 mb-0">
      {/* Edge fades */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-[120px]"
        style={{ background: "linear-gradient(to right, #060606, transparent)" }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-[120px]"
        style={{ background: "linear-gradient(to left, #060606, transparent)" }}
      />

      {/* Marquee track */}
      <div
        ref={trackRef}
        className="animate-marquee flex items-center hover:[animation-play-state:paused] w-max gap-16"
      >
        {loopItems.map((brand, i) => {
          const inner = (
            <div className="flex-shrink-0 flex items-center justify-center min-w-[160px] h-12">
              {renderBrandContent(brand)}
            </div>
          );

          if (brand.link) {
            const isExternal = brand.link.startsWith("http");
            const LinkComponent = isExternal ? "a" : Link;
            const linkProps = isExternal
              ? { href: brand.link, target: "_blank", rel: "noopener noreferrer" }
              : { to: brand.link };

            return (
              <LinkComponent
                key={`${brand._id}-${i}`}
                {...linkProps}
                className="brand-logo-glow opacity-70 cursor-pointer no-underline"
              >
                {inner}
              </LinkComponent>
            );
          }

          return (
            <div
              key={`${brand._id}-${i}`}
              className="brand-logo-glow opacity-70 cursor-default"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BrandMarquee;
