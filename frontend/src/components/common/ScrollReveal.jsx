// src/components/common/ScrollReveal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Wrapper component that applies .sr classes to its child element.
// Usage:
//   <ScrollReveal direction="up" delay={2}>
//     <div>...</div>
//   </ScrollReveal>
// ─────────────────────────────────────────────────────────────────────────────

const ScrollReveal = ({
  children,
  direction = "up",   // up | down | left | right | scale | none
  delay     = 0,      // 0–10 maps to .sr--d0 → .sr--d10
  speed     = "normal", // fast | normal | slow
  className = "",
  tag       = "div",
}) => {
  const Tag = tag;
  const classes = [
    "sr",
    `sr--${direction}`,
    `sr--d${Math.min(Math.max(delay, 0), 10)}`,
    `sr--${speed}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes}>
      {children}
    </Tag>
  );
};

export default ScrollReveal;
