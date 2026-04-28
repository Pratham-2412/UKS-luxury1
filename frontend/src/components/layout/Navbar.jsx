// src/components/layout/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CartDrawer from "../ui/CartDrawer";
import {
  RiShoppingBagLine, RiMenuLine, RiCloseLine, RiArrowDownSLine,
} from "react-icons/ri";

const COLLECTION_ITEMS = [
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

const NAV_LINKS = [
  { label: "Home",       path: "/" },
  { label: "Collection", path: "/collections", hasDropdown: true },
  { label: "Projects",   path: "/projects" },
  { label: "Offers",     path: "/offers" },
  { label: "Contact",    path: "/contact" },
  { label: "Shop",       path: "/shop" },
];

import { useSettings } from "../../context/SettingsContext";

const Logo = () => {
  const { settings } = useSettings();
  const logoSrc = settings?.logo || "/logo.png";
  const siteName = settings?.siteName || "UKS INTERIORS";

  return (
    <img
      src={logoSrc}
      alt={siteName}
      className="h-8 w-auto object-contain"
      onError={(e) => {
        e.target.onerror = null;
        e.target.style.display = "none";
        e.target.parentNode.innerHTML =
          `<span style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:400;letter-spacing:0.18em;color:#f0ece4;">${siteName.toUpperCase()}</span>`;
      }}
    />
  );
};

const Navbar = () => {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [dropdownOpen, setDropdownOpen]     = useState(false);
  const [mobileCollOpen, setMobileCollOpen] = useState(false);
  const [drawerOpen, setDrawerOpen]         = useState(false);

  const dropdownRef = useRef(null);
  const { cartCount } = useCart();
  const { settings } = useSettings();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setMobileCollOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileCollOpen(false);
  };

  const toggleMobile = () => {
    if (mobileOpen) closeMobile();
    else setMobileOpen(true);
  };

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: color 0.2s ease;
          cursor: pointer;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 1px;
          background: #c4a064;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link:hover::after,
        .nav-link.active::after { width: 100%; }
        .nav-link.active { color: #c4a064; }
        .nav-link:not(.active) { color: rgba(255,255,255,0.65); }
        .nav-link:not(.active):hover { color: #f0ece4; }

        .dropdown-panel {
          position: absolute;
          top: calc(100% + 14px);
          left: 50%;
          width: 230px;
          background: #0f0f0f;
          border: 1px solid rgba(255,255,255,0.08);
          border-top: 2px solid #c4a064;
          transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1);
        }
        .dropdown-panel.open  { opacity:1; transform:translateX(-50%) translateY(0); pointer-events:auto; }
        .dropdown-panel.close { opacity:0; transform:translateX(-50%) translateY(-8px); pointer-events:none; }

        .dropdown-item {
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: rgba(255,255,255,0.55);
          transition: color 0.15s ease, padding-left 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
        }
        .dropdown-item:hover { color: #c4a064; padding-left: 5px; }

        .cart-btn {
          position: relative;
          color: rgba(255,255,255,0.6);
          transition: color 0.2s;
        }
        .cart-btn:hover { color: #f0ece4; }

        /* Show hamburger only below 1024px */
        .hamburger-btn {
          display: none;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.7);
          transition: color 0.2s;
        }
        @media (max-width: 1023px) {
          .hamburger-btn { display: flex; }
        }

        /* Hide desktop nav below 1024px */
        .desktop-nav {
          display: flex;
        }
        @media (max-width: 1023px) {
          .desktop-nav { display: none; }
        }
      `}</style>

      {/* ── Header ── */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          transition: "background 0.4s, border-color 0.4s",
          background: scrolled || !isHome ? "rgba(10,10,10,0.96)" : "transparent",
          backdropFilter: scrolled || !isHome ? "blur(12px)" : "none",
          borderBottom: scrolled || !isHome ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: "1400px", margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            height: "70px", padding: "0 clamp(1.5rem,4vw,4rem)",
          }}
        >
          {/* Logo */}
          <Link to="/"><Logo /></Link>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ alignItems: "center", gap: "2.5rem" }}>
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  ref={dropdownRef}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={() => setDropdownOpen((p) => !p)}
                    className={`nav-link flex items-center gap-1 ${pathname.startsWith("/collections") ? "active" : ""}`}
                  >
                    {link.label}
                    <RiArrowDownSLine style={{ fontSize: "1rem", transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </button>

                  <div className={`dropdown-panel ${dropdownOpen ? "open" : "close"}`}>
                    <div style={{ padding: "1.25rem" }}>
                      <p style={{ fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c4a064", marginBottom: "10px", fontFamily: "'Jost', sans-serif" }}>
                        Our Collections
                      </p>
                      <ul style={{ display: "flex", flexDirection: "column" }}>
                        {COLLECTION_ITEMS.map((item) => (
                          <li key={item.slug}>
                            <Link to={`/collections/${item.slug}`} className="dropdown-item">
                              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(196,160,100,0.45)", flexShrink: 0 }} />
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/collections"
                        style={{ display: "block", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c4a064", fontFamily: "'Jost', sans-serif", transition: "color 0.15s" }}
                        onMouseEnter={e => e.target.style.color = "#e8d5a3"}
                        onMouseLeave={e => e.target.style.color = "#c4a064"}
                      >
                        View All Collections →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                >
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            {/* Cart */}
            <button onClick={() => setDrawerOpen(true)} aria-label="Open cart" className="cart-btn">
              <RiShoppingBagLine style={{ fontSize: "1.25rem" }} />
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: "-6px", right: "-6px", width: "17px", height: "17px", borderRadius: "50%", background: "#c4a064", color: "#0a0a0a", fontSize: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Jost', sans-serif", fontWeight: 500 }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger — only on screens < 1024px */}
            <button
              className="hamburger-btn"
              onClick={toggleMobile}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen
                ? <RiCloseLine style={{ fontSize: "1.6rem" }} />
                : <RiMenuLine  style={{ fontSize: "1.6rem" }} />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        onClick={closeMobile}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          zIndex: 40,
          transition: "opacity 0.3s ease",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      />

      {/* ── Mobile drawer — only rendered/visible on < 1024px ── */}
      <div
        style={{
          position: "fixed", top: 0, right: 0,
          height: "100%", width: "310px",
          background: "#0c0c0c",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          zIndex: 50,
          display: "flex", flexDirection: "column",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>

          {/* Drawer header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", height: "70px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
            <Logo />
            <button
              onClick={closeMobile}
              style={{ color: "rgba(255,255,255,0.45)", cursor: "pointer", transition: "color 0.2s", background: "none", border: "none", display: "flex", alignItems: "center" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
            >
              <RiCloseLine style={{ fontSize: "1.5rem" }} />
            </button>
          </div>

          {/* Drawer nav links */}
          <nav style={{ display: "flex", flexDirection: "column", padding: "1.5rem 1.5rem 1rem" }}>
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <div key={link.label} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <button
                    onClick={() => setMobileCollOpen((p) => !p)}
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.6rem", fontWeight: 300, letterSpacing: "0.05em",
                      color: mobileCollOpen ? "#c4a064" : "rgba(255,255,255,0.8)",
                      padding: "0.75rem 0",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      width: "100%", cursor: "pointer", transition: "color 0.2s",
                      background: "none", border: "none",
                    }}
                  >
                    {link.label}
                    <RiArrowDownSLine style={{ fontSize: "1.3rem", color: "#c4a064", transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)", transform: mobileCollOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }} />
                  </button>

                  <div style={{ overflow: "hidden", maxHeight: mobileCollOpen ? "700px" : "0", opacity: mobileCollOpen ? 1 : 0, transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease" }}>
                    <div style={{ paddingLeft: "0.75rem", paddingBottom: "1rem", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c4a064", fontFamily: "'Jost', sans-serif", marginBottom: "8px", marginTop: "4px" }}>
                        Our Collections
                      </p>
                      {COLLECTION_ITEMS.map((item) => (
                        <Link
                          key={item.slug}
                          to={`/collections/${item.slug}`}
                          onClick={closeMobile}
                          style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", fontWeight: 300, color: "rgba(255,255,255,0.6)", padding: "7px 0", display: "flex", alignItems: "center", gap: "10px", transition: "color 0.15s", borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                          onMouseEnter={e => e.currentTarget.style.color = "#c4a064"}
                          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                        >
                          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(196,160,100,0.5)", flexShrink: 0 }} />
                          {item.label}
                        </Link>
                      ))}
                      <Link
                        to="/collections"
                        onClick={closeMobile}
                        style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#c4a064", paddingTop: "10px", marginTop: "6px", borderTop: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        View All Collections →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={closeMobile}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 300, letterSpacing: "0.05em", color: "rgba(255,255,255,0.8)", transition: "color 0.2s ease", padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "block" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#c4a064"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Drawer footer */}
          <div style={{ marginTop: "auto", padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", lineHeight: 1.8, marginBottom: "1rem", fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>
              {settings?.seo?.metaDescription || "Award-winning European luxury interior design."}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {settings?.phone && <a href={`tel:${settings.phone}`} style={{ fontSize: "0.85rem", color: "#c4a064", fontFamily: "'Jost', sans-serif", transition: "color 0.15s" }}>{settings.phone}</a>}
              {settings?.contactEmail && <a href={`mailto:${settings.contactEmail}`} style={{ fontSize: "0.85rem", color: "#c4a064", fontFamily: "'Jost', sans-serif", transition: "color 0.15s" }}>{settings.contactEmail}</a>}
            </div>
          </div>

        </div>
      </div>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default Navbar;