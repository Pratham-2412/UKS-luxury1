// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import {
  RiInstagramLine, RiFacebookBoxLine, RiPinterestLine, RiLinkedinBoxLine,
  RiMapPinLine, RiPhoneLine, RiMailLine, RiArrowRightUpLine,
} from "react-icons/ri";

const COLLECTION_LINKS = [
  { label: "Bespoke Kitchens",  slug: "bespoke-kitchens" },
  { label: "Dining Rooms",      slug: "dining-rooms" },
  { label: "Living Room",       slug: "living-room" },
  { label: "Offices",           slug: "offices" },
  { label: "Bookcases",         slug: "bookcases" },
  { label: "Hinged Wardrobes",  slug: "hinged-wardrobes" },
  { label: "Sliding Wardrobes", slug: "sliding-wardrobes" },
  { label: "Walk In Closet",    slug: "walk-in-closet" },
  { label: "Storage Units",     slug: "storage-units" },
];

const QUICK_LINKS = [
  { label: "Home",     path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "Offers",   path: "/offers" },
  { label: "Shop",     path: "/shop" },
  { label: "Contact",  path: "/contact" },
];

const SOCIALS = [
  { icon: <RiInstagramLine />, href: "https://instagram.com", label: "Instagram" },
  { icon: <RiFacebookBoxLine />, href: "https://facebook.com", label: "Facebook" },
  { icon: <RiPinterestLine />, href: "https://pinterest.com", label: "Pinterest" },
  { icon: <RiLinkedinBoxLine />, href: "https://linkedin.com", label: "LinkedIn" },
];

// Shared white text color used throughout
const W = "rgba(255,255,255,0.72)";
const W_HOVER = "#c4a064";

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    style={{
      fontFamily: "'Jost', sans-serif",
      fontSize: "0.875rem",
      fontWeight: 300,
      color: W,
      lineHeight: 1.7,
      transition: "color 0.2s ease",
      display: "inline-block",
    }}
    onMouseEnter={e => e.currentTarget.style.color = W_HOVER}
    onMouseLeave={e => e.currentTarget.style.color = W}
  >
    {children}
  </Link>
);

const ColHeading = ({ children }) => (
  <h4 style={{
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.62rem",
    fontWeight: 500,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#c4a064",
    marginBottom: "1.25rem",
  }}>
    {children}
  </h4>
);

import { useSettings } from "../../context/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  const SOCIALS = [
    { icon: <RiInstagramLine />, href: settings?.socialLinks?.instagram || "https://instagram.com", label: "Instagram" },
    { icon: <RiFacebookBoxLine />, href: settings?.socialLinks?.facebook || "https://facebook.com", label: "Facebook" },
    { icon: <RiLinkedinBoxLine />, href: settings?.socialLinks?.linkedin || "https://linkedin.com", label: "LinkedIn" },
    { icon: <RiPinterestLine />, href: settings?.socialLinks?.pinterest || "https://pinterest.com", label: "Pinterest" },
  ];

  const logoSrc = settings?.logo || "/logo.png";
  const siteName = settings?.siteName || "UKS Interiors";

  return (
    <>
      <style>{`
        .footer-social {
          width: 36px; height: 36px;
          border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.45); font-size: 1.05rem;
          border-radius: 50%;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .footer-social:hover {
          color: #c4a064;
          border-color: rgba(196,160,100,0.4);
          background: rgba(196,160,100,0.06);
        }
        .footer-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #c4a064, #a07840);
          color: #0a0a0a;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .footer-cta-btn:hover {
          background: linear-gradient(135deg, #e8d5a3, #c4a064);
          transform: translateY(-2px);
        }
        .contact-link {
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          color: rgba(255,255,255,0.72);
          transition: color 0.2s;
        }
        .contact-link:hover { color: #c4a064; }
      `}</style>

      <footer style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "'Jost', sans-serif" }}>

        {/* ── CTA band — unchanged ── */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "clamp(2.5rem,5vw,3.5rem) clamp(1.5rem,5vw,5rem)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
            <div>
              <span style={{ display: "block", fontFamily: "'Jost', sans-serif", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c4a064", marginBottom: "0.75rem" }}>
                Begin Your Journey
              </span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 300, color: "#f0ece4", lineHeight: 1.25 }}>
                Transform Your Space With{" "}
                <em style={{ fontStyle: "italic", color: "#e8d5a3" }}>Bespoke Excellence</em>
              </h3>
            </div>
            <Link to="/contact" className="footer-cta-btn">
              Book a Consultation
              <RiArrowRightUpLine style={{ fontSize: "1rem" }} />
            </Link>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "5rem clamp(1.5rem,5vw,5rem)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "3rem 3.5rem" }}
            className="lg:grid-cols-[2fr_1fr_1fr_1.5fr]">

            {/* Brand */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Link to="/">
                <img src={logoSrc} alt={siteName} style={{ height: "32px", width: "auto", objectFit: "contain", opacity: 0.85 }} />
              </Link>
              <p style={{ fontSize: "0.875rem", fontWeight: 300, color: W, lineHeight: 1.85, maxWidth: "260px" }}>
                {settings?.seo?.metaDescription || "Award-winning European luxury interior design. Bespoke kitchens, wardrobes, and furniture crafted with precision and elegance."}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="footer-social">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div>
              <ColHeading>Collections</ColHeading>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {COLLECTION_LINKS.map((item) => (
                  <li key={item.slug}>
                    <FooterLink to={`/collections/${item.slug}`}>{item.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links + Legal */}
            <div>
              <ColHeading>Quick Links</ColHeading>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "2.5rem" }}>
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <FooterLink to={link.path}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
              <ColHeading>Legal</ColHeading>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((label) => (
                  <li key={label}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 300, color: W, cursor: "default" }}>
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <ColHeading>Get In Touch</ColHeading>
              <ul style={{ display: "flex", flexDirection: "column", gap: "1.1rem", marginBottom: "1.75rem" }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <RiMapPinLine style={{ color: "#c4a064", fontSize: "0.95rem", marginTop: "3px", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.875rem", fontWeight: 300, color: W, lineHeight: 1.75 }}>
                    {settings?.address ? (
                      settings.address.split(", ").map((line, i) => (
                        <span key={i}>{line}{i < settings.address.split(", ").length - 1 && <br/>}</span>
                      ))
                    ) : (
                      <>32 Victoria Road<br/>Ruislip, England HA4 0AB</>
                    )}
                  </span>
                </li>
                {settings?.phone && (
                  <li style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <RiPhoneLine style={{ color: "#c4a064", fontSize: "0.95rem", flexShrink: 0 }} />
                    <a href={`tel:${settings.phone}`} className="contact-link">{settings.phone}</a>
                  </li>
                )}
                {settings?.contactEmail && (
                  <li style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <RiMailLine style={{ color: "#c4a064", fontSize: "0.95rem", flexShrink: 0 }} />
                    <a href={`mailto:${settings.contactEmail}`} className="contact-link">{settings.contactEmail}</a>
                  </li>
                )}
              </ul>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.25rem" }}>
                <p style={{ fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#c4a064", marginBottom: "0.75rem" }}>
                  Showroom Hours
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {["Mon – Fri: 10:00am – 6:00pm", "Saturday: 10:00am – 4:00pm", "Sunday: Closed"].map((t) => (
                    <p key={t} style={{ fontSize: "0.82rem", fontWeight: 300, color: W }}>{t}</p>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "1.25rem clamp(1.5rem,5vw,5rem)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 300, color: W }}>
              © {year} {siteName}. All rights reserved.
            </p>
            <p style={{ fontSize: "0.75rem", fontWeight: 300, color: W, fontStyle: "italic" }}>
              Crafted with precision & elegance
            </p>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;