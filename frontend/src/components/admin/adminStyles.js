export const S = {
  // Input
  input: {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "6px",
    padding: "0.9rem 1.1rem",
    fontSize: "1rem", // Increased from 0.875
    color: "#ffffff", // Changed to white
    fontFamily: "'Jost', sans-serif",
    fontWeight: 400,
    outline: "none",
    transition: "all 0.3s ease",
    ":focus": {
      borderColor: "#c4a064",
      background: "#222222",
    }
  },
  textarea: {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "6px",
    padding: "0.9rem 1.1rem",
    fontSize: "1rem", // Increased
    color: "#ffffff", // White
    fontFamily: "'Jost', sans-serif",
    fontWeight: 400,
    outline: "none",
    resize: "vertical",
    minHeight: "120px",
    transition: "all 0.3s ease",
  },
  select: {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "6px",
    padding: "0.9rem 1.1rem",
    fontSize: "1rem", // Increased
    color: "#ffffff", // White
    fontFamily: "'Jost', sans-serif",
    fontWeight: 400,
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    transition: "all 0.3s ease",
  },
  label: {
    display: "block",
    fontSize: "0.75rem", // Increased from 0.62
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#ffffff", // Changed to white for better visibility
    marginBottom: "0.6rem",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 500,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  // Buttons
  btnGold: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    padding: "0.85rem 1.8rem",
    background: "linear-gradient(135deg, #d4b074, #b08850)",
    color: "#000000",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.85rem", // Increased
    fontWeight: 600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Jost', sans-serif",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 15px rgba(196, 160, 100, 0.2)",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(196, 160, 100, 0.3)",
      opacity: 0.95,
    }
  },
  btnOutline: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    padding: "0.8rem 1.5rem",
    background: "transparent",
    color: "#ffffff", // White
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "6px",
    fontSize: "0.8rem", // Increased
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Jost', sans-serif",
    transition: "all 0.3s ease",
    ":hover": {
      background: "rgba(255,255,255,0.05)",
      borderColor: "#ffffff",
    }
  },
  btnDanger: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.7rem 1.2rem",
    background: "rgba(255,50,50,0.1)",
    color: "#ff6b6b",
    border: "1px solid rgba(255,50,50,0.25)",
    borderRadius: "6px",
    fontSize: "0.8rem", // Increased
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "'Jost', sans-serif",
    transition: "all 0.3s ease",
    ":hover": {
      background: "rgba(255,50,50,0.2)",
      borderColor: "#ff6b6b",
    }
  },
  // Table
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px", // Added spacing between rows
  },
  th: {
    padding: "1rem 1.25rem",
    textAlign: "left",
    fontSize: "0.75rem", // Increased
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#ffffff", // White
    borderBottom: "none",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 600,
    opacity: 0.7,
  },
  td: {
    padding: "1.25rem",
    fontSize: "1rem", // Increased from 0.85
    color: "#f0ece4",
    background: "#161616",
    borderBottom: "none",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 400,
    verticalAlign: "middle",
    transition: "all 0.3s ease",
  },
  // Card
  card: {
    background: "#111111",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  // Badge
  badge: (color) => ({
    display: "inline-block",
    padding: "0.35rem 0.85rem",
    borderRadius: "4px",
    fontSize: "0.7rem", // Increased
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "'Jost', sans-serif",
    ...(color === "green"  && { background: "rgba(0,255,100,0.1)", color: "#00ff88" }),
    ...(color === "gold"   && { background: "rgba(196,160,100,0.1)", color: "#c4a064" }),
    ...(color === "red"    && { background: "rgba(255,50,50,0.1)", color: "#ff6b6b" }),
    ...(color === "gray"   && { background: "rgba(255,255,255,0.08)", color: "#ffffff" }),
    ...(color === "blue"   && { background: "rgba(0,150,255,0.1)", color: "#44aaff" }),
  }),
};