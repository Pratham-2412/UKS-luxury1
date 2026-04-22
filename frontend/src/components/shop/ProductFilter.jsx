// src/components/shop/ProductFilter.jsx
import { useState } from "react";
import { RiEqualizerLine, RiAddLine, RiSubtractLine } from "react-icons/ri";


 const CATEGORIES = [
  { label: "All Items",           value: "" },
  { label: "Hobs",                value: "Hobs" },
  { label: "Ovens",               value: "Ovens" },
  { label: "Quooker",             value: "Quooker" },
  { label: "Kitchen Sinks",       value: "Kitchen Sinks" },
  { label: "Hoods",               value: "Hoods" },
  { label: "Accessories",         value: "Accessories" },
  { label: "Coffee Machines",     value: "Coffee Machines" },
  { label: "Microwaves",          value: "Microwaves" },
  { label: "Warming Drawers",     value: "Warming Drawers" },
  { label: "Dishwashers",         value: "Dishwashers" },
];

// ── Accordion wrapper ──────────────────────────────────────────────
const AccordionSection = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-white/7 pt-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full mb-3 group cursor-pointer"
      >
        <span className="text-[0.62rem] tracking-[0.2em] uppercase text-white/80 font-medium group-hover:text-[#c4a064] transition-colors duration-200">
          {title}
        </span>
        <span className="text-[#5a5550] group-hover:text-[#c4a064] transition-colors duration-200">
          {open ? <RiSubtractLine className="text-xs" /> : <RiAddLine className="text-xs" />}
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "900px" : "0px", opacity: open ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
};

// ── Filter row ─────────────────────────────────────────────────────
const FilterRow = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full text-left py-2 transition-colors duration-150 cursor-pointer ${
      active ? "text-[#c4a064]" : "text-white/50 hover:text-white/90"
    }`}
  >
    <span
      className={`w-[11px] h-[11px] flex-shrink-0 border transition-all duration-150 ${
        active ? "border-[#c4a064] bg-[#c4a064]" : "border-white/10"
      }`}
    />
    <span className="text-[0.8rem] font-light tracking-wide">{children}</span>
  </button>
);

// ── Price chip ─────────────────────────────────────────────────────
const PriceChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-2 py-1 text-[0.58rem] tracking-[0.06em] uppercase border transition-all duration-150 cursor-pointer ${
      active
        ? "border-[#c4a064] text-[#c4a064] bg-[#c4a064]/8"
        : "border-white/10 text-[#5a5550] hover:border-white/25 hover:text-[#a09880]"
    }`}
  >
    {label}
  </button>
);

// ── Main Component ─────────────────────────────────────────────────
const ProductFilter = ({
  activeCategory,
  onCategory,
  featured,
  onFeatured,
  minPrice,
  maxPrice,
  onPriceApply,
}) => {
  const [localMin, setLocalMin] = useState(minPrice || "");
  const [localMax, setLocalMax] = useState(maxPrice || "");

  const clearAll = () => {
    onCategory("");
    onFeatured(false);
    setLocalMin("");
    setLocalMax("");
    onPriceApply("", "");
  };

  const hasActive = activeCategory || featured || minPrice || maxPrice;

  const inputCls =
    "w-full bg-[#111111] border border-white/10 text-[0.75rem] text-[#f0ece4] placeholder:text-[#3a3530] px-3 py-2 outline-none focus:border-[#c4a064]/40 transition-colors duration-200";

  return (
    <div className="p-5 lg:p-0 flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 text-[0.65rem] tracking-[0.2em] uppercase text-white font-medium">
          <RiEqualizerLine className="text-[#c4a064]" />
          Refine
        </span>
        {hasActive && (
          <button
            onClick={clearAll}
            className="text-[0.6rem] tracking-[0.15em] uppercase text-white/40 hover:text-[#c4a064] transition-colors duration-200 cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* ── Active pill ── */}
      {hasActive && (
        <div className="flex flex-wrap gap-2 mb-2">
          {activeCategory && (
            <span
              onClick={() => onCategory("")}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c4a064]/10 border border-[#c4a064]/30 text-[0.58rem] tracking-[0.1em] uppercase text-[#c4a064] cursor-pointer hover:bg-[#c4a064]/20 transition-all duration-200"
            >
              {activeCategory} <span className="text-[0.7rem] ml-0.5">×</span>
            </span>
          )}
          {featured && (
            <span
              onClick={() => onFeatured(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c4a064]/10 border border-[#c4a064]/30 text-[0.58rem] tracking-[0.1em] uppercase text-[#c4a064] cursor-pointer hover:bg-[#c4a064]/20 transition-all duration-200"
            >
              Featured <span className="text-[0.7rem] ml-0.5">×</span>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span
              onClick={() => { setLocalMin(""); setLocalMax(""); onPriceApply("", ""); }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c4a064]/10 border border-[#c4a064]/30 text-[0.58rem] tracking-[0.1em] uppercase text-[#c4a064] cursor-pointer hover:bg-[#c4a064]/20 transition-all duration-200"
            >
              £{minPrice || "0"} – £{maxPrice || "∞"} <span className="text-[0.7rem] ml-0.5">×</span>
            </span>
          )}
        </div>
      )}

      {/* ── Category — flat list ── */}
      <div className="border-t border-white/7 pt-6">
        <p className="text-[0.62rem] tracking-[0.2em] uppercase text-white/80 font-medium mb-5">Category</p>
        <div className="flex flex-col gap-0.5">
          {CATEGORIES.map((c) => (
            <FilterRow
              key={c.value}
              active={activeCategory === c.value}
              onClick={() => onCategory(c.value)}
            >
              {c.label}
            </FilterRow>
          ))}
        </div>
      </div>

      {/* ── Availability ── */}
      <AccordionSection title="Availability" defaultOpen={false}>
        <div className="flex flex-col">
          <FilterRow active={featured} onClick={() => onFeatured(!featured)}>
            Featured Only
          </FilterRow>
          <FilterRow active={false} onClick={() => {}}>
            In Stock
          </FilterRow>
          <FilterRow active={false} onClick={() => {}}>
            Made to Order
          </FilterRow>
        </div>
      </AccordionSection>

      {/* ── Price ── */}
      <AccordionSection title="Price Range (£)" defaultOpen={false}>
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              className={inputCls}
            />
            <input
              type="number"
              placeholder="Max"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              ["Under £1k",  "",     "1000"],
              ["£1k – £5k",  "1000", "5000"],
              ["£5k – £15k", "5000", "15000"],
              ["£15k+",      "15000",""],
            ].map(([label, mn, mx]) => (
              <PriceChip
                key={label}
                label={label}
                active={minPrice === mn && maxPrice === mx}
                onClick={() => { setLocalMin(mn); setLocalMax(mx); onPriceApply(mn, mx); }}
              />
            ))}
          </div>
          <button
            onClick={() => onPriceApply(localMin, localMax)}
            className="w-full py-2.5 bg-[#c4a064]/10 border border-[#c4a064]/25 text-[0.65rem] tracking-[0.15em] uppercase text-[#c4a064] hover:bg-[#c4a064]/18 transition-all duration-200 cursor-pointer"
          >
            Apply
          </button>
        </div>
      </AccordionSection>

    </div>
  );
};

export default ProductFilter;