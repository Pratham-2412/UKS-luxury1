// src/components/ui/PageHero.jsx
const PageHero = ({ eyebrow, title, subtitle, image }) => (
  <section className="relative h-[52vh] min-h-[320px] flex items-end overflow-hidden">
    {/* Background */}
    <div
      className="absolute inset-0 bg-cover bg-center scale-[1.05] transition-transform duration-[8s] hover:scale-100"
      style={{
        backgroundImage: `url(${image})`,
        filter: "brightness(0.38)",
      }}
    />
    {/* Overlays */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/72 to-black/15" />

    {/* Content */}
    <div className="relative z-10 w-full max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-14">
      {eyebrow && (
        <span className="flex items-center gap-3 text-[0.68rem] tracking-[0.28em] uppercase text-[#c4a064] mb-3 animate-fade-up">
          <span className="block w-8 h-px bg-[#c4a064] flex-shrink-0" />
          {eyebrow}
        </span>
      )}
      <h1
        className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-light text-white leading-[1.05] mb-3 animate-fade-up"
        style={{ animationDelay: "0.12s" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-[clamp(0.85rem,1.5vw,0.95rem)] text-white/55 font-light max-w-[420px] leading-[1.75] animate-fade-up"
          style={{ animationDelay: "0.24s" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  </section>
);

export default PageHero;