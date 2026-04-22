// src/App.jsx

import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AppRouter from "./router/AppRouter";
import Cursor from "./components/common/Cursor";
import useScrollProgress from "./hooks/useScrollProgress";
import "./styles/globals.css";

// ─── Inner wrapper (needs router context for useLocation) ─────────────────
const AppInner = () => {

  useScrollProgress();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      {/* Gold scroll progress bar */}
      <div
        id="scroll-progress-bar"
        className="scroll-progress-bar"
        aria-hidden="true"
      />

      {/* Custom luxury cursor — auto-hides on touch devices */}
      <Cursor />

      {/* All routes rendered via AppRouter (includes Navbar + Footer) */}
      <AppRouter />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#141414",
            color: "#f0ece4",
            border: "1px solid rgba(196, 160, 100, 0.2)",
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.875rem",
            letterSpacing: "0.03em",
          },
          success: {
            iconTheme: {
              primary: "#c4a064",
              secondary: "#141414",
            },
          },
        }}
      />
    </>
  );
};

// ─── Root App (provides all context + router) ─────────────────────────────
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;