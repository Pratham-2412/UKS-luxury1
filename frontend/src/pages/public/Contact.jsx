// src/pages/public/Contact.jsx
import { useEffect } from "react";
import ContactInfo from "../../components/contact/ContactInfo";
import InquiryForm from "../../components/contact/InquiryForm";

const TRUST_ITEMS = [
  { value: "24hr",  label: "Response Time" },
  { value: "Free",  label: "Design Consultation" },
  { value: "15+",   label: "Years Experience" },
  { value: "500+",  label: "Projects Completed" },
];

const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] font-sans">

      {/* ── Hero ── */}
      <div className="relative aspect-[16/7] min-h-[320px] sm:min-h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&q=80"
          alt="Contact UKS"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] pb-12 sm:pb-16">
          <span className="flex items-center gap-3 text-[0.72rem] tracking-[0.28em] uppercase text-[#c4a064] mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="block w-8 h-px bg-[#c4a064] opacity-50" />
            Get in Touch
          </span>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-light text-white leading-[1.05] mb-4 animate-fade-up" style={{ animationDelay: '0.22s' }}>
            Begin Your <em className="italic text-[#e8d5a3]">Transformation</em>
          </h1>
          <p className="text-[clamp(0.9rem,1.5vw,1.05rem)] text-white/60 font-light max-w-[500px] leading-[1.8] animate-fade-up" style={{ animationDelay: '0.38s' }}>
            Every exceptional interior begins with a conversation.
            We're ready to listen and bring your vision to life.
          </p>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] py-16 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-16 border-b border-white/7">
        <ContactInfo />
        <InquiryForm />
      </div>

      {/* ── Trust strip ── */}
      {/* <section className="border-b border-white/7">
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,5rem)] grid grid-cols-2 md:grid-cols-4">
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center py-10 px-4 border-r border-white/7 last:border-r-0 gap-1 animate-[fadeUp_0.55s_both]"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="font-serif text-[2rem] font-light text-[#c4a064]">
                {item.value}
              </span>
              <span className="text-[0.58rem] tracking-[0.16em] uppercase text-[#5a5550]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section> */}

    </main>
  );
};

export default Contact;