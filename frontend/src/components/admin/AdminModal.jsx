import { useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const AdminModal = ({ open, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const widths = { sm: "480px", md: "640px", lg: "800px", xl: "1000px" };

  return (
    <AnimatePresence>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: window.innerWidth < 768 ? "0.5rem" : "1.5rem",
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(12px)",
            }}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.1)",
              borderTop: "3px solid #d4b074",
              borderRadius: "12px",
              width: "100%",
              maxWidth: widths[size],
              maxHeight: "calc(100vh - 40px)",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              zIndex: 210,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5rem 2rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
            }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.8rem",
                fontWeight: 400,
                color: "#ffffff",
              }}>{title}</h3>
              <button
                onClick={onClose}
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                <RiCloseLine />
              </button>
            </div>

            {/* Body */}
            <div style={{ 
              overflowY: "auto", 
              flex: 1, 
              padding: window.innerWidth < 768 ? "1.5rem" : "2rem" 
            }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminModal;