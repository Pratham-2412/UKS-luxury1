import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminLogout } from "../../api/adminApi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  RiDashboardLine,
  RiGalleryLine,
  RiFileListLine,
  RiProjectorLine,
  RiShoppingBagLine,
  RiPercentLine,
  RiMailLine,
  RiShoppingCartLine,
  RiStarLine,
  RiSettings3Line,
  RiLogoutBoxLine,
  RiImageLine,
  RiFileList3Line,
  RiBookmarkLine,
} from "react-icons/ri";

const NAV = [
  { path: "/admin/dashboard", icon: <RiDashboardLine />, label: "Dashboard" },
  { path: "/admin/hero", icon: <RiImageLine />, label: "Hero Sections" },
  { path: "/admin/categories", icon: <RiFileList3Line />, label: "Categories" },
  { path: "/admin/collections", icon: <RiFileListLine />, label: "Collections" },
  { path: "/admin/projects", icon: <RiProjectorLine />, label: "Projects" },
  { path: "/admin/products", icon: <RiShoppingBagLine />, label: "Products" },
  { path: "/admin/offers", icon: <RiPercentLine />, label: "Offers" },
  { path: "/admin/inquiries", icon: <RiMailLine />, label: "Inquiries" },
  { path: "/admin/orders", icon: <RiShoppingCartLine />, label: "Orders" },
  { path: "/admin/testimonials", icon: <RiStarLine />, label: "Testimonials" },
  { path: "/admin/brands", icon: <RiBookmarkLine />, label: "Brands" },
  { path: "/admin/settings", icon: <RiSettings3Line />, label: "Settings" },
];

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {}
    logout();
    navigate("/admin/login");
    toast.success("Logged out");
  };

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#0f0f0f",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "1.75rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.2rem",
              color: "#c4a064",
              letterSpacing: "0.15em",
            }}
          >
            UKS
          </span>
          <span
            style={{
              width: "1px",
              height: "16px",
              background: "rgba(196,160,100,0.3)",
            }}
          />
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.55rem",
              color: "#a09880",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            ADMIN
          </span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "1rem 0", overflowY: "auto" }}>
        {NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.85rem 1.5rem",
              fontSize: "0.95rem",
              fontFamily: "'Jost', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.08em",
              textDecoration: "none",
              color: isActive ? "#ffffff" : "#a09880",
              position: "relative",
              transition: "color 0.3s ease",
            })}
          >
            {({ isActive }) => (
              <motion.div 
                whileHover="hover"
                initial="initial"
                style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%", position: "relative" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-bg"
                    style={{
                      position: "absolute",
                      inset: "-4px -12px",
                      background: "rgba(196,160,100,0.15)",
                      borderRadius: "8px",
                      borderLeft: "3px solid #c4a064",
                      zIndex: -1,
                    }}
                  />
                )}
                <span style={{ fontSize: "1.2rem", color: isActive ? "#c4a064" : "inherit" }}>{item.icon}</span>
                
                <div style={{ position: "relative" }}>
                  {item.label}
                  <motion.div
                    variants={{
                      initial: { width: 0 },
                      hover: { width: "100%" }
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: "absolute",
                      bottom: -4,
                      left: 0,
                      height: "2px",
                      background: "#c4a064",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          padding: "1.5rem 1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            width: "100%",
            padding: "0.8rem 0",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontFamily: "'Jost', sans-serif",
            color: "#a09880",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ff6b6b")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#a09880")}
        >
          <RiLogoutBoxLine style={{ fontSize: "1.2rem" }} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;