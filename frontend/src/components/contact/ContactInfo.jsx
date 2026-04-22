// src/components/contact/ContactInfo.jsx
import {
  RiMapPinLine, RiPhoneLine, RiMailLine, RiTimeLine,
  RiInstagramLine, RiFacebookBoxLine, RiPinterestLine,
} from "react-icons/ri";

const INFO_ITEMS = [
  { icon: <RiMapPinLine />, label: "Showroom", lines: ["32 Victoria Road", "Ruislip, England HA4 0AB", "United Kingdom"] },
  { icon: <RiPhoneLine />,  label: "Phone",    href: "tel:+441234567890",          lines: ["+44 01895 347277"] },
  { icon: <RiMailLine />,   label: "Email",    href: "mailto:sales@uks-interiors.com", lines: ["sales@uks-interiors.com"] },
  { icon: <RiTimeLine />,   label: "Showroom Hours", lines: ["Mon – Fri: 10:00am – 6:00pm", "Saturday: 10:00am – 4:00pm", "Sunday: Closed"] },
];

const SOCIALS = [
  { icon: <RiInstagramLine />,   href: "https://instagram.com", label: "Instagram" },
  { icon: <RiFacebookBoxLine />, href: "https://facebook.com",  label: "Facebook" },
  { icon: <RiPinterestLine />,   href: "https://pinterest.com", label: "Pinterest" },
];

const ContactInfo = () => (
  <div className="flex flex-col gap-10">

    {/* Header */}
    <div className="flex flex-col gap-5">
      <span className="flex items-center gap-2 text-[0.6rem] tracking-[0.25em] uppercase text-[#c4a064] animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <span className="w-6 h-px bg-[#c4a064] opacity-50" />
        Get In Touch
      </span>
      <h2 className="font-serif text-[clamp(1.8rem,4vw,2.6rem)] font-light text-[#f0ece4] leading-[1.1] animate-fade-up" style={{ animationDelay: '0.2s' }}>
        Let's Create Something <em className="italic text-[#e8d5a3]">Extraordinary</em>
      </h2>
      <p className="text-[1rem] text-white/70 leading-[1.8] font-light max-w-[380px] animate-fade-up" style={{ animationDelay: '0.3s' }}>
        Whether you have a project in mind or simply want to explore our
        collections, our team is here to guide you every step of the way.
      </p>
    </div>

    {/* Info items */}
    <div className="flex flex-col gap-0 border border-white/7">
      {INFO_ITEMS.map((item, i) => (
        <div
          key={item.label}
          className={`flex items-start gap-4 p-5 ${i < INFO_ITEMS.length - 1 ? "border-b border-white/7" : ""} group hover:bg-[#111111] transition-colors duration-200`}
        >
          <div className="w-9 h-9 flex items-center justify-center border border-[#c4a064]/25 text-[#c4a064] text-base flex-shrink-0 group-hover:bg-[#c4a064]/8 group-hover:border-[#c4a064]/50 transition-all duration-200">
            {item.icon}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.55rem] tracking-[0.18em] uppercase text-[#5a5550] mb-1">
              {item.label}
            </span>
            {item.href ? (
              <a
                href={item.href}
                className="text-[0.85rem] text-[#a09880] hover:text-[#c4a064] transition-colors duration-200"
              >
                {item.lines[0]}
              </a>
            ) : (
              item.lines.map((line, j) => (
                <span key={j} className="text-[0.85rem] text-[#a09880] leading-relaxed">
                  {line}
                </span>
              ))
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Socials */}
    <div className="flex flex-col gap-3">
      <span className="text-[0.55rem] tracking-[0.2em] uppercase text-[#5a5550]">
        Follow Our Work
      </span>
      <div className="flex items-center gap-2.5">
        {SOCIALS.map((s) => (
         <a 
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="w-9 h-9 border border-white/10 flex items-center justify-center text-[#5a5550] hover:text-[#c4a064] hover:border-[#c4a064]/30 transition-all duration-200 text-base"
          >
            {s.icon}
          </a>
        ))}
      </div>
    </div>

    {/* Map */}
    <div className="border border-white/7 overflow-hidden aspect-[4/3]">
      <iframe
        title="UKS Interiors Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.244877899538!2d-0.14927848422955!3d51.50735397963559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzI2LjUiTiAwwrAwOCc1Ny40Ilc!5e0!3m2!1sen!2suk!4v1620000000000!5m2!1sen!2suk"
        className="w-full h-full grayscale opacity-70 hover:opacity-90 transition-opacity duration-300"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>

  </div>
);

export default ContactInfo;