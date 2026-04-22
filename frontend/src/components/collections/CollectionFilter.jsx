// src/components/ui/CollectionFilter.jsx

const TABS = [
  { label: "All",         value: "" },
  { label: "Kitchens",    value: "Kitchen" },
  { label: "Living Room", value: "LivingRoom" },
  { label: "Wardrobe",    value: "Wardrobe" },
  { label: "Bedroom",     value: "Bedroom" },
  { label: "Dining Room", value: "DiningRoom" },
  { label: "Home Office", value: "HomeOffice" },
  { label: "Bathroom",    value: "Bathroom" },
  { label: "Entryway",    value: "Entryway" },
  { label: "Outdoor",     value: "Outdoor" },
];

const CollectionFilter = ({ active, onChange }) => (
  <>
    <style>{`
      .col-filter {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 2.5rem clamp(1.25rem, 5vw, 4rem) 0;
        max-width: 1400px;
        margin: 0 auto;
      }
      .col-filter__tab {
        padding: 0.48rem 1.1rem;
        border-radius: 50px;
        border: 1px solid rgba(255,255,255,0.1);
        background: transparent;
        color: #5a5550;
        font-family: 'Jost', sans-serif;
        font-size: 0.65rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        cursor: pointer;
        white-space: nowrap;
        transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
      }
      .col-filter__tab:hover {
        border-color: rgba(196,160,100,0.4);
        color: #c4a064;
      }
      .col-filter__tab.is-active {
        background: rgba(196,160,100,0.1);
        border-color: #c4a064;
        color: #c4a064;
      }
    `}</style>

    <div className="col-filter">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          className={`col-filter__tab${active === tab.value ? " is-active" : ""}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </>
);

export default CollectionFilter;