// src/components/ui/Button.jsx
const variantStyles = {
  gold:     "bg-gradient-to-r from-[#c4a064] to-[#a07840] text-[#0a0a0a] hover:from-[#e8d5a3] hover:to-[#c4a064] hover:shadow-[0_6px_24px_rgba(196,160,100,0.3)]",
  outline:  "border border-[#c4a064]/40 text-[#c4a064] hover:bg-[#c4a064]/8 hover:border-[#c4a064]/70",
  ghost:    "border border-white/10 text-[#a09880] hover:border-white/25 hover:text-[#f0ece4]",
  dark:     "bg-[#141414] border border-white/7 text-[#f0ece4] hover:border-[#c4a064]/30 hover:text-[#c4a064]",
};

const sizeStyles = {
  sm: "px-5 py-2 text-[0.65rem] tracking-[0.15em]",
  md: "px-7 py-3.5 text-[0.72rem] tracking-[0.15em]",
  lg: "px-9 py-4 text-[0.78rem] tracking-[0.18em]",
};

const Button = ({
  children,
  variant = "gold",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-2
        uppercase font-normal font-sans
        transition-all duration-300
        hover:-translate-y-0.5
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${variantStyles[variant] || variantStyles.gold}
        ${sizeStyles[size] || sizeStyles.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;