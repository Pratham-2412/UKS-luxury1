// src/components/ui/SectionTitle.jsx
const SectionTitle = ({ eyebrow, title, subtitle, align = "left", light = false }) => {
  const isCenter = align === "center";

  return (
    <div
      className={`flex flex-col gap-3 ${isCenter ? "items-center text-center" : "items-start text-left"}`}
      style={{ maxWidth: isCenter ? "600px" : "560px", margin: isCenter ? "0 auto" : "0" }}
    >
      {eyebrow && (
        <span className="flex items-center gap-2.5 font-sans font-medium uppercase text-[#c4a064]"
          style={{ fontSize: "0.62rem", letterSpacing: "0.28em" }}
        >
          <span className="block w-6 h-px bg-[#c4a064] flex-shrink-0" />
          {eyebrow}
        </span>
      )}

      {title && (
        <h2
          className="font-serif font-light leading-[1.15]"
          style={{
            fontSize: "clamp(2rem,4vw,3rem)",
            color: light ? "#ffffff" : "#f0ece4",
          }}
        >
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          className="font-sans font-light leading-[1.8]"
          style={{
            fontSize: "0.95rem",
            maxWidth: isCenter ? "540px" : "500px",
            color: light ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.50)",
            letterSpacing: "0.015em",
            textAlign: isCenter ? "center" : "left",
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Gold underline */}
      <span
        className="block mt-1"
        style={{
          height: "1px",
          width: "48px",
          background: "linear-gradient(to right, #c4a064, transparent)",
          marginLeft: isCenter ? "auto" : 0,
          marginRight: isCenter ? "auto" : 0,
        }}
      />
    </div>
  );
};

export default SectionTitle;