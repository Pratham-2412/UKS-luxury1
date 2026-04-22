// src/components/common/PageTransition.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Wrap every page/route outlet in this component.
// Gives each page a fresh mount animation when route changes.
// ─────────────────────────────────────────────────────────────────────────────

import { useLocation } from "react-router-dom";
const PageTransition = ({ children, subtle = false }) => {
  const { pathname } = useLocation();

  return (
    <div
      key={pathname}
      className={subtle ? "page-transition--subtle" : "page-transition"}
    >
      {children}
    </div>
  );
};

export default PageTransition;
