import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = ({ children, title, actions }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#f0ece4",
      fontFamily: "'Jost', sans-serif",
      overflowX: "hidden",
    }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(4px)",
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div style={{
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        left: 0,
        zIndex: 50,
        transform: isMobile
          ? sidebarOpen ? "translateX(0)" : "translateX(-100%)"
          : "translateX(0)",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "100vh",
        width: "260px",
      }}>
        <AdminSidebar />
      </div>

      {/* Main */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        width: "100%",
      }}>

        {/* Top bar */}
        <div style={{
          height: "80px",
          background: "#0f0f0f",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 1.5rem" : "0 3rem",
          position: "sticky",
          top: 0,
          zIndex: 30,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "1rem" : "1.5rem" }}>
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              style={{
                display: isMobile ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "1.25rem",
              }}
            >
              {sidebarOpen ? <RiCloseLine /> : <RiMenuLine />}
            </button>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: isMobile ? "1.4rem" : "1.8rem",
              fontWeight: 400,
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}>{title}</h1>
          </div>
          {actions && (
            <div style={{
              display: "flex",
              gap: "0.75rem",
              transform: isMobile ? "scale(0.85)" : "scale(1)",
              transformOrigin: "right center"
            }}>
              {actions}
            </div>
          )}
        </div>

        {/* Page content */}
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            flex: 1,
            padding: isMobile ? "1.5rem" : "3rem",
            overflowY: "auto"
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLayout;
