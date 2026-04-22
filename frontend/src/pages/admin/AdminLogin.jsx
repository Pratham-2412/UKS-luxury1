import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminLogin } from "../../api/adminApi";
import toast from "react-hot-toast";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await adminLogin(form);
      login(res.data.token, res.data.user);
      toast.success("Welcome back");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Jost', sans-serif",
      padding: "1rem",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed",
        top: "30%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "400px",
        background: "radial-gradient(ellipse, rgba(196,160,100,0.04), transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: "420px",
        position: "relative",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.5rem",
          }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem",
              color: "#c4a064",
              letterSpacing: "0.15em",
            }}>UKS</span>
            <span style={{
              width: "1px", height: "18px",
              background: "rgba(196,160,100,0.3)",
            }} />
            <span style={{
              fontSize: "0.58rem",
              color: "#a09880",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
            }}>INTERIORS</span>
          </div>
          <p style={{
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#5a5550",
          }}>Admin Portal</p>
        </div>

        {/* Card */}
        <div style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.07)",
          borderTop: "2px solid #a07840",
          borderRadius: "8px",
          padding: "2.5rem",
        }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.75rem",
            fontWeight: 400,
            color: "#f0ece4",
            marginBottom: "0.5rem",
          }}>Welcome Back</h2>
          <p style={{
            fontSize: "0.82rem",
            color: "#5a5550",
            marginBottom: "2rem",
            fontWeight: 300,
          }}>Sign in to manage your website</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.62rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#a09880",
                marginBottom: "0.5rem",
              }}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="admin@uksinteriors.com"
                autoComplete="email"
                style={{
                  width: "100%",
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "4px",
                  padding: "0.8rem 1rem",
                  fontSize: "0.875rem",
                  color: "#f0ece4",
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.62rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#a09880",
                marginBottom: "0.5rem",
              }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "4px",
                    padding: "0.8rem 3rem 0.8rem 1rem",
                    fontSize: "0.875rem",
                    color: "#f0ece4",
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#5a5550",
                    cursor: "pointer",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.9rem",
                background: loading
                  ? "rgba(196,160,100,0.5)"
                  : "linear-gradient(135deg, #c4a064, #a07840)",
                color: "#0a0a0a",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: 400,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Jost', sans-serif",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Signing In…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;