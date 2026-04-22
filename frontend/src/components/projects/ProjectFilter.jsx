const CATEGORIES = [
  { label: "All",         value: "" },
  { label: "Kitchen",     value: "Kitchen" },
  { label: "Living Room", value: "Living Room" },
  { label: "Wardrobe",    value: "Wardrobe" },
  { label: "Bedroom",     value: "Bedroom" },
  { label: "Dining Room", value: "Dining Room" },
  { label: "Home Office", value: "Home Office" },
  { label: "Bathroom",    value: "Bathroom" },
  { label: "Outdoor",     value: "Outdoor" },
];

const ProjectFilter = ({ active, onChange }) => (
  <nav
    aria-label="Filter projects by category"
    className="flex items-center gap-2 overflow-x-auto scrollbar-none py-5"
  >
    {CATEGORIES.map((c) => (
      <button
        key={c.value}
        onClick={() => onChange(c.value)}
        className={`px-4 sm:px-5 py-2 sm:py-2.5 text-[0.68rem] sm:text-[0.72rem] tracking-[0.16em] uppercase whitespace-nowrap rounded-full border transition-all duration-200 cursor-pointer flex-shrink-0
          ${active === c.value
            ? "text-[#0a0a0a] bg-[#c4a064] border-[#c4a064] font-medium"
            : "text-[#5a5550] border-white/10 hover:text-[#a09880] hover:border-white/25 bg-transparent"
          }`}
      >
        {c.label}
      </button>
    ))}
  </nav>
);

export default ProjectFilter;